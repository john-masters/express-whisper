import express from 'express';
import { createTranscription } from '../utils/openai.js';
import { upload } from '../utils/multer.js';
import { convertTo16kMP3 } from '../utils/converter.js';
import fs from "fs";

const router = express.Router()

router.post("/", upload.single("file"), async (req, res) => {
  const format = req.body.format;
  const filePath = req.file.path;
  console.log(`${filePath} was uploaded`);
  
  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  };
  // const fileStream = fs.createReadStream(filePath);

  const newFilePath = await convertTo16kMP3(filePath, "converted_" + filePath + ".mp3");
  const newFileStream = fs.createReadStream(newFilePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting ${filePath}:`, err);
    } else {
      console.log(`${filePath} was deleted`);
    }
  });

  // console.log(`
  //   fileStream: ${fileStream}
  //   newFileStream: ${newFileStream}
  //   newFileStreamObject: ${newFileStreamObject}
  // `)

  createTranscription(newFileStream, format, newFilePath, res);
  // createTranscription(fileStream, format, filePath, res);
});

export { router as transcribeRouter };