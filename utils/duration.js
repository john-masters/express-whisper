import ffmpeg from "fluent-ffmpeg";

export default function getDuration(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      }
      resolve(metadata.format.duration);
    });
  });
}
