import fetch from 'node-fetch';
import fs from 'fs';

async function downloadFile(url, outputPath) {
    console.log(url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', err => {
      reject(err);
    });
    fileStream.on('finish', () => {
      resolve();
    });
  });
}

// Usage: node downloadFile.js <URL> <outputPath>
const [, , url, outputPath] = process.argv;
if (!url || !outputPath) {
  console.error('Usage: node downloadFile.js <URL> <outputPath>');
  process.exit(1);
}

downloadFile(url, outputPath)
  .then(() => {
    console.log(`File downloaded successfully to ${outputPath}`);
  })
  .catch(error => {
    console.error('Failed to download file:', error.message);
    process.exit(1);
  });
