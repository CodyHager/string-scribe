import { User } from "@auth0/auth0-react";
import { AUTH0_CLAIM_NS } from "./config";

export const DecodeBase64Data = (base64String: string): Uint8Array => {
  // can I just say I hate that this is the easiest way to do this (CMIIW)
  const decodedBinaryString = atob(base64String);
  const actualBytes = new Uint8Array(decodedBinaryString.length);
  for (let i = 0; i < decodedBinaryString.length; i++) {
    actualBytes[i] = decodedBinaryString.charCodeAt(i);
  }
  return actualBytes;
};

// given an Auth0 user, returns whether or not they have a pro subscription
export const IsPro = (user: User): boolean => {
  const roles: string[] = user?.[`${AUTH0_CLAIM_NS}/roles`];
  return roles?.includes("pro");
};

export const PurpleGradientSX =
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
export const PurpleGradientHoverSX =
  "linear-gradient(135deg, #5568d3 0%, #653a8f 100%)";

export const RedGradientSX =
  "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)";
export const RedGradientHoverSX =
  "linear-gradient(135deg, #CC0000 0%, #990000 100%)";
