import express from "express";
import createTranscription from "../utils/openai.js";
import upload from "../utils/multer.js";
import compressFile from "../utils/compresser.js";
import fs from "fs";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  const format = req.body.format;
  const language = req.body.language;
  const filePath = req.file.path;
  console.log(`${filePath} was uploaded`);

  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  const newFilePath = await compressFile(
    filePath,
    "compressed_" + filePath + ".mp3"
  );

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

export default router;