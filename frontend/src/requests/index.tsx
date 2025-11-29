import axios from "axios";
import { FileUploadType } from "../types";
import { BACKEND_BASE } from "../config";

// upload file to backend
export const UploadFile = async (fileData: FileUploadType, isPro: boolean) => {
  const formData = new FormData();
  formData.append("file", fileData.file);
  return axios.post(`${BACKEND_BASE}/api/v1/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "User-Is-Pro": isPro,
    },
    withCredentials: true,
  });
};

// upload YouTube URL to backend
export const UploadYouTube = async (url: string, userId: string) => {
  const formData = new FormData();
  formData.append("url", url);
  formData.append("user_id", userId);
  return axios.post(`${BACKEND_BASE}/api/v1/upload-youtube`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};
