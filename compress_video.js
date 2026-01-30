const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = path.join(__dirname, 'public', 'projects', 'Kurihing Cine.mov');
const outputFile = path.join(__dirname, 'public', 'projects', 'Kurihing_Cine_compressed.mp4');

console.log(`Starting compression: ${inputFile}`);
console.log(`Output: ${outputFile}`);

ffmpeg(inputFile)
  .outputOptions([
    '-vcodec libx264',
    '-crf 28', // Higher CRF = lower quality/size (18-28 is good range)
    '-preset faster',
    '-acodec aac',
    '-b:a 128k'
  ])
  .on('start', (commandLine) => {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })
  .on('progress', (progress) => {
    console.log('Processing: ' + progress.percent + '% done');
  })
  .on('error', (err) => {
    console.error('An error occurred: ' + err.message);
    process.exit(1);
  })
  .on('end', () => {
    console.log('Compression finished successfully!');
    // Delete original and rename new file to original name (but keep mp4 extension for compatibility)
    // Actually, let's keep it as mp4 and update the code
    console.log(`New file size: ${fs.statSync(outputFile).size / 1024 / 1024} MB`);
    process.exit(0);
  })
  .save(outputFile);
