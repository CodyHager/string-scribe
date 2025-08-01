from io import BytesIO
import os, crepe
from fastapi import UploadFile
from pydub import AudioSegment
from scipy.io import wavfile
from typing import BinaryIO

import logger


log = logger.get()

# Create the directory if it doesn't exist
os.makedirs("processing", exist_ok=True)

class MusicEngine:

    async def Get_tab(file: UploadFile):
        mp3_path = await create_file(file)
        sound = AudioSegment.from_mp3(mp3_path)
        wav_path = f"{mp3_path}.wav"
        sound.export(wav_path, format="wav")
        sr, audio = wavfile.read(wav_path)
        time, frequency, confidence, activation = crepe.predict(
            audio=audio, sr=sr, model_capacity="tiny", viterbi=False, verbose=1
        )
        log.info(
            f"time: {time}, frequency: {frequency}, confidence: {confidence}, activation: {activation}"
        )
        delete_file(mp3_path)
        delete_file(wav_path)


def delete_file(filePath: str):
    if os.path.exists(filePath):
        os.remove(filePath)
        log.info(f"removed file at path {filePath}")
    else:
        log.info(f"file at path {filePath} not found")


async def create_file(file: UploadFile) -> str:
    log.info(f"creating file {file.filename}")
    out_path = f"./processing/{file.filename}"
    with open(out_path, "wb") as f:
        f.write(await file.read())
    return out_path
