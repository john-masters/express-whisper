import ffmpeg from "fluent-ffmpeg";

const silenceVolume = -30; // in decibels
const silenceDuration = 2.0; // in seconds

// 1800 seconds = 30 minutes
let splitTimes = [
  1800, 3600, 5400, 7200, 9000, 10800, 12600, 14400, 16200, 18000,
];

export default function silenceDetector(inputPath) {
  return new Promise((resolve, reject) => {
    let segments = [];
    let currentSplitTime = 0;
    let silenceStart;

    const silenceDetect = ffmpeg(inputPath)
      .outputOptions([
        "-af",
        `silencedetect=noise=${silenceVolume}dB:d=${silenceDuration}`,
        "-f",
        "null",
      ])
      .output("pipe:1")
      .on("start", () => {
        console.log("Starting silence detection");
      })
      .on("stderr", (stderrLine) => {
        const silenceStartRegex = /silence_start: (\d+(\.\d+)?)/;
        const silenceEndRegex = /silence_end: (\d+\.\d+)/;

        const startMatch = silenceStartRegex.exec(stderrLine);
        const endMatch = silenceEndRegex.exec(stderrLine);

        if (startMatch) {
          silenceStart = parseFloat(startMatch[1]);
        } else if (endMatch) {
          const silenceEnd = parseFloat(endMatch[1]);
          if (silenceStart > splitTimes[currentSplitTime]) {
            const silenceMid = (silenceStart + silenceEnd) / 2;
            segments.push(silenceMid);
            currentSplitTime++;
          }
        }
      })
      .on("end", () => {
        console.log("Silence detection complete.");
        resolve(segments);
      })
      .on("error", (err) => {
        console.log(`Error occurred during silence detection: ${err.message}`);
        reject(err);
      });

    silenceDetect.run();
  });
}
