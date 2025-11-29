import json, logger, uvicorn, base64, os, stripe
from fastapi import FastAPI, UploadFile, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Form
from engine.engine import MusicEngine
from util import MustGetEnv
import client.client as client
from middleware.rate_limit import (
    get_or_create_session_id,
    check_rate_limit,
    increment_usage,
)

from dotenv import load_dotenv

load_dotenv()  # reads variables from a .env file and sets them in os.environ

## instantiate logger
log = logger.get()

## get environment variables
STRIPE_SK_ENV = "STRIPE_SK"
STRIPE_WEBHOOK_SK_ENV = "STRIPE_WEBHOOK_SK"
STRIPE_PRICE_ID_ENV = "STRIPE_PRICE_ID"
FRONTEND_HOST_ENV = "FRONTEND_HOST"

stripe.api_key = MustGetEnv(STRIPE_SK_ENV)
webhook_sk = MustGetEnv(STRIPE_WEBHOOK_SK_ENV)
stripe_price_id = MustGetEnv(STRIPE_PRICE_ID_ENV)
frontend_host = MustGetEnv(FRONTEND_HOST_ENV)


app = FastAPI()

## allowed CORS web origins
origins = [frontend_host]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  ## allow cookies
    allow_methods=["*"],  ## allow all methods
    allow_headers=["*"],  ## allow all headers
    expose_headers=["set-cookie"],  ## expose set-cookie header
)


## initialize Auth0 client
@app.on_event("startup")
async def startup_event():
    client.InitClient()


## https://docs.stripe.com/api/checkout/sessions/object
## creates a Stripe checkout session for the Pro subscription
## will redirect client to the stripe checkout screen
@app.post("/api/v1/create-checkout-session")
async def createCheckoutSession(id: str = Form(...)):
    try:
        ## create checkout session object
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {  ## use the price_id indicating the pro subscription
                    "price": stripe_price_id,
                    "quantity": 1,
                },
            ],
            mode="subscription",
            ## set URLs to redirect to on success/cancel
            success_url=frontend_host + "/subscriptions?success=true",
            cancel_url=frontend_host + "/subscriptions?success=false",
            client_reference_id=id,
            ## attatch Auth0 User ID in metadata
            ## necessary to add roles in Auth0 when processing subscription
            subscription_data={
                "metadata": {"user_id": id},
            },
        )
    except Exception as e:
        log.error(f"error when creating stripe checkout session: {e}")
        return Response(status_code=500)
    ## redirect to wherever stripe is hosting the checkout page
    return RedirectResponse(url=checkout_session.url, status_code=303)


## webhook that stripe sends events to
## we currently only look for two events:
## 1: invoice.payment_succeeded for when a user creates a subscription
## 2: customer.subscription.deleted for when a user deletes a subscription
## https://docs.stripe.com/webhooks/quickstart
@app.post("/api/v1/process-subscription")
async def processSubscription(request: Request):
    payload = await request.body()
    try:
        ## the event is just a massive JSON object
        event = json.loads(payload)
    except json.decoder.JSONDecodeError as e:
        log.error("Webhook error while parsing request." + str(e))
        return JSONResponse({"success": False}, 400)
    if webhook_sk:
        ## Only verify the event if there is an endpoint secret defined
        ## Otherwise use the basic event deserialized with json
        sig_header = request.headers.get("stripe-signature")
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_sk)
        except stripe.error.SignatureVerificationError as e:
            log.error("⚠️  Webhook signature verification failed." + str(e))
            return JSONResponse({"success": False}, 400)
    ## Handle the subscription created event
    if event and event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        log.info(f"Payment for {invoice['amount_paid']} succeeded")
        ## extract user ID that we attatched when creating the checkout session
        user_id = invoice["parent"]["subscription_details"]["metadata"]["user_id"]
        if not user_id or user_id == "":
            log.error("empty user ID")
            return JSONResponse({"success": False}, 400)
        log.info(f"Creating subscription for user: {user_id}")
        ## add the Pro role to the user in Auth0
        try:
            client.AddProRole(user_id)
        except:
            return JSONResponse({"success": False}, 500)
    ## Handle the subscription deleted event
    elif event and event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        ## extract user ID
        user_id = subscription["metadata"].get("user_id")
        if not user_id or user_id == "":
            log.error("empty user ID")
            return JSONResponse({"success": False}, 400)
        log.info(f"Deleting subscription for user: {user_id}")
        ## remove Pro role in Auth0
        try:
            client.RemoveProRole(user_id)
        except:
            return JSONResponse({"success": False}, 500)
    else:
        # Unexpected event type
        log.warning("Unhandled event type {}".format(event["type"]))
    return JSONResponse({"success": True}, 200)


