export const DecodeBase64Data = (base64String: string): Uint8Array => {
  // can I just say I hate that this is the easiest way to do this (CMIIW)
  const decodedBinaryString = atob(base64String);
  const actualBytes = new Uint8Array(decodedBinaryString.length);
  for (let i = 0; i < decodedBinaryString.length; i++) {
    actualBytes[i] = decodedBinaryString.charCodeAt(i);
  }
  return actualBytes;
};
