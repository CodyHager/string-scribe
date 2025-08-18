import json
from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.responses import RedirectResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import logger
from engine.engine import MusicEngine
import uvicorn
import base64, os
import stripe

log = logger.get()

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allow cookies, authorization headers, etc.
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all HTTP headers
)

stripe_sk = os.getenv("STRIPE_SK")
if stripe_sk is None:
    log.fatal("stripe secret key env not found. exiting...")
else:
    stripe.api_key = stripe_sk

webhook_sk = os.getenv("STRIPE_WEBHOOK_SK")
if webhook_sk is None:
    log.fatal("stripe webhook key env not found. exiting...")

frontend_host = os.getenv("FRONTEND_HOST")
if frontend_host is None:
    log.fatal("frontend host env not found. exiting...")


@app.post("/create-checkout-session")
async def createCheckoutSession():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": "price_1RxFxkLz81Xps4Dn3ecLGKvv",
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=frontend_host + "/subscriptions?success=true",
            cancel_url=frontend_host + "/subscriptions?success=false",
        )
    except Exception as e:
        log.error(f"error when creating stripe checkout session: {e}")
        return Response(status_code=500)

    return RedirectResponse(url=checkout_session.url, status_code=303)


## webhook that stripe hits after successful payment
## https://docs.stripe.com/webhooks/quickstart
@app.post("/api/v1/process-subscription")
async def processSubscription(request: Request):
    log.info("received webhook for subscription")
    payload = request.data
    try:
        event = json.loads(payload)
    except json.decoder.JSONDecodeError as e:
        log.error("⚠️  Webhook error while parsing basic request." + str(e))
        return {"success": False}
    if webhook_sk:
        # Only verify the event if there is an endpoint secret defined
        # Otherwise use the basic event deserialized with json
        sig_header = request.headers.get("stripe-signature")
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_sk)
        except stripe.error.SignatureVerificationError as e:
            log.error("⚠️  Webhook signature verification failed." + str(e))
            return {"success": False}

    # Handle the event
    if event and event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]  # contains a stripe.PaymentIntent
        log.info("Payment for {} succeeded".format(payment_intent["amount"]))
        ## TODO: finish this later
    else:
        # Unexpected event type
        log.error("Unhandled event type {}".format(event["type"]))
    return {"success": True}


@app.post("/api/v1/upload")
async def uploadFile(file: UploadFile):
    # Validate file exists
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Validate file type
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    # Validate file size (max 50MB)
    max_size = 50 * 1024 * 1024  # 50MB in bytes
    if file.size and file.size > max_size:
        raise HTTPException(status_code=400, detail="File size must be less than 50MB")

    # Validate filename
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    mxml, midi = await MusicEngine.Get_music_xml(file)
    midi_b64 = base64.b64encode(midi).decode("utf-8")
    return {"mxml": mxml, "midi": midi_b64}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_excludes=["./engine/processing/"],
    )
