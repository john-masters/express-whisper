export default function unixTimeConvert(ts) {
  const date = new Date(ts * 1000); // convert seconds to milliseconds
  const options = { timeZone: "Australia/Melbourne", hour12: true };
  const newDate = date.toLocaleString("en-AU", options);
  return newDate;
}
