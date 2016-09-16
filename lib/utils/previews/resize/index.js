import gm from 'gm';
import Promise from 'bluebird';

export default function resize(size) {
  return (file) => new Promise((resolve, reject) => {
    if (!size) return resolve({ ...file });
    const regex = /^(\d+)x(\d+)$/;
    const [, w, h] = regex.exec(size);

    const width = Number(w);
    const heigth = Number(h);

    gm(file.previewExtracted)
      .resize(width, heigth)
      .write(file.previewExtracted, (err) => {
        if (err) return reject(err);
        return resolve({ ...file });
      });
  });
}
