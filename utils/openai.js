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

export default async function createTranscription(
  fileStream,
  format,
  mode,
  filePath,
  res,
  language = null
) {
  try {
    console.log("Transcription started");

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
