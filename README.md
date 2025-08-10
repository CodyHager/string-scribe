# string-scribe

## Latest deployment: TBD
A web app that generates violin sheet music from audio input. 
It uses spotify's [basic pitch](https://github.com/spotify/basic-pitch) algorithm to predict the music events and converts it into viewable sheet music using [OSMD](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay). The flow looks something like this:

```mermaid
graph LR;
    file[Music File]-->midi[MIDI Data];
    midi-->MusicXML;
    MusicXML-->sheetMusic[sheet music];
```

## Local development

### Running FastAPI backend
1. clone this repository
2. `cd backend && poetry install`
> [!IMPORTANT]
> This project requires specific versions of python. On windows, use python `3.10.9`. You might be able to run python `3.11` on other platforms, but this hasn't been tested.
3. `poetry run python main.py`

### Running React/Typescript frontend
1. clone this repository
2. `cd frontend && npm ci`
3. `npm run start`



