import express from "express";
import createTranscription from "../utils/openai.js";
import upload from "../utils/multer.js";
import compressFile from "../utils/compresser.js";
import fs from "fs";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  let mode, format, language;

  if (req.body.mode === "transcribe") {
    ({ mode, format, language } = req.body);
  } else {
    ({ mode, format } = req.body);
  }

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

  createTranscription(newFileStream, format, mode, newFilePath, res, language);
});

export default router;
