import express from 'express';
import { createTranscription } from '../utils/openai.js';
import { upload } from '../utils/multer.js';
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
  const fileStream = fs.createReadStream(filePath);

  createTranscription(fileStream, format, filePath, res);
});

export { router as transcribeRouter };