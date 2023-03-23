# Transcription-Summary

OpenAI-powered service to provide summaries of long audio transcriptions.

> **Important:** This app is a Proof of Concept and is not intended for production use.

## Environment

This application needs [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) to run.

After cloning the repository, run the following commands:

```bash
yarn install --frozen-lockfile
yarn start
```

This will generate a `dist` folder with the transpiled JavaScript code and run it.

There are a few environment variables that can be set, or by setting them in a `.env` file in the root of the project.

The variables can be found in the [`sample.env`](sample.env) file, and are the following:

| Variable                    | Description                                                      | Required | Default |
| --------------------------- | ---------------------------------------------------------------- | -------- | ------- |
| `OPEN_AI_KEY`               | The OpenAI API key to use                                        | Yes      | -       |
| `PORT`                      | The port to run the server on                                    | No       | `80`    |
| `LOG_LEVEL`                 | The log level to use, can be `debug`, `info`, `warn` and `error` | No       | `info`  |
| `RATE_LIMIT_REQ_PER_WINDOW` | The number of requests by the same IP address per window of time | No       | `100`   |
| `RATE_LIMIT_WINDOW`         | The rate limit time window in minutes                            | No       | `2`     |

## Usage

There are two endpoints available.

Both use `multipart/form-data` as the body `Content-Type`. And share the following parameters:

-   `audio-file` **\[REQUIRED\]**: The audio file to transcribe and summarize. Can be in any format supported by [FFmpeg](https://ffmpeg.org/) and have a maximum of 1GB.

-   `description`: A short description of what the audio is about. This will be used to generate the summary.

### Transcribe

Provides a transcription of the audio file.

**Method:** `POST`

**Endpoint:** `/transcribe`

**Response:**

```json
{
    "transcription": "<The transcription of the audio file>"
}
```

### Summarize

Provides a transcription of the audio file.

**Method:** `POST`

**Endpoint:** `/summarize`

**Body:**

-   `lang:` The desired language of the summary response. Defaults to `en`.

**Response:**

```json
{
    "summary": "<The summary of the audio file>"
}
```
