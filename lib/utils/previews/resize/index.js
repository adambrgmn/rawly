import { readFile, writeFile } from 'fs';
import sharp from 'sharp';
import Promise, { promisify } from 'bluebird';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export default function resize(size) {
  return (file) => new Promise((resolve) => {
    if (!size) return resolve({ ...file });
    const regex = /^(\d+)x(\d+)$/;
    const [, w, h] = regex.exec(size);

    const width = Number(w);
    const heigth = Number(h);

    return readFileAsync(file.previewExtracted)
      .then((buffer) => sharp(buffer).resize(width, heigth).toBuffer())
      .then((buffer) => writeFileAsync(file.previewExtracted, buffer))
      .then(() => resolve({ ...file }));
  });
}