## endpoint for transcribing a music file
@app.post("/api/v1/upload")
async def uploadFile(request: Request, response: Response, file: UploadFile):
    ## check if user has a pro subscription, will be defined by a header in the request
    user_is_pro_header = request.headers.get("User-Is-Pro")
    is_pro = False
    if user_is_pro_header is not None and bool(user_is_pro_header):
        is_pro = True

    ## determine whether or not the connection is secure (needed for cookies)
    secure = request.url.scheme == "https"

    if not is_pro:
        # Get or create session ID
        session_id = get_or_create_session_id(request)

        # Check rate limit
        is_allowed, remaining, reset_time = check_rate_limit(session_id)

        if not is_allowed:
            log.warning(f"Rate limit exceeded for session {session_id}")
            response.set_cookie(
                key="session_id",
                value=session_id,
                max_age=24 * 60 * 60,
                httponly=True,
                samesite="lax",
                secure=secure,  # Allow on localhost HTTP
            )
            log.info(f"[COOKIE] Setting cookie on 429 response: {session_id}")
            return JSONResponse(
                status_code=429,  ## means too many request
                content={
                    "detail": "Translation limit reached. Please subscribe for unlimited access.",
                    "remaining": 0,
                    "reset_time": reset_time,
                },
            )
    else:
        log.info("User has the pro role, will skip rate limiting")

    # Validate file exists
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Validate file type
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    # Validate file size (max 50MB)
    max_size = 50 * 1024 * 1024
    if file.size and file.size > max_size:
        raise HTTPException(status_code=400, detail="File size must be less than 50MB")

    # Validate filename
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    ## get music XML (for creating rendering sheet music) and MIDI (for playing audio)
    mxml, midi = await MusicEngine.ProcessMusic(file)
    ## base64 encode MIDI
    midi_b64 = base64.b64encode(midi).decode("utf-8")

    if not is_pro:
        # Increment usage count
        increment_usage(session_id)

        # Get updated remaining count
        _, remaining, reset_time = check_rate_limit(session_id)

        # Set session cookie using Response parameter
        response.set_cookie(
            key="session_id",
            value=session_id,
            max_age=24 * 60 * 60,  # 24 hours
            httponly=True,
            samesite="lax",
            secure=secure,  # Allow on localhost HTTP
        )

        log.info(f"[COOKIE] Setting cookie on success response: {session_id}")

    # Return JSON response
    return {
        "mxml": mxml,
        "midi": midi_b64,
    }


# Endpoint for transcribing a YouTube video (Premium only)
@app.post("/api/v1/upload-youtube")
async def uploadYouTube(
    request: Request, response: Response, url: str = Form(...), user_id: str = Form(...)
):
    # Check if user has Pro role
    try:
        has_pro = client.HasProRole(user_id)
        if not has_pro:
            raise HTTPException(
                status_code=403,
                detail="YouTube transcription is only available for premium subscribers. Please upgrade your account.",
            )
    except Exception as e:
        log.error(f"Error checking user role: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to verify subscription status"
        )

    # Validate URL
    if not url or url.strip() == "":
        raise HTTPException(status_code=400, detail="No URL provided")

    try:
        # Download YouTube audio and process it
        mxml, midi = await MusicEngine.ProcessYouTube(url)
        # Base64 encode MIDI
        midi_b64 = base64.b64encode(midi).decode("utf-8")

        # Return JSON response
        return {"mxml": mxml, "midi": midi_b64}
    except Exception as e:
        log.error(f"Error processing YouTube URL: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to process YouTube video: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        reload_excludes=["./engine/processing/"],
    )
