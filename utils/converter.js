import ffmpeg from 'fluent-ffmpeg';

export default async function convertTo16kMP3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFrequency(16000)
      .audioBitrate(64)
      .audioChannels(1)
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('error', (err) => {
        console.error('An error occurred while converting the audio:', err);
        reject(err);
      })
      .on('end', () => {
        console.log('Conversion to 16k .mp3 completed');
        resolve(outputPath);
      })
      .save(outputPath);
  });
};