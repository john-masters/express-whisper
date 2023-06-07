import express from "express";
import getDuration from "../utils/duration.js";
import {
  createMultiTranscription,
  createTranscription,
} from "../utils/openai.js";
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

  const duration = await getDuration(filePath);

  if (duration < 1800) {
    createTranscription(filePath, format, mode, res, language);
  } else {
    try {
      // get array of timestamps where silence occurs around every 30 minutes
      const segments = await silenceDetector(filePath);

      // split audio into segments based on silence timestamps
      const segmentPaths = await audioSplitter(filePath, segments);

      // delete original file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting ${filePath}:`, err);
          return;
        }
        console.log(`${filePath} was deleted`);
      });

      // for loop through segmentPaths and create transcription for each
      createMultiTranscription(segmentPaths, format, mode, res, language);
    } catch (err) {
      console.log(err);
    }
  }
});

export default router;
