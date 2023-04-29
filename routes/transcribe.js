import express from 'express';
import { createTranscription } from '../utils/openai.js';
import { upload } from '../utils/multer.js';
import { convertTo16kMP3 } from '../utils/converter.js';
import fs from "fs";

const router = express.Router()

router.post("/", upload.single("file"), async (req, res) => {
  const format = req.body.format;
  const language = req.body.language;
  const filePath = req.file.path;
  console.log(`
    format: ${format}
    language: ${language}
    filePath: ${filePath}
    `)
  console.log(`${filePath} was uploaded`);
  
  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  };

  const newFilePath = await convertTo16kMP3(filePath, "converted_" + filePath + ".mp3");
  const newFileStream = fs.createReadStream(newFilePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting ${filePath}:`, err);
    } else {
      console.log(`${filePath} was deleted`);
    }
  });

  createTranscription(newFileStream, format, language, newFilePath, res);
});

export { router as transcribeRouter };