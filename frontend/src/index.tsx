import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "./config";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

// not logging actual env var names here
if (!AUTH0_DOMAIN) {
  throw new Error("missing required environment variable for Auth0 domain");
}
if (!AUTH0_CLIENT_ID) {
  throw new Error("missing required environment variable for Auth0 client");
}
root.render(
  <React.StrictMode>
    {/* // wrap app in Auth0 provider  */}
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);
