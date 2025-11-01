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

export const IsPro = (user: User): boolean => {
  const roles: string[] = user?.[`${AUTH0_CLAIM_NS}/roles`];
  return roles?.includes("pro");
};
