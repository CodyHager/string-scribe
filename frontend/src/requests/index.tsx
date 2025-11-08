import axios from "axios";
import { FileUploadType } from "../types";
import { BACKEND_BASE } from "../config";

// upload file to backend
export const UploadFile = async (fileData: FileUploadType) => {
  const formData = new FormData();
  formData.append("file", fileData.file);
  return axios.post(`${BACKEND_BASE}/api/v1/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
