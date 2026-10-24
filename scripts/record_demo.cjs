const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
process.env.PATH = path.dirname(ffmpeg) + ';' + process.env.PATH;
const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function recordWalkthrough() {
  console.log('--- INICIANDO GRABACIÓN DE DEMO AUTOMATIZADA ---');
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: { width: 1280, height: 850, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const webmPath = path.resolve('demo_cdaluminio.webm');
  const mp4Path = path.resolve('demo_cdaluminio.mp4');

  if (fs.existsSync(webmPath)) fs.unlinkSync(webmPath);
  if (fs.existsSync(mp4Path)) fs.unlinkSync(mp4Path);

  const recorder = await page.screencast({ path: webmPath });
  console.log('Grabador iniciado...');

  // 1. Abrir la web
  await page.goto('https://juanoviedo1987-droid.github.io/cd-aluminio/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.removeItem('cd_aluminio_auth'));
  await page.reload({ waitUntil: 'networkidle2' });
  await sleep(1500);

  // 2. Ingresar el PIN 2979 paso a paso
  console.log('Ingresando PIN 2979...');
  const pinDigits = ['2', '9', '7', '9'];
  for (const digit of pinDigits) {
    await page.evaluate((d) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.trim() === d);
      if (btn) btn.click();
    }, digit);
    await sleep(400);
  }

  // Esperar a que se autentique y cargue la pantalla principal
  await sleep(2000);

  // 3. Demostración en el configurador
  console.log('Configurando abertura...');

  // Seleccionar producto: Ventana Corrediza (3 Hojas)
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    if (selects[0]) {
      selects[0].value = 'ventana-corrediza-3h';
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1200);

  // Cambiar serie a Línea A82 (Alta Prestación)
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    if (selects[1]) {
      selects[1].value = 'A82';
      selects[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1200);

  // Seleccionar color: Negro o Anolock
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const anolockBtn = buttons.find(b => b.textContent.includes('Anolock'));
    if (anolockBtn) anolockBtn.click();
  });
  await sleep(1200);

  // Escribir Medidas: 150 cm Ancho x 120 cm Alto
  const inputs = await page.$$('input[type="number"]');
  if (inputs.length >= 2) {
    await inputs[0].type('150', { delay: 100 });
    await sleep(500);
    await inputs[1].type('120', { delay: 100 });
    await sleep(800);
  }

  // Seleccionar Vidrio: DVH
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    if (selects[2]) {
      selects[2].value = 'dvh';
      selects[2].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1200);

  // Activar Colocación en Obra
  await page.evaluate(() => {
    const toggle = document.querySelector('div[class*="cursor-pointer"]');
    if (toggle) toggle.click();
  });
  await sleep(1800);

  // Abrir Modal de Presupuesto Formal
  console.log('Abriendo presupuesto formal...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const formalBtn = buttons.find(b => b.textContent.includes('Generar Presupuesto Formal'));
    if (formalBtn) formalBtn.click();
  });
  await sleep(3500); // Pausa para apreciar el membrete, logo y desglose formal

  // Detener grabador
  await recorder.stop();
  await browser.close();
  console.log('Grabación webm finalizada.');

  // Convertir a MP4 universal para WhatsApp y PC
  console.log('Convirtiendo a MP4 universal (H.264)...');
  execSync(`"${ffmpeg}" -y -i "${webmPath}" -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart "${mp4Path}"`);
  
  const stats = fs.statSync(mp4Path);
  console.log(`¡Video MP4 generado con éxito! Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Ruta del video: ${mp4Path}`);
}

recordWalkthrough().catch(err => {
  console.error('Error generando video:', err);
  process.exit(1);
});
