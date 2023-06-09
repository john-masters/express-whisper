export function srtTimeToMilliseconds(srtTime) {
  const match = srtTime.match(/(\d+):(\d+):(\d+),(\d+)/);

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const milliseconds = parseInt(match[4], 10);

  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + milliseconds;
}

export function millisecondsToSrtTime(milliseconds) {
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
