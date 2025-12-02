FROM python:3.10.9 AS builder
WORKDIR /app
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false \
 && poetry install --no-root --no-interaction --no-ansi

## spotify basic pitch is weird... need to uninstall this
RUN pip uninstall --yes tflite-runtime
RUN rm /usr/local/lib/python3.10/site-packages/basic_pitch/saved_models/icassp_2022/nmp.tflite

## used for extracting audio
RUN apt-get update && apt-get install -y ffmpeg

COPY . .

CMD ["python", "main.py"]