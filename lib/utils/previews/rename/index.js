import fs from 'fs';
import { join } from 'path';
import Promise, { promisify } from 'bluebird';

const renameAsync = promisify(fs.rename);

export default function rename(suffix) {
  return (file) => new Promise((resolve, reject) => {
    const newName = `${file.name}${suffix}`;

    const oldPath = file.previewExtracted;
    const newPath = join(file.path, `${newName}.jpg`);

    return renameAsync(oldPath, newPath)
      .then(() => resolve({ ...file, previewExtracted: newPath }))
      .catch(reject);
  });
}
