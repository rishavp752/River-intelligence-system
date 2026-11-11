import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const zip = new JSZip();

const TOP_FILES = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'index.html',
  'metadata.json',
  'README.md',
  '.gitignore',
];

for (const file of TOP_FILES) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    zip.file(file, fs.readFileSync(fullPath));
  }
}

function addDirectoryToZip(dirRelPath) {
  const fullDir = path.join(rootDir, dirRelPath);
  if (!fs.existsSync(fullDir)) return;

  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'RIVER_INTELLIGENCE_Source_Code.zip') continue;
    const relPath = path.posix.join(dirRelPath, entry.name);
    const fullEntryPath = path.join(fullDir, entry.name);
    if (entry.isDirectory()) {
      addDirectoryToZip(relPath);
    } else if (entry.isFile()) {
      zip.file(relPath, fs.readFileSync(fullEntryPath));
    }
  }
}

addDirectoryToZip('public');
addDirectoryToZip('src');
addDirectoryToZip('scripts');

const outputBuffer = await zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 9 },
});

const outPath = path.join(rootDir, 'public', 'RIVER_INTELLIGENCE_Source_Code.zip');
fs.writeFileSync(outPath, outputBuffer);
console.log(`Created ${outPath} (${(outputBuffer.length / 1024).toFixed(1)} KB)`);
