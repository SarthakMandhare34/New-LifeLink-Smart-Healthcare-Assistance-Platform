import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const widths = [320, 360, 375, 390, 414, 430, 768, 820, 834, 1024, 1280, 1366, 1440, 1536, 1920];
const routes = [
  { name: 'workspace', url: 'http://localhost:5173/' },
  { name: 'login', url: 'http://localhost:5173/login' },
  { name: 'doctor_login', url: 'http://localhost:5173/doctor/login' },
  { name: 'doctor_reset', url: 'http://localhost:5173/doctor/reset' },
  { name: 'register', url: 'http://localhost:5173/register' }
];

const outDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\f4fb5e49-6153-4a3c-b383-16e755e25e68\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Beginning Google Chrome responsive rendering verification across widths:');
console.log(widths.join(', '));

const results = [];

for (const width of widths) {
  const height = width < 768 ? 800 : 900;
  for (const route of routes) {
    const filename = `${route.name}_${width}px.png`;
    const tempPath = path.join('C:\\Users\\LENOVO\\AppData\\Local\\Temp', filename);
    const destPath = path.join(outDir, filename);

    try {
      const args = [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--virtual-time-budget=1000',
        `--window-size=${width},${height}`,
        `--screenshot=${tempPath}`,
        route.url
      ];
      execFileSync(chromePath, args, { stdio: 'pipe' });
      if (fs.existsSync(tempPath)) {
        fs.copyFileSync(tempPath, destPath);
        fs.unlinkSync(tempPath);
        const stats = fs.statSync(destPath);
        results.push({ width, route: route.name, status: 'OK', size: stats.size, file: destPath });
      } else {
        results.push({ width, route: route.name, status: 'MISSING_FILE' });
      }
    } catch (err) {
      results.push({ width, route: route.name, status: 'ERROR', error: err.message });
    }
  }
}

console.log(`Completed ${results.length} Chrome verification renders.`);
const allOk = results.every(r => r.status === 'OK');
console.log(`All renders successful: ${allOk}`);
if (!allOk) {
  console.error('Failed renders:', results.filter(r => r.status !== 'OK'));
} else {
  console.log('Sample outputs:');
  for (const r of results.slice(0, 8)) {
    console.log(` - ${r.width}px [${r.route}]: ${r.size} bytes`);
  }
}
