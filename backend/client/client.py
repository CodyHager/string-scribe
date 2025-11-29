import logger, requests, os, time
from util import MustGetEnv
from datetime import datetime

## client.py is used to interact with the Auth0 management api
## namely, to add and remove user roles

log = logger.get()

AUTH0_BASE_ENV = "AUTH0_BASE"
AUTH0_CLIENT_ID_ENV = "AUTH0_CLIENT_ID"
AUTH0_CLIENT_SECRET_ENV = "AUTH0_CLIENT_SECRET"
AUTH0_ROLE_ID_ENV = "AUTH0_PRO_ROLE_ID"

## cache token so we don't need to get a new one on every request
CURRENT_TOKEN = None
TOKEN_EXPIRY = 0
## env vars
AUTH0_BASE = ""
AUTH0_CLIENT_ID = ""
AUTH0_CLIENT_SECRET = ""
AUTH0_PRO_ROLE_ID = ""


def InitClient():
    global AUTH0_BASE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_PRO_ROLE_ID
    AUTH0_BASE = MustGetEnv(AUTH0_BASE_ENV)
    AUTH0_CLIENT_ID = MustGetEnv(AUTH0_CLIENT_ID_ENV)
    AUTH0_CLIENT_SECRET = MustGetEnv(AUTH0_CLIENT_SECRET_ENV)
    AUTH0_PRO_ROLE_ID = MustGetEnv(AUTH0_ROLE_ID_ENV)


## https://auth0.com/docs/api/management/v2/users/post-user-roles
def AddProRole(user_id: str):
    try:
        ## payload is what roles we want to add
        payload = {"roles": [AUTH0_PRO_ROLE_ID]}
        url = f"{AUTH0_BASE}/api/v2/users/{user_id}/roles"
        ## get auth token and add it to header
        token = getToken()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        response = requests.post(url, json=payload, headers=headers)
        # Auth0 returns 204 No Content on success for role assignment
        if response.status_code > 299:
            ## log and throw error
            error_msg = response.text
            log.error(
                f"unexpected response from Auth0 (status {response.status_code}): {error_msg}"
            )
            raise ValueError(
                f"unexpected response from Auth0 (status {response.status_code}): {error_msg}"
            )
    except Exception as err:
        log.error(f"Error while trying to add role to user: {err}")
        raise err


## https://auth0.com/docs/api/management/v2/users/delete-user-roles
## basically same thing as AddProRole, just change request method to DELETE
def RemoveProRole(user_id: str):
    try:
        payload = {"roles": [AUTH0_PRO_ROLE_ID]}
        url = f"{AUTH0_BASE}/api/v2/users/{user_id}/roles"
        token = getToken()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        response = requests.delete(url, json=payload, headers=headers)
        # Auth0 returns 204 No Content on success for role deletion
        if response.status_code > 299:
            error_msg = response.text
            log.error(
                f"unexpected response from Auth0 (status {response.status_code}): {error_msg}"
            )
            raise ValueError(
                f"unexpected response from Auth0 (status {response.status_code}): {error_msg}"
            )
    except Exception as err:
        log.error(f"Error while trying to add role to user: {err}")
        raise err


## fetches a new token from Auth0 if the cached one is expired
def getToken() -> str:
    global CURRENT_TOKEN, TOKEN_EXPIRY, AUTH0_BASE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET
    if CURRENT_TOKEN and time.time() < TOKEN_EXPIRY:
        return CURRENT_TOKEN
    url = f"{AUTH0_BASE}/oauth/token"
    payload = {
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "audience": f"{AUTH0_BASE}/api/v2/",
        "grant_type": "client_credentials",
    }
    ## make request to Auth0
    response = requests.post(url, json=payload)
    response.raise_for_status()
    data = response.json()
    ## extract token from response
    CURRENT_TOKEN = data["access_token"]
    ## default to 24hr
    expires_in = data.get("expires_in", 86400)
    ## refresh 2 minutes early
    TOKEN_EXPIRY = time.time() + expires_in - 180
    return CURRENT_TOKEN


# Check if user has Pro role
def HasProRole(user_id: str) -> bool:
    try:
        url = f"{AUTH0_BASE}/api/v2/users/{user_id}/roles"
        token = getToken()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            error_msg = response.text
            log.error(
                f"unexpected response from Auth0 (status {response.status_code}): {error_msg}"
            )
            return False

        roles = response.json()
        # Check if the pro role is in the user's roles
        for role in roles:
            if role.get("id") == AUTH0_PRO_ROLE_ID:
                return True
        return False

    except Exception as err:
        log.error(f"Error while checking user roles: {err}")
        return False
