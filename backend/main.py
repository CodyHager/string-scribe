from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logger
from engine.engine import MusicEngine
import uvicorn

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


@app.post("/api/v1/upload")
async def uploadFile(file: UploadFile):
    # Validate file exists
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Validate file type
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    # Validate file size (max 50MB)
    max_size = 50 * 1024 * 1024  # 50MB in bytes
    if file.size and file.size > max_size:
        raise HTTPException(status_code=400, detail="File size must be less than 50MB")

    # Validate filename
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    await MusicEngine.Get_tab(file)
    return {}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_excludes=["./engine/processing/"],
    )
