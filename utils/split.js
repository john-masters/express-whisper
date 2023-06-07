import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export default function audioSplitter(filePath, segments) {
  console.log("audioSplitter called");

  let start = 0;
  const baseFileName = path.basename(filePath, path.extname(filePath));
  const directoryPath = path.dirname(filePath);

  segments.forEach((segment, index) => {
    const cutStart = start;
    const cutEnd = segment;
    const outputFileName = `${baseFileName}-${index}.mp3`;
    const outputPath = path.join(directoryPath, outputFileName);

    ffmpeg(filePath)
      .noVideo()
      .audioFrequency(16000)
      .audioBitrate(48)
      .audioChannels(1)
      .audioCodec("libmp3lame")
      .format("mp3")
      .setStartTime(cutStart)
      .setDuration(cutEnd - cutStart)
      .output(outputPath)
      .on("start", () => {
        console.log(`Starting to split segment ${index + 1}`);
      })
      .on("end", () => {
        console.log(`Finished splitting segment ${index + 1}`);
      })
      .on("error", (err) => {
        console.log(
          `Error occurred while splitting segment ${index + 1}: ${err.message}`
        );
      })
      .run();
    start = cutEnd;
  });

  const outputFileName = `${baseFileName}-${segments.length + 1}.mp3`;
  const outputPath = path.join(directoryPath, outputFileName);

  ffmpeg(filePath)
    .setStartTime(start)
    .output(outputPath)
    .on("start", () => {
      console.log(`Starting to split the last segment`);
    })
    .on("end", () => {
      console.log(`Finished splitting the last segment`);
    })
    .on("error", (err) => {
      console.log(
        `Error occurred while splitting the last segment: ${err.message}`
      );
    })
    .run();
}
