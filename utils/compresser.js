import ffmpeg from 'fluent-ffmpeg';

export default async function compressFile(inputPath, outputPath) {

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioFrequency(16000)
      // .audioBitrate(32)
      .audioBitrate(24)
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