import express from "express";
import getDuration from "../utils/duration.js";
import {
  createMultiTranscription,
  createTranscription,
} from "../utils/openai.js";
import silenceDetector from "../utils/silence.js";
import upload from "../utils/multer.js";
import audioSplitter from "../utils/split.js";
import path from "path";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  let mode, format, language, customerData;

  if (req.body.mode === "transcribe") {
    ({ mode, format, language, customerData } = req.body);
  } else {
    ({ mode, format, customerData } = req.body);
  }

  console.log(`${filePath} was uploaded`);

  if (!filePath) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  try {
    const duration = await getDuration(filePath);
    let transcript, extension;

    if (duration < 1800) {
      transcript = await createTranscription(
        filePath,
        format,
        mode,
        res,
        language
      );
    } else {
      // get array of timestamps where silence occurs around every 30 minutes
      const segments = await silenceDetector(filePath);

      // split audio into segments based on silence timestamps
      const segmentPaths = await audioSplitter(filePath, segments);

      // // for loop through segmentPaths and create transcription for each
      transcript = await createMultiTranscription(
        filePath,
        segmentPaths,
        format,
        mode,
        res,
        language
      );
    }

    switch (format) {
      case "text":
        extension = ".txt";
        break;

      case "srt":
        extension = ".srt";
        break;

      case "vtt":
        extension = ".vtt";
        break;
    }

    const fileName =
      path.basename(filePath, path.extname(filePath)) + extension;

    res.set({
      "Content-Type": "Application/octet-stream",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });

    res.send(Buffer.from(transcript));
  } catch (err) {
    console.log(err);
  }
});

export default router;
