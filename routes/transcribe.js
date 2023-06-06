import express from "express";
import createTranscription from "../utils/openai.js";
import silenceDetector from "../utils/silence.js";
import upload from "../utils/multer.js";
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

  const fileStream = fs.createReadStream(filePath);

  console.log("before");
  const segments = await silenceDetector(filePath);
  console.log("segments", segments);
  console.log("after");

  // createTranscription(fileStream, format, mode, filePath, res, language);
});

export default router;
