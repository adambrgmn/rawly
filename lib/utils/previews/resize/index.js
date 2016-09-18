import sharp from 'sharp';
import Promise from 'bluebird';

export default function resize(size) {
  return (buffer) => new Promise((resolve) => {
    if (!size) return resolve(buffer);
    const regex = /^(\d+)x(\d+)$/;
    const [, w, h] = regex.exec(size);

    const width = Number(w);
    const heigth = Number(h);

    return sharp(buffer)
      .resize(width, heigth)
      .max()
      .toBuffer()
      .then(resolve);
  });
}
