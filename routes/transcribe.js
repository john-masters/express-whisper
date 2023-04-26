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

  const fileSizeInMegabytes = fs.statSync(filePath).size / 1000000;

  if (fileSizeInMegabytes > 25) {
    console.log("File size exceeds 25 MB, splitting file");
    const fileParts = await splitFile(filePath);

    let combinedResult = "";

    for (const filePart of fileParts) {
      const fileStream = fs.createReadStream(filePart.path);
      const result = await createTranscription(fileStream, format, filePart.path, res, false);
      combinedResult += result;

      // Delete the temporary part file
      fs.unlinkSync(filePart.path);
    }

    sendResultAsResponse(combinedResult, format, filePath, res);

  } else {
    const fileStream = fs.createReadStream(filePath);
    const result = await createTranscription(fileStream, format, filePath, res);

    sendResultAsResponse(result, format, filePath, res);
  }
});

function sendResultAsResponse(result, format, filePath, res) {
  const extension = () => {
    switch (format) {
      case "text":
        return ".txt"
      case "srt":
        return ".srt"
      case "vtt":
        return ".vtt"
    }
  };

  const fileName = path.basename(filePath, path.extname(filePath)) + extension();

  res.set({
    "Content-Type": "Application/octet-stream",
    "Content-Disposition": `attachment; filename=${fileName}`
  });
  res.send(Buffer.from(result))
}

export { router as transcribeRouter };