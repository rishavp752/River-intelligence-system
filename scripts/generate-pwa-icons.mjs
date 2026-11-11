import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// CRC32 helper for valid PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generateRiverIconPng(size, isMaskable = false) {
  const rawData = Buffer.alloc(size * (size * 4 + 1));
  const center = size / 2;
  const scale = isMaskable ? 0.78 : 0.92;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    rawData[rowStart] = 0; // Filter type 0 (None)

    // Normalized coordinates [-1, 1]
    const ny = ((y - center) / (size / 2)) / scale;

    for (let x = 0; x < size; x++) {
      const nx = ((x - center) / (size / 2)) / scale;
      const dist = Math.hypot(nx, ny);

      // Base Deep Navy (#061421) to Dark Blue Panel (#0B2030) gradient
      let r = Math.round(6 + (y / size) * 8);
      let g = Math.round(20 + (y / size) * 16);
      let b = Math.round(33 + (y / size) * 20);
      let a = 255;

      // Subtle inner circular radar ring
      if (Math.abs(dist - 0.78) < 0.018) {
        r = 32;
        g = 214;
        b = 208;
      }

      // Glowing sinusoidal river wave 1 (Cyan #20D6D0)
      const waveY1 = 0.06 + 0.22 * Math.sin(nx * 3.4);
      const distWave1 = Math.abs(ny - waveY1);
      if (Math.abs(nx) < 0.72 && distWave1 < 0.11) {
        const intensity = 1 - distWave1 / 0.11;
        r = Math.round(r * (1 - intensity) + 32 * intensity);
        g = Math.round(g * (1 - intensity) + 214 * intensity);
        b = Math.round(b * (1 - intensity) + 208 * intensity);
      }

      // Secondary sinusoidal river wave 2 (Teal #00AFA7)
      const waveY2 = 0.28 + 0.18 * Math.sin(nx * 3.4 - 0.5);
      const distWave2 = Math.abs(ny - waveY2);
      if (Math.abs(nx) < 0.68 && distWave2 < 0.065) {
        const intensity = 1 - distWave2 / 0.065;
        r = Math.round(r * (1 - intensity) + 0 * intensity);
        g = Math.round(g * (1 - intensity) + 175 * intensity);
        b = Math.round(b * (1 - intensity) + 167 * intensity);
      }

      // Station B central anomaly node highlight (Coral #FF7068 / Amber #F4B942)
      const nodeDist = Math.hypot(nx - 0.0, ny - 0.06);
      if (nodeDist < 0.14) {
        if (nodeDist > 0.09) {
          r = 255;
          g = 112;
          b = 104;
        } else {
          r = 6;
          g = 20;
          b = 33;
        }
      }

      const px = rowStart + 1 + x * 4;
      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
      rawData[px + 3] = a;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generateRiverIconPng(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generateRiverIconPng(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generateRiverIconPng(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateRiverIconPng(180, false));
console.log('Generated PWA PNG icons in /public successfully.');
