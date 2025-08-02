from io import BytesIO
from fastapi import UploadFile
from typing import BinaryIO
from basic_pitch.inference import predict
from basic_pitch import ICASSP_2022_MODEL_PATH
from music21 import converter

import logger, os, io


log = logger.get()

# Create the directory if it doesn't exist
os.makedirs("processing", exist_ok=True)


class MusicEngine:

    async def Get_music_xml(file: UploadFile):
        ## step 1: audio to MIDI
        file_path = await create_file(file)
        log.info(f"attempting to predict MIDI for {file_path}")
        model_output, midi_data, note_events = predict(file_path)

        midi_file_path = f"{file_path}-midi.mid"
        log.info(f"attempting to write midi file to {midi_file_path}")
        midi_data.write(midi_file_path)

        ## step 2: MIDI to musicXML
        log.info(f"attempting to convert MIDI to musicXML")
        mxml_file_path = f"{file_path}-mxml.musicxml"
        score = converter.parse(midi_file_path)
        score.write('musicxml', mxml_file_path)
        mxml_string = read_file(mxml_file_path)
        ## cleanup
        delete_file(file_path)
        delete_file(midi_file_path)
        delete_file(mxml_file_path)
        return mxml_string

def read_file(filePath: str) -> str:
    with open(filePath, 'r') as file:
        file_content = file.read()
        return file_content

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
