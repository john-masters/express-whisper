export default function mergeSRT(responses) {
  const srtObjects = [];

  for (let i = 0; i < responses.length; i++) {
    let lines = responses[i].split("\n");

    for (let j = 0; j < lines.length; j += 4) {
      let sequenceNumber = lines[j];
      let time = lines[j + 1].split(" --> ");
      let text = lines[j + 2];

      let srtObject = {
        sequenceNumber: parseInt(sequenceNumber),
        start: time[0],
        end: time[1],
        text: text,
      };
      console.log("srt: ", srtObject);

      srtObjects.push(srtObject);
    }
  }

  console.log("srtObjects: ", srtObjects);
  return srtObjects;
}
