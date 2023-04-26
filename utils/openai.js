import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const customAxiosInstance = axios.create({
  maxBodyLength: Infinity
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(
  configuration, undefined, customAxiosInstance
);

export async function createTranscription(fileStream, format, filePath, res, unlinkFile = true) {
  try {
    console.log("Transcription started")

    const result = await openai.createTranscription(
      fileStream,
      "whisper-1",
      "",
      format,
      "0",
      "en"
    );

    console.log("Transcription finished")
    return result.data;

  } catch (err) {
    console.log("error: ", err);
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err)
        return;
      }
      console.log(`${filePath} was deleted`);
    });
  }
}

export async function splitFile(filePath) {
  const maxPartSize = 25;
  const fileSizeInMegabytes = fs.statSync(filePath).size / 1000000;

  const partCount = Math.ceil(fileSizeInMegabytes / maxPartSize);

  let fileParts = [];

  for (let i = 0; i < partCount; i++) {
    const partPath = `${filePath}-${uuidv4()}`;
    const start = i * maxPartSize;
    const end = Math.min((i + 1) * maxPartSize, fileSizeInMegabytes);

    const buffer = fs.readFileSync(filePath).slice(start, end)
    fs.writeFileSync(partPath, buffer);

    fileParts.push({ path: partPath, start, end});
  }

  return fileParts;
}