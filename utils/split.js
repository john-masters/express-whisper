import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export default function audioSplitter(filePath, segments) {
  console.log("audioSplitter called");

  let start = 0;
  segments.forEach((segment, index) => {
    const cutStart = start;
    const cutEnd = segment;
    const outputFileName = `${filePath}-${index}.mp3`;
    const outputPath = `./uploads/${outputFileName}`;
  });
}
