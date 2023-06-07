import express from "express";
import getDuration from "../utils/duration.js";
import createTranscription from "../utils/openai.js";
import silenceDetector from "../utils/silence.js";
import upload from "../utils/multer.js";
import fs from "fs";
import audioSplitter from "../utils/split.js";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  console.log(filePath);
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
  const duration = await getDuration(filePath);

  if (duration < 1800) {
    createTranscription(fileStream, format, mode, filePath, res, language);
  } else {
    try {
      const segments = await silenceDetector(filePath);
      audioSplitter(filePath, segments);
    } catch (err) {
      console.log(err);
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
});

export default router;
