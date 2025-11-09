import json, logger, uvicorn, base64, os, stripe
from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Form
from engine.engine import MusicEngine
from util import MustGetEnv
import client.client as client

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
async def uploadFile(file: UploadFile):
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
    return {"mxml": mxml, "midi": midi_b64}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        reload_excludes=["./engine/processing/"],
    )
