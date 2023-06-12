import { vttTimeToMilliseconds, millisecondsToVttTime } from "./vttTime.js";

export default async function mergeVTT(responses) {
  const vttObjects = [];

  for (let index = 0; index < responses.length; index++) {
    // seperate each time section in VTT file
    const entries = responses[index].split("\n\n");

    // shift time to ensure timing is consistent
    let timeShift = 0;
    if (index !== 0) {
      timeShift = vttObjects[vttObjects.length - 1].end;
    }

    entries.forEach((entry, index) => {
      // Separate the entry into lines
      const lines = entry.split("\n");

      // // The first line should be the timestamp
      const timestamp = lines[0];

      const [start, end] = timestamp.split(" --> ");
      if (!start || !end) return;

      const startMs = vttTimeToMilliseconds(start);
      const endMs = vttTimeToMilliseconds(end);

      // The second line should be the text
      const text = lines.slice(1).join("\n"); // in case of multiple lines

      const newObj = {
        start: index === 0 ? startMs : startMs + timeShift,
        end: index === 0 ? endMs : endMs + timeShift,
        text: text,
      };
      console.log("newObj", newObj);
      vttObjects.push(newObj);
    });
    return vttObjects;
  }

  let vttFile = "WEBVTT\n\n";
  vttObjects.forEach((obj, index) => {
    const { start, end, text } = obj;
    const newStart = millisecondsToVttTime(start);
    const newEnd = millisecondsToVttTime(end);
    const newEntry = `${index + 1}\n${newStart} --> ${newEnd}\n${text}\n\n`;
    vttFile += newEntry;
  });
  return vttFile;
}
