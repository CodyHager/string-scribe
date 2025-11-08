import json
from model import UserID
from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import logger
from engine.engine import MusicEngine
import uvicorn
import base64, os
import stripe
from fastapi import Form
import client.client as client

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

stripe_price_id = os.getenv("STRIPE_PRICE_ID")
if stripe_price_id is None:
    log.fatal("stripe price id not found. exiting...")


@app.on_event("startup")
async def startup_event():
    client.init_client()


@app.post("/create-checkout-session")
async def createCheckoutSession(id: str = Form(...)):
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": stripe_price_id,
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=frontend_host + "/subscriptions?success=true",
            cancel_url=frontend_host + "/subscriptions?success=false",
            client_reference_id=id,
            subscription_data={
                "metadata": {"user_id": id},
            },
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
    payload = await request.body()
    try:
        event = json.loads(payload)
    except json.decoder.JSONDecodeError as e:
        log.error("⚠️  Webhook error while parsing basic request." + str(e))
        return JSONResponse({"success": False}, 400)
    if webhook_sk:
        # Only verify the event if there is an endpoint secret defined
        # Otherwise use the basic event deserialized with json
        sig_header = request.headers.get("stripe-signature")
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_sk)
        except stripe.error.SignatureVerificationError as e:
            log.error("⚠️  Webhook signature verification failed." + str(e))
            return JSONResponse({"success": False}, 400)
    # Handle the event
    if event and event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        log.info(f"Payment for {invoice['amount_paid']} succeeded")
        user_id = invoice["parent"]["subscription_details"]["metadata"]["user_id"]
        if not user_id or user_id == "":
            log.error("empty user ID")
            return JSONResponse({"success": False}, 400)
        log.info(f"Creating subscription for user: {user_id}")
        try:
            client.Add_Pro_Role(user_id)
        except:
            return JSONResponse({"success": False}, 500)
    elif event and event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        user_id = subscription["metadata"].get("user_id")
        if not user_id or user_id == "":
            log.error("empty user ID")
            return JSONResponse({"success": False}, 400)
        log.info(f"Deleting subscription for user: {user_id}")
        try:
            client.Remove_Pro_Role(user_id)
        except:
            return JSONResponse({"success": False}, 500)
    else:
        # Unexpected event type
        log.warning("Unhandled event type {}".format(event["type"]))
    return JSONResponse({"success": True}, 200)


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
