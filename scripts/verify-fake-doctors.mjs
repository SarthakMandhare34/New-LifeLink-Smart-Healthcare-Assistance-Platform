/**
 * Verification script for fake doctor identities, fictional hospitals, and off-rail clinical locations
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { authSession } from '../backend/auth/authUtil.ts';
import { COOKIE_NAME } from '../shared/const.ts';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CONV_ID = '05cf3b52-2746-4c21-8b2c-0388a590def3';
const OUT_DIR = path.resolve(`C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\${CONV_ID}\\screenshots`);
const TEMP_USER_DATA = path.resolve(`C:\\Users\\LENOVO\\AppData\\Local\\Temp\\chrome-verify-doctors-${Date.now()}`);

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Generate valid test patient session
const patientToken = await authSession.createSessionToken('provider:09965018-33e3-49a4-8b57-7cc5619247a9', { name: 'Sarthak Mandhare' });

// Start Google Chrome with remote debugging
const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--remote-debugging-port=9455',
  `--user-data-dir=${TEMP_USER_DATA}`,
  'about:blank'
], { stdio: 'ignore' });

// Wait for Chrome CDP port to be ready
let wsUrl = '';
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch('http://127.0.0.1:9455/json/version');
    if (res.ok) {
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      console.log('Connected to Google Chrome CDP:', data.Browser);
      break;
    }
  } catch (e) {
    await new Promise(r => setTimeout(r, 500));
  }
}

if (!wsUrl) {
  console.error('Failed to connect to Google Chrome CDP port 9455.');
  chromeProc.kill();
  process.exit(1);
}

class CDPClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.msgId = 1;
    this.callbacks = new Map();
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}, timeoutMs = 12000) {
    const id = this.msgId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id);
          reject(new Error(`Timeout after ${timeoutMs}ms waiting for ${method}`));
        }
      }, timeoutMs);
      this.callbacks.set(id, {
        resolve: (val) => { clearTimeout(timer); resolve(val); },
        reject: (err) => { clearTimeout(timer); reject(err); }
      });
      try {
        this.ws.send(JSON.stringify({ id, method, params }));
      } catch (err) {
        clearTimeout(timer);
        this.callbacks.delete(id);
        reject(err);
      }
    });
  }

  close() {
    try { this.ws.close(); } catch (e) {}
  }
}

try {
  const targetsList = await (await fetch('http://127.0.0.1:9455/json')).json();
  const pageCdp = new CDPClient(targetsList[0].webSocketDebuggerUrl);
  await pageCdp.init();

  await pageCdp.send('Page.enable');
  await pageCdp.send('Network.enable');
  await pageCdp.send('Network.setBlockedURLs', {
    urls: ['*tile.openstreetmap.org*', '*tile.osm.org*', '*.tile.openstreetmap.org*']
  });

  // Set authenticated cookies for localhost
  await pageCdp.send('Network.setCookie', {
    name: COOKIE_NAME,
    value: patientToken,
    url: 'http://localhost:5173',
  });

  // Set viewport to 1440x900
  await pageCdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Navigating to http://localhost:5173/patient/specialists...');
  await pageCdp.send('Page.navigate', { url: 'http://localhost:5173/patient/specialists' });

  // Wait up to 10 seconds for cards to load
  let cards = [];
  let currentUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    const check = await pageCdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('.discovery-full-grid .card, .discovery-full-grid > div'));
          return {
            url: window.location.href,
            title: document.title,
            cardCount: cards.length,
            firstCardText: cards[0]?.innerText || '',
            bodySnippet: document.body.innerText.slice(0, 300)
          };
        })()
      `,
      returnByValue: true
    });
    const info = check.result?.value || {};
    currentUrl = info.url;
    if (info.cardCount > 0) {
      console.log(`Loaded ${info.cardCount} doctor cards on ${info.url}!`);
      break;
    }
  }

  // Extract first 6 doctor cards
  const evalRes = await pageCdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const cards = Array.from(document.querySelectorAll('.discovery-full-grid > div'));
        return cards.slice(0, 6).map(card => {
          const h3 = card.querySelector('h3')?.textContent || '';
          const specialty = card.querySelector('p')?.textContent || '';
          const captions = Array.from(card.querySelectorAll('.caption')).map(c => c.textContent.trim());
          return { name: h3, specialty, details: captions };
        });
      })()
    `,
    returnByValue: true
  });

  console.log('\n--- EXTRACTED DOCTOR CARDS (FIRST 6) ---');
  console.log(JSON.stringify(evalRes.result?.value, null, 2));

  // Railway text & icon audit across ALL cards in grid
  const auditRes = await pageCdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const grid = document.querySelector('.discovery-full-grid');
        if (!grid) return { found: false, error: 'Grid not found' };
        const text = grid.textContent;
        const hasConnectivity = text.includes('connectivity');
        const hasTrainIcon = !!document.querySelector('.lucide-train-front');
        const hasStationStation = /\\b\\w+\\s+station\\b/i.test(text);
        const hasRailLines = text.includes('railLines') || text.includes('Central +');
        return {
          cardCount: grid.children.length,
          hasConnectivity,
          hasTrainIcon,
          hasStationStation,
          hasRailLines,
          totalSpecialists: Array.from(grid.querySelectorAll('h3')).map(h => h.textContent)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('\n--- RAILWAY TEXT & ICON AUDIT ---');
  console.log({
    cardCount: auditRes.result?.value?.cardCount,
    hasConnectivity: auditRes.result?.value?.hasConnectivity,
    hasTrainIcon: auditRes.result?.value?.hasTrainIcon,
    hasStationStation: auditRes.result?.value?.hasStationStation,
    hasRailLines: auditRes.result?.value?.hasRailLines,
    first10Doctors: auditRes.result?.value?.totalSpecialists?.slice(0, 10)
  });

  // Capture Screenshot (Light Mode)
  try {
    const shot = await pageCdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, 20000);
    const shotPath = path.join(OUT_DIR, 'specialist_directory_fake_doctors.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`\nScreenshot captured at: ${shotPath}`);
  } catch (err) {
    console.warn('Screenshot error:', err.message);
  }

  pageCdp.close();
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  chromeProc.kill();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch (e) {}
}
