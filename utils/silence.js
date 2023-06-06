import ffmpeg from "fluent-ffmpeg";
import getDuration from "./duration.js";
// import path from "path";
// import fs from "fs";

export default async function silenceDetector(inputPath) {
  const silenceVolume = -30;
  const silenceDuration = 2.0;
  let splitTimes = [
    // 1800 seconds = 30 minutes | 36000 seconds = 10 hours
    1800, 3600, 5400, 7200, 9000, 10800, 12600, 14400, 16200, 18000, 19800,
    21600, 23400, 25200, 27000, 28800, 30600, 32400, 34200, 36000, 37800,
  ];

  let segments = [];
  let currentSplitTime = 0;
  let silenceStart;

  const duration = await getDuration(inputPath);

  if (duration < 1800) return null;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-af",
        `silencedetect=noise=${silenceVolume}dB:d=${silenceDuration}`,
        "-f",
        "null",
      ])
      .output("pipe:1")
      .on("stderr", (stderrLine) => {
        const silenceStartRegex = /silence_start: (\d+(\.\d+)?)/;
        const silenceEndRegex = /silence_end: (\d+\.\d+)/;

        const startMatch = silenceStartRegex.exec(stderrLine);
        const endMatch = silenceEndRegex.exec(stderrLine);

        if (startMatch) {
          silenceStart = parseFloat(startMatch[1]);
        } else if (endMatch) {
          const silenceEnd = parseFloat(endMatch[1]);
          // If this silence occurs after the current split time, save it as a definite split point and move on to the next split time
          if (silenceStart > splitTimes[currentSplitTime]) {
            const silenceMid = (silenceStart + silenceEnd) / 2;
            segments.push(silenceMid);
            currentSplitTime++;
          }
        }
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve(segments);
        // return segments;
      });
  });
}
