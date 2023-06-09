import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "penguin.mp3.vtt");
const filePath2 = path.join(process.cwd(), "penguin.mp3 (1).vtt");
const files = [filePath, filePath2];

function srtTimeToMilliseconds(srtTime) {
  const match = srtTime.match(/(\d+):(\d+):(\d+),(\d+)/);

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const milliseconds = parseInt(match[4], 10);

  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + milliseconds;
}

function millisecondsToSrtTime(milliseconds) {
  let remainingMillis = milliseconds;

  const hours = Math.floor(remainingMillis / (60 * 60 * 1000));
  remainingMillis -= hours * 60 * 60 * 1000;

  const minutes = Math.floor(remainingMillis / (60 * 1000));
  remainingMillis -= minutes * 60 * 1000;

  const seconds = Math.floor(remainingMillis / 1000);
  remainingMillis -= seconds * 1000;

  const millis = remainingMillis;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${millis
    .toString()
    .padStart(3, "0")}`;
}

async function split(files) {
  const srtArr = [];

  // files.forEach((filePath, index) => {
  for (let index = 0; index < files.length; index++) {
    const data = await fs.readFile(files[index], "utf8");

    // seperate
    const entries = data.split("\n\n");

    let timeShift = 0;
    if (index !== 0) {
      timeShift = srtArr[srtArr.length - 1].end;
    }

    entries.forEach((entry, index) => {
      if (index === 0) return;
      console.log(entry);
      console.log("--------");
      // Separate the entry into lines
      // const lines = entry.split("\n");

      // // Ignore entries with less than 3 lines (they're likely not real entries)
      // if (lines.length < 3) return;

      // // The second line should be the timestamp
      // const timestamp = lines[1];
      // const [start, end] = timestamp.split(" --> ");
      // const startMs = srtTimeToMilliseconds(start);
      // const endMs = srtTimeToMilliseconds(end);

      // // The remaining lines (from the third line onward) should be the text
      // const text = lines.slice(2).join("\n");

      // const newObj = {
      //   start: index === 0 ? startMs : startMs + timeShift,
      //   end: index === 0 ? endMs : endMs + timeShift,
      //   text: text,
      // };
      // srtArr.push(newObj);
    });
  }
  return srtArr;
}

function createSrtFile(srtArr) {
  let srtFile = "";
  srtArr.forEach((obj, index) => {
    const { start, end, text } = obj;
    const newStart = millisecondsToSrtTime(start);
    const newEnd = millisecondsToSrtTime(end);
    const newEntry = `${index + 1}\n${newStart} --> ${newEnd}\n${text}\n\n`;
    srtFile += newEntry;
  });
  return srtFile;
}

try {
  const srtData = await split(files);
  const file = createSrtFile(srtData);
  console.log("file", file);
} catch (err) {
  console.log("err", err);
}
