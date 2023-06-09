import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export default function audioSplitter(filePath, segments) {
  console.log("audioSplitter called");

  const baseFileName = path.basename(filePath, path.extname(filePath));
  const directoryPath = path.dirname(filePath);

  const promises = segments.map((segment, index) => {
    const cutStart = index > 0 ? segments[index - 1] : 0;
    const cutEnd = segment;
    const outputFileName = `${baseFileName}-${index}.mp3`;
    const outputPath = path.join(directoryPath, outputFileName);

    return new Promise((resolve, reject) => {
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
          resolve(outputPath);
        })
        .on("error", (err) => {
          console.log(
            `Error occurred while splitting segment ${index + 1}: ${
              err.message
            }`
          );
          reject(err);
        })
        .run();
    });
  });

  const lastSegmentPath = path.join(
    directoryPath,
    `${baseFileName}-${segments.length}.mp3`
  );

  const lastSegmentPromise = new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .noVideo()
      .audioFrequency(16000)
      .audioBitrate(48)
      .audioChannels(1)
      .audioCodec("libmp3lame")
      .format("mp3")
      .setStartTime(segments[segments.length - 1])
      .output(lastSegmentPath)
      .on("start", () => {
        console.log(`Starting to split the last segment`);
      })
      .on("end", () => {
        console.log(`Finished splitting the last segment`);
        resolve(lastSegmentPath);
      })
      .on("error", (err) => {
        console.log(
          `Error occurred while splitting the last segment: ${err.message}`
        );
        reject(err);
      })
      .run();
  });

  promises.push(lastSegmentPromise);
  return Promise.all(promises);
}
