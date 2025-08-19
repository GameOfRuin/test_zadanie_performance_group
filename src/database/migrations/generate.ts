import fs from 'fs';
import path from 'path';

const name = process.argv[2];
if (!name) {
  throw Error('Migration name must be provided as first argument');
}

const migrationsCount = fs
  .readdirSync(path.resolve(__dirname, 'migrations'))
  .filter((file) => {
    const filePath = path.join(path.resolve(__dirname, 'migrations'), file);

    return fs.statSync(filePath).isFile();
  }).length;

const src = path.resolve(__dirname, 'template.txt');
const dst = path.resolve(
  __dirname,
  'migrations',
  `${(migrationsCount + 1).toString().padStart(3, '0')}-${name}.ts`,
);

fs.copyFileSync(src, dst);

console.log('Successfully generated new migration:', dst);
