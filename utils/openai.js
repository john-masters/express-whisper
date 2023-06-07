import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const customAxiosInstance = axios.create({
  maxBodyLength: Infinity,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration, undefined, customAxiosInstance);

export async function createTranscription(
  filePath,
  format,
  mode,
  res,
  language = null
) {
  try {
    console.log("Transcription started");

    const fileStream = fs.createReadStream(filePath);
    let result;
    if (mode === "transcribe") {
      result = await openai.createTranscription(
        fileStream,
        "whisper-1",
        "",
        format,
        "0",
        language
      );
    } else {
      result = await openai.createTranslation(
        fileStream,
        "whisper-1",
        "",
        format,
        "0"
      );
    }

    console.log("Transcription finished");
    const extension = () => {
      switch (format) {
        case "text":
          return ".txt";
        case "srt":
          return ".srt";
        case "vtt":
          return ".vtt";
      }
    };

    const fileName =
      path.basename(filePath, path.extname(filePath)) + extension();

    res.set({
      "Content-Type": "Application/octet-stream",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });
    res.send(Buffer.from(result.data));
  } catch (err) {
    console.log("error: ", err);
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting ${filePath}:`, err);
        return;
      }
      console.log(`${filePath} was deleted`);
    });
  }
}

// TODO: complete this function
export async function createMultiTranscription(
  filePath,
  segmentPaths,
  format,
  mode,
  res,
  language = null
) {
  try {
    const responses = await Promise.all(
      segmentPaths.map(async (segmentPath, index) => {
        try {
          console.log(`Transcription for ${segmentPath} started`);

          const fileStream = fs.createReadStream(segmentPath);

          let result;
          if (mode === "transcribe") {
            result = await openai.createTranscription(
              fileStream,
              "whisper-1",
              "",
              format,
              "0",
              language
            );
          } else {
            result = await openai.createTranslation(
              fileStream,
              "whisper-1",
              "",
              format,
              "0"
            );
          }
          console.log(`Transcription for ${segmentPath} finished`);
          return result.data;
        } catch (err) {
          console.log("error: ", err);
        } finally {
          fs.unlink(segmentPath, (err) => {
            if (err) {
              console.error(`Error deleting ${segmentPath}:`, err);
              return;
            }
            console.log(`${segmentPath} was deleted`);
          });
        }
      })
    );

    const extension = () => {
      switch (format) {
        case "text":
          return ".txt";
        case "srt":
          return ".srt";
        case "vtt":
          return ".vtt";
      }
    };

    const fileName =
      path.basename(filePath, path.extname(filePath)) + extension();

    const concatResponses = responses.join("");

    res.set({
      "Content-Type": "Application/octet-stream",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });
    res.send(Buffer.from(concatResponses));
  } catch (err) {
    console.log("error: ", err);
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting ${filePath}:`, err);
        return;
      }
      console.log(`${filePath} was deleted`);
    });
  }
}
