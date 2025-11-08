# string-scribe

A web app that generates violin sheet music from audio input.

## Latest deployment: https://stringscribe.com

## Overview

Given an audio file, String Scribe uses spotify's [basic pitch](https://github.com/spotify/basic-pitch) algorithm to predict music events and converts it into viewable sheet music using [OSMD](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay). The flow looks something like this:

```mermaid
graph LR;
    file[Music File]-->midi[MIDI Data];
    midi-->MusicXML;
    MusicXML-->sheetMusic[sheet music];
```

String Scribe also offers a subscription plan that allows users to access unlimited transcriptions and enhanced features.

## Features

### Transcription

Users can paste a YouTube link or upload a file directly from their computer to have it transcribed in a matter of seconds. The user can then view the sheet music directly in the browser, or export it to a `.pdf` file.

### Subscriptions

String Scribe uses [stripe](https://stripe.com/) to accept payments for subscriptions. Currently, there are two subscription levels:

1. Free plan ($0/month) - limited number of transcriptions, and no transcriptions via a YouTube link.
2. Pro plan ($5.99/month)- unlimited transcriptions, including YouTube transcriptions.

### Authorization/Authentication

String Scribe uses [auth0](https://auth0.com/) to manage authorization and authentication for users. In addition to keeping our users' data secure, Auth0 provides many useful features out of the box, such as password resets or the ability to log in with a Google account.

String Scribe uses a simple form of [Role Based Access Control](https://auth0.com/docs/manage-users/access-control/rbac) (RBAC) to manage permissions for user subscriptions. If a user is subscribed to the Pro plan, they will have the `pro` role in Auth0 and will be able to access Pro plan features.

## Local development

String Scribe uses separate backend and frontend applications.

### Running Backend (`string-scribe/backend`)

String scribe uses the [FastAPI](https://fastapi.tiangolo.com/) python framework for its backend with [poetry](https://python-poetry.org/) for dependency management. Complete the following steps to deploy the backend:

1. Set the following environment variables. Since these environment variables are used to store sensitive information, you will need to reach out to a developer directly to get the correct values. We recommend storing these variables in a `.env` file.

| Variable name         | Description                                                               |
| --------------------- | ------------------------------------------------------------------------- |
| `STRIPE_SK`           | Stripe secret key.                                                        |
| `STRIPE_WEBHOOK_SK`   | Stripe webhook secret key.                                                |
| `STRIPE_PRICE_ID`     | The internal ID that associated with the Pro Plan subscription in Stripe. |
| `FRONTEND_HOST`       | The URL of the String Scribe frontend. Used for CORS and redirects.       |
| `AUTH0_BASE`          | The URL of the Auth0 deployment for String Scribe                         |
| `AUTH0_CLIENT_ID`     | Auth0 client ID                                                           |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret                                                       |
| `AUTH0_PRO_ROLE_ID`   | The internal ID that is associated with the `pro` role in Auth0.          |

2. `poetry install`

> [!IMPORTANT]
> This project requires specific versions of python. On windows, use python `3.10.9`. You might be able to run python `3.11` on other platforms, but this hasn't been tested.

3. `poetry run python main.py`

### Running Frontend (`string-scribe/frontend`)

String Scribe uses [React](https://react.dev/) and Typescript for its frontend. We also heavily use the [MUI](https://mui.com/material-ui/getting-started/) component library for easy design of the user interface. You can follow these steps to run the frontend:

1. Again, reach out to a developer and set the following environment variables in a `.env` file:

| Variable name                      | Description                                              |
| ---------------------------------- | -------------------------------------------------------- |
| `REACT_APP_AUTH0_DOMAIN`           | Domain of the Auth0 deployment for String Scribe.        |
| `REACT_APP_AUTH0_CLIENT_ID`        | Auth0 client ID.                                         |
| `REACT_APP_STRIPE_CUSTOMER_PORTAL` | URL (including `https://`) of the stripe customer portal |

2. `npm ci`
3. `npm run start`

## Group Members

Theodore Bagley - [github](https://github.com/TheodoreBagley)

Cody Hager - [github](https://github.com/CodyHager)

