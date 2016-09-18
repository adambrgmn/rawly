import Promise from 'bluebird';
import spawn from 'cross-spawn';
// import { join } from 'path';

export default function extract(fullPath) {
  return new Promise((resolve, reject) => {
    const exif = spawn('exiftool', ['-b', '-PreviewImage', fullPath], { stdio: 'pipe' });
    const buffers = [];

    exif.stdout.on('data', (data) => buffers.push(data));
    exif.stderr.on('data', (err) => reject(err.toString()));

    exif.on('close', (code) => {
      if (code !== 0) {
        const error = new Error(`exiftool ended with code ${code}`);
        return reject(error);
      }

      const buffer = Buffer.concat(buffers);
      return resolve(buffer);
    });
  });
}
