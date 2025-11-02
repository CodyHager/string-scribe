import requests, os, time
import logger
from model import AppMetadata
from datetime import datetime
from urllib.parse import urljoin

log = logger.get()

CURRENT_TOKEN = None
TOKEN_EXPIRY = 0
AUTH0_BASE = ""
AUTH0_CLIENT_ID = ""
AUTH0_CLIENT_SECRET = ""
AUTH0_PRO_ROLE_ID = ""


def init_client():
    global CURRENT_TOKEN, TOKEN_EXPIRY, AUTH0_BASE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_PRO_ROLE_ID
    AUTH0_BASE = os.getenv("AUTH0_BASE")
    if AUTH0_BASE is None or AUTH0_BASE == "":
        log.fatal("AUTH0 base env var not found. exiting...")

    AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
    if AUTH0_CLIENT_ID is None or AUTH0_CLIENT_ID == "":
        log.fatal("Auth0 client ID env var not found. exiting...")

    AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
    if AUTH0_CLIENT_SECRET is None or AUTH0_CLIENT_SECRET == "":
        log.fatal("Auth0 client secret env var not found. exiting...")

    AUTH0_PRO_ROLE_ID = os.getenv("AUTH0_PRO_ROLE_ID")
    if AUTH0_PRO_ROLE_ID is None or AUTH0_PRO_ROLE_ID == "":
        log.fatal("Auth0 role id env var not found. exiting...")
    CURRENT_TOKEN = None
    TOKEN_EXPIRY = 0


def Update_app_meta(user_id: str):
    global CURRENT_TOKEN, TOKEN_EXPIRY, AUTH0_BASE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_PRO_ROLE_ID
    try:
        t = datetime.now().isoformat()
        payload = {"app_metadata": {"last_invoice": t}}
        url = f"{AUTH0_BASE}/api/v2/users/{user_id}"
        token = get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        response = requests.patch(url, json=payload, headers=headers)
        if response.status_code != 200:
            log.error(f"unexpected response from Auth0: {response.json()}")
            raise ValueError(f"unexpected response from Auth0: {response.json()}")
    except Exception as err:
        log.error(f"Error while trying to update metadata for user: {err}")
        raise err


def Add_Pro_Role(user_id: str):
    global CURRENT_TOKEN, TOKEN_EXPIRY, AUTH0_BASE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_PRO_ROLE_ID
    try:
        payload = {"roles": [AUTH0_PRO_ROLE_ID]}
        url = f"{AUTH0_BASE}/api/v2/users/{user_id}/roles"
        token = get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        response = requests.post(url, json=payload, headers=headers)
        # Auth0 returns 204 No Content on success for role assignment
        if response.status_code not in (200, 204):
            error_msg = response.text
            try:
                error_json = response.json()
                error_msg = str(error_json)
            except:
                pass
            log.error(
                f"unexpected response from Auth0 (status {response.status_code}): {error_msg}"
            )
            raise ValueError(
                f"unexpected response from Auth0 (status {response.status_code}): {error_msg}"
            )
    except Exception as err:
        log.error(f"Error while trying to add role to user: {err}")
        raise err


def get_token() -> str:
    global CURRENT_TOKEN, TOKEN_EXPIRY, AUTH0_BASE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET
    if CURRENT_TOKEN and time.time() < TOKEN_EXPIRY:
        return CURRENT_TOKEN
    print(f"BASE: {AUTH0_BASE}")
    url = f"{AUTH0_BASE}/oauth/token"
    payload = {
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "audience": f"{AUTH0_BASE}/api/v2/",
        "grant_type": "client_credentials",
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    data = response.json()
    CURRENT_TOKEN = data["access_token"]
    ## default to 24hr
    expires_in = data.get("expires_in", 86400)
    ## refresh 2 minutes early
    TOKEN_EXPIRY = time.time() + expires_in - 180
    return CURRENT_TOKEN
