const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
process.env.PATH = path.dirname(ffmpeg) + ';' + process.env.PATH;
const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function recordWalkthrough() {
  console.log('=== PRODUCCIÓN DE VIDEO DEMO DEFINITIVO CD ALUMINIO ===');

  // Asegurar que la pista musical corporativa esté generada y actualizada
  console.log('1. Verificando pista musical alegre y corporativa...');
  require('./generate_corporate_music.cjs');

  const rawWebmPath = path.resolve('demo_sub_raw.webm');
  const finalMp4Path = path.resolve('demo_cdaluminio_con_subtitulos.mp4');
  const audioPath = path.resolve('ambient_music.m4a');

  if (fs.existsSync(rawWebmPath)) fs.unlinkSync(rawWebmPath);
  if (fs.existsSync(finalMp4Path)) fs.unlinkSync(finalMp4Path);

  console.log('2. Iniciando navegador Puppeteer para grabación en alta resolución...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: { width: 1280, height: 920, deviceScaleFactor: 2 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-running-insecure-content'
    ]
  });

  const page = await browser.newPage();

  // Interceptar window.open para mostrar la vista previa interactiva de WhatsApp oficial
  await page.evaluateOnNewDocument(() => {
    window.__openedUrls = [];
    window.open = function(url) {
      window.__openedUrls.push(url);
      console.log('Interceptor capturó window.open:', url);

      let text = 'Presupuesto oficial';
      try {
        const u = new URL(url);
        text = decodeURIComponent(u.searchParams.get('text') || '');
      } catch (err) {
        if (url.includes('text=')) {
          text = decodeURIComponent(url.split('text=')[1]);
        }
      }

      let toast = document.getElementById('demo-whatsapp-preview');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'demo-whatsapp-preview';
        toast.style.position = 'fixed';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%) scale(0.85)';
        toast.style.opacity = '0';
        toast.style.backgroundColor = '#ffffff';
        toast.style.color = '#0f172a';
        toast.style.borderRadius = '18px';
        toast.style.boxShadow = '0 25px 65px rgba(0,0,0,0.55), 0 0 0 3px #25D366';
        toast.style.zIndex = '10000000';
        toast.style.width = '440px';
        toast.style.maxWidth = '92vw';
        toast.style.overflow = 'hidden';
        toast.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
        toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        document.body.appendChild(toast);
      }

      toast.innerHTML = `
        <div style="background:#075e54; color:#ffffff; padding:12px 18px; display:flex; align-items:center; gap:12px;">
          <div style="width:34px; height:34px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
            <svg style="width:20px;height:20px;fill:#ffffff" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/></svg>
          </div>
          <div>
            <div style="font-weight:700; font-size:14px; line-height:1.2;">WhatsApp Web Oficial CD Aluminio</div>
            <div style="font-size:11px; opacity:0.9;">Destino: +598 94 991 386 • Presupuesto listo</div>
          </div>
        </div>
        <div style="padding:14px 16px; background:#efeae2;">
          <div style="background:#ffffff; border-radius:10px; padding:12px 14px; font-size:11.5px; line-height:1.55; color:#111b21; box-shadow:0 1px 3px rgba(0,0,0,0.12); border-left:4px solid #25D366; max-height:280px; overflow-y:auto; white-space:pre-wrap;">${text}</div>
          <div style="margin-top:10px; display:flex; align-items:center; justify-content:space-between; font-size:11px; color:#54656f;">
            <span style="font-weight:600; color:#075e54;">✓✓ Mensaje generado automáticamente</span>
            <span style="background:#25D366; color:#ffffff; font-weight:700; padding:2px 8px; border-radius:12px; font-size:10px;">Exportación Exitosa</span>
          </div>
        </div>
      `;

      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 50);
    };
  });

  console.log('3. Iniciando captura screencast...');
  const recorder = await page.screencast({ path: rawWebmPath });

  // Función para inyectar subtítulos dinámicos con cápsula oscura y borde naranja (#ea580c)
  const setSubtitle = async (text, icon = '🔹') => {
    await page.evaluate((t, ic) => {
      let banner = document.getElementById('demo-subtitle-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'demo-subtitle-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '22px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = '#09090b';
        banner.style.color = '#ffffff';
        banner.style.padding = '10px 24px';
        banner.style.borderRadius = '9999px';
        banner.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
        banner.style.fontSize = '14px';
        banner.style.fontWeight = '700';
        banner.style.letterSpacing = '0.02em';
        banner.style.border = '2px solid #ea580c';
        banner.style.boxShadow = '0 12px 30px rgba(0,0,0,0.65)';
        banner.style.zIndex = '999999';
        banner.style.display = 'flex';
        banner.style.alignItems = 'center';
        banner.style.gap = '10px';
        banner.style.transition = 'all 0.3s ease';
        banner.style.pointerEvents = 'none';
        document.body.appendChild(banner);
      }
      banner.innerHTML = `<span style="font-size:16px">${ic}</span><span>${t}</span>`;
      banner.style.opacity = '1';
    }, text, icon);
  };

  // 1. Abrir la web y forzar pantalla de login
  await page.goto('https://juanoviedo1987-droid.github.io/cd-aluminio/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.removeItem('cd_aluminio_auth'));
  await page.reload({ waitUntil: 'networkidle2' });
  await sleep(1000);

  // 🔒 PASO 1: Acceso Seguro con PIN Oficial
  console.log('-> Ejecutando Paso 1: PIN Oficial');
  await setSubtitle('Paso 1: Acceso Seguro con PIN Oficial para Taller y Ventas', '🔒');
  await sleep(1500);

  const pinDigits = ['2', '9', '7', '9'];
  for (const digit of pinDigits) {
    await page.evaluate((d) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.trim() === d);
      if (btn) btn.click();
    }, digit);
    await sleep(400);
  }
  await sleep(1800);

  // 📐 PASO 2: Selección de Abertura y Líneas Compatibles
  console.log('-> Ejecutando Paso 2: Selección de Abertura y Líneas');
  await setSubtitle('Paso 2: Selección de Abertura y Líneas Compatibles (Excel)', '📐');
  await sleep(1500);

  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    if (selects[0]) {
      selects[0].value = 'ventana-corrediza-3h';
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1200);

  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    if (selects[1]) {
      selects[1].value = 'A82';
      selects[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1400);

  // 🎨 PASO 3: Selección de Color y Terminación
  console.log('-> Ejecutando Paso 3: Selección de Color y Terminación');
  await setSubtitle('Paso 3: Selección de Color y Terminación', '🎨');
  await sleep(800);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const anolockBtn = buttons.find(b => b.textContent.includes('Anolock'));
    if (anolockBtn) anolockBtn.click();
  });
  await sleep(1400);

  // 📏 PASO 4: Medidas Libres del Vano
  console.log('-> Ejecutando Paso 4: Medidas Libres del Vano');
  await setSubtitle('Paso 4: Medidas Libres del Vano (Ancho x Alto en cm)', '📏');
  const inputs = await page.$$('input[type="number"]');
  if (inputs.length >= 2) {
    await inputs[0].click({ clickCount: 3 });
    await inputs[0].type('150', { delay: 90 });
    await sleep(400);
    await inputs[1].click({ clickCount: 3 });
    await inputs[1].type('120', { delay: 90 });
    await sleep(800);
  }
  await sleep(1400);

  // 🪟 PASO 5: Cristal DVH y Servicio de Colocación
  console.log('-> Ejecutando Paso 5: Cristal DVH y Colocación');
  await setSubtitle('Paso 5: Cristal DVH y Servicio de Colocación en Obra', '🪟');
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    if (selects[2]) {
      selects[2].value = 'dvh';
      selects[2].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1200);

  // Switch de Colocación
  await page.evaluate(() => {
    const toggle = document.querySelector('div[class*="cursor-pointer"]');
    if (toggle) toggle.click();
  });
  await sleep(1800);

  // 📄 PASO 6: Presupuesto Oficial Membretado y Exportación (PDF + WhatsApp)
  console.log('-> Ejecutando Paso 6: Presupuesto Oficial y Exportación');
  await setSubtitle('Paso 6: Presupuesto Oficial Membretado y Exportación (PDF + WhatsApp)', '📄');
  await sleep(600);

  // Abrir modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const formalBtn = buttons.find(b => b.textContent.includes('Generar Presupuesto Formal'));
    if (formalBtn) formalBtn.click();
  });
  await sleep(2200); // Apreciar el membrete, detalles y desglose

  // 1. Clic en "Descargar PDF" para mostrar el estado interactivo "Generando..."
  console.log('-> Haciendo clic en "Descargar PDF"...');
  await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
      const buttons = Array.from(modal.querySelectorAll('button'));
      const pdfBtn = buttons.find(b => b.textContent && b.textContent.includes('Descargar PDF'));
      if (pdfBtn) pdfBtn.click();
    }
  });
  await sleep(2500); // Tiempo para ver la animación "Generando... -> Descargar PDF"

  // 2. Clic en "WhatsApp" para mostrar la interactividad de envío directo
  console.log('-> Haciendo clic en "WhatsApp"...');
  await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
      const buttons = Array.from(modal.querySelectorAll('button'));
      const waBtn = buttons.find(b => b.textContent && b.textContent.includes('WhatsApp'));
      if (waBtn) waBtn.click();
    }
  });
  await sleep(4000); // Tiempo para que el espectador aprecie el mensaje oficial formateado de WhatsApp

  // Detener grabación
  await recorder.stop();
  await browser.close();
  console.log('✅ Grabación de screencast finalizada con éxito.');

  // Obtener duración exacta del video grabado para calcular fade out suave de audio
  console.log('Calculando duración exacta para masterización de audio...');
  let videoDurationSec = 30.0;
  try {
    const probeOutput = execSync(`"${ffmpeg}" -i "${rawWebmPath}" 2>&1`, { encoding: 'utf-8' });
    const match = probeOutput.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const mins = parseFloat(match[2]);
      const secs = parseFloat(match[3]);
      videoDurationSec = hours * 3600 + mins * 60 + secs;
      console.log(`Duración detectada del screencast: ${videoDurationSec.toFixed(2)} segundos.`);
    }
  } catch (probeErr) {
    const match = (probeErr.stdout || probeErr.stderr || '').toString().match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const mins = parseFloat(match[2]);
      const secs = parseFloat(match[3]);
      videoDurationSec = hours * 3600 + mins * 60 + secs;
      console.log(`Duración detectada del screencast: ${videoDurationSec.toFixed(2)} segundos.`);
    }
  }

  const fadeOutStart = Math.max(0, videoDurationSec - 3.0);

  // Mezclar video + música de fondo corporativa con volumen suave (0.28) y fade out dinámico
  console.log('Compilando video final MP4 (H.264 + AAC estéreo)...');
  const ffmpegCmd = `"${ffmpeg}" -y -i "${rawWebmPath}" -i "${audioPath}" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -r 30 -movflags +faststart -c:a aac -b:a 128k -filter_complex "[1:a]volume=0.28,afade=t=in:ss=0:d=1.5,afade=t=out:st=${fadeOutStart.toFixed(2)}:d=3.0[a]" -map 0:v -map "[a]" -shortest "${finalMp4Path}"`;

  execSync(ffmpegCmd);

  const stats = fs.statSync(finalMp4Path);
  const sizeMB = stats.size / (1024 * 1024);
  console.log(`\n🎉 PROCESO COMPLETADO EXITOSAMENTE`);
  console.log(`Archivo final: ${finalMp4Path}`);
  console.log(`Tamaño final: ${sizeMB.toFixed(2)} MB (${stats.size} bytes)`);

  if (sizeMB < 5.0) {
    console.log(`✅ Cumple holgadamente la restricción de tamaño (< 5 MB, óptimo para WhatsApp: ${(sizeMB).toFixed(2)} MB).`);
  } else {
    console.warn(`⚠️ Atención: El video supera los 5 MB.`);
  }
}

recordWalkthrough().catch(err => {
  console.error('Error fatal durante la grabación:', err);
  process.exit(1);
});
