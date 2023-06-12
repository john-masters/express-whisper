import { srtTimeToMilliseconds, millisecondsToSrtTime } from "./srtTime.js";

export default async function mergeSRT(responses) {
  const srtObjects = [];

  for (let index = 0; index < responses.length; index++) {
    // seperate each time section in SRT file
    const entries = responses[index].split("\n\n");

    // shift time to ensure srt timing is consistent
    let timeShift = 0;
    if (index !== 0) {
      timeShift = srtObjects[srtObjects.length - 1].end;
    }

    entries.forEach((entry) => {
      // Separate the entry into lines
      const lines = entry.split("\n");

      // TODO: Is this necessary?
      // Ignore entries with less than 3 lines (they're likely not real entries)
      if (lines.length < 3) return;

      // The second line should be the timestamp
      const timestamp = lines[1];
      const [start, end] = timestamp.split(" --> ");
      const startMs = srtTimeToMilliseconds(start);
      const endMs = srtTimeToMilliseconds(end);

      // The remaining lines (from the third line onward) should be the text
      const text = lines.slice(2).join("\n");

      const newObj = {
        start: index === 0 ? startMs : startMs + timeShift,
        end: index === 0 ? endMs : endMs + timeShift,
        text: text,
      };
      srtObjects.push(newObj);
    });
  }

  let srtFile = "";
  srtObjects.forEach((obj, index) => {
    const { start, end, text } = obj;
    const newStart = millisecondsToSrtTime(start);
    const newEnd = millisecondsToSrtTime(end);
    const newEntry = `${index + 1}\n${newStart} --> ${newEnd}\n${text}\n\n`;
    srtFile += newEntry;
  });

  return srtFile;
}
