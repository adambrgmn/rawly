import Promise from 'bluebird';
import spawn from 'cross-spawn';
import { join } from 'path';

export default function extract(file, { force }) {
  return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
    const { previews, previewExtracted, fullPath } = file;
    const { id } = previews.pop();

    if (!force && previewExtracted) {
      // Resolve false if previews are already extracted and force is false
      return resolve({ ...file });
    }

    const exiv2 = spawn('exiv2', [`-ep${id}`, fullPath]);
    exiv2.stdin.setEncoding('utf-8');

    exiv2.stdout.on('data', () => {
      const answer = force ? 'yes\n' : 'no\n';
      exiv2.stdin.write(answer);
    });

    exiv2.stderr.on('data', (err) => {
      const error = err.toString();
      return reject(error);
    });

    exiv2.on('close', (code) => {
      exiv2.stdin.end();
      if (code !== 0) {
        const error = new Error(`Exiv2 exited with code ${code}`);
        return reject(error);
      }

      const extracted = join(file.path, `${file.name}-preview${id}.jpg`);
      return resolve({ ...file, previewExtracted: extracted });
    });
  });
}
