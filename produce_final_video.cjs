const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const FFMPEG = '/opt/homebrew/bin/ffmpeg';
const OUTPUT_DIR = path.join(__dirname, 'video_clips');
const FINAL_DIR = path.join(__dirname, 'final_output');

// Markdown content for the demo — purposeful, clean, realistic
const DEMO_DECK = `# Estratégia Digital 2026
Plano de produto para o próximo trimestre.

* Lançamento da nova API v3.0
* Migração para micro-serviços
* Dashboard analítico em tempo real

???
Introduzir o roadmap técnico com dados reais.
---
## Arquitetura Proposta ⚡

* **Frontend**: React 19 + Tailwind CSS v4
* **Backend**: Node.js com Fastify
* **Base de Dados**: PostgreSQL + Redis Cache
* **Deploy**: GitHub Actions → Cloud Run

???
Detalhar a stack técnica escolhida e justificar cada decisão.
---
## Resultados Esperados 📊

Redução de **40%** no tempo de deploy.

Aumento de **3x** na velocidade de resposta da API.

Cobertura de testes a **95%**.
---
# Obrigado! 🎉
Pressione **C** para celebrar.

🌐 ss20112006.github.io/Markdeck
`;

async function recordClip(name, viewport, actions) {
  const clipDir = path.join(OUTPUT_DIR, name);
  if (!fs.existsSync(clipDir)) fs.mkdirSync(clipDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    recordVideo: { dir: clipDir, size: viewport },
  });
  const page = await context.newPage();

  await actions(page);

  await page.close();
  await context.close();
  await browser.close();

  // Find the recorded .webm
  const files = fs.readdirSync(clipDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) throw new Error(`No recording found for clip: ${name}`);
  return path.join(clipDir, files[files.length - 1]);
}

async function main() {
  [OUTPUT_DIR, FINAL_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

  const VP = { width: 1440, height: 900 };

  // ═══════════════════════════════════════════
  // CLIP 1: SPLIT-VIEW LIVE EDITING (8 seconds)
  // ═══════════════════════════════════════════
  console.log('🎬 Recording Clip 1: Split-View Live Editing...');
  const clip1 = await recordClip('clip1_editing', VP, async (page) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1500);

    // Click into CodeMirror editor
    const cm = await page.waitForSelector('.cm-content');
    await cm.click();

    // Navigate to end of first line and add text character by character (visible typing)
    await page.keyboard.press('Home');
    await page.keyboard.press('End');

    // Type slowly to show real-time sync
    const textToType = ' — Edição Ao Vivo';
    for (const char of textToType) {
      await page.keyboard.type(char);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(2000);

    // Navigate to next line and add a bullet
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    const bulletText = '* Sincronização instantânea do preview';
    for (const char of bulletText) {
      await page.keyboard.type(char);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(2500);
  });
  console.log(`   ✓ ${clip1}`);

  // ═══════════════════════════════════════════
  // CLIP 2: DRAG & DROP IMPORT (7 seconds)
  // ═══════════════════════════════════════════
  console.log('🎬 Recording Clip 2: Drag & Drop Import...');
  const clip2 = await recordClip('clip2_dragdrop', VP, async (page) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);

    // Trigger dragover overlay
    await page.evaluate(() => {
      const screen = document.querySelector('.screen-only');
      if (screen) {
        screen.dispatchEvent(new DragEvent('dragover', {
          bubbles: true, cancelable: true, dataTransfer: new DataTransfer(),
        }));
      }
    });
    await page.waitForTimeout(2500);

    // Drop the file
    await page.evaluate((content) => {
      const file = new File([content], 'estrategia-digital-2026.md', { type: 'text/markdown' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const screen = document.querySelector('.screen-only');
      if (screen) {
        screen.dispatchEvent(new DragEvent('drop', {
          bubbles: true, cancelable: true, dataTransfer: dt,
        }));
      }
    }, DEMO_DECK);

    await page.waitForTimeout(3500);
  });
  console.log(`   ✓ ${clip2}`);

  // ═══════════════════════════════════════════
  // CLIP 3: PRESENTATION MODE + NAVIGATION (14 seconds)
  // ═══════════════════════════════════════════
  console.log('🎬 Recording Clip 3: Presentation Mode...');
  const clip3 = await recordClip('clip3_presentation', VP, async (page) => {
    // Load the demo deck first
    await page.goto('http://localhost:5173');
    await page.evaluate((content) => {
      localStorage.setItem('markdeck:content', content);
      localStorage.setItem('markdeck:filename', 'estrategia-digital-2026.md');
    }, DEMO_DECK);
    await page.reload();
    await page.waitForTimeout(1500);

    // Click Apresentar button
    await page.click('button[aria-label="Iniciar Apresentação (Cmd+Enter)"]');
    await page.waitForTimeout(2500);

    // Slide 1 → Slide 2
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(3000);

    // Slide 2 → Slide 3
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(3000);

    // Slide 3 → Slide 4
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(3000);

    await page.waitForTimeout(1500);
  });
  console.log(`   ✓ ${clip3}`);

  // ═══════════════════════════════════════════
  // CLIP 4: CONFETTI CELEBRATION (6 seconds)
  // ═══════════════════════════════════════════
  console.log('🎬 Recording Clip 4: Confetti...');
  const clip4 = await recordClip('clip4_confetti', VP, async (page) => {
    // Load the demo deck at slide 4 (Obrigado)
    await page.goto('http://localhost:5173');
    await page.evaluate((content) => {
      localStorage.setItem('markdeck:content', content);
      localStorage.setItem('markdeck:filename', 'estrategia-digital-2026.md');
    }, DEMO_DECK);
    await page.reload();
    await page.waitForTimeout(500);

    // Navigate to last slide
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    // Enter presentation on last slide
    await page.click('button[aria-label="Iniciar Apresentação (Cmd+Enter)"]');
    await page.waitForTimeout(1500);

    // Fire confetti
    await page.keyboard.press('c');
    await page.waitForTimeout(1500);
    await page.keyboard.press('c');
    await page.waitForTimeout(3000);
  });
  console.log(`   ✓ ${clip4}`);

  // ═══════════════════════════════════════════
  // CLIP 5: SHORTCUTS MODAL (5 seconds)
  // ═══════════════════════════════════════════
  console.log('🎬 Recording Clip 5: Shortcuts Modal...');
  const clip5 = await recordClip('clip5_shortcuts', VP, async (page) => {
    await page.goto('http://localhost:5173');
    await page.evaluate((content) => {
      localStorage.setItem('markdeck:content', content);
      localStorage.setItem('markdeck:filename', 'estrategia-digital-2026.md');
    }, DEMO_DECK);
    await page.reload();
    await page.waitForTimeout(1000);

    // Open shortcuts modal
    await page.click('button[aria-label="Atalhos de teclado"]');
    await page.waitForTimeout(4000);
  });
  console.log(`   ✓ ${clip5}`);

  // ═══════════════════════════════════════════
  // POST-PROCESSING: Build final 1080x1350 MP4
  // ═══════════════════════════════════════════
  console.log('\n🎞️  Building final 1080x1350 (4:5) composite video...');

  // Step 1: Convert each clip to MP4 with consistent framerate
  const clips = [
    { src: clip1, name: 'clip1.mp4', dur: 8 },
    { src: clip2, name: 'clip2.mp4', dur: 7 },
    { src: clip3, name: 'clip3.mp4', dur: 14 },
    { src: clip4, name: 'clip4.mp4', dur: 6 },
    { src: clip5, name: 'clip5.mp4', dur: 5 },
  ];

  for (const clip of clips) {
    const outPath = path.join(FINAL_DIR, clip.name);
    execSync(`${FFMPEG} -y -i "${clip.src}" -t ${clip.dur} -c:v libx264 -pix_fmt yuv420p -r 30 -preset fast -crf 18 "${outPath}"`, { stdio: 'pipe' });
    console.log(`   ✓ Encoded ${clip.name} (${clip.dur}s)`);
  }

  // Step 2: Create concat list
  const concatFile = path.join(FINAL_DIR, 'concat.txt');
  const concatContent = clips.map(c => `file '${c.name}'`).join('\n');
  fs.writeFileSync(concatFile, concatContent);

  // Step 3: Concatenate all clips into one seamless 1440x900 raw video
  const rawConcat = path.join(FINAL_DIR, 'raw_concat.mp4');
  execSync(`${FFMPEG} -y -f concat -safe 0 -i "${concatFile}" -c:v libx264 -pix_fmt yuv420p -r 30 -preset medium -crf 18 "${rawConcat}"`, { stdio: 'pipe' });
  console.log('   ✓ Concatenated raw clips');

  // Step 4: Composite into 1080x1350 (4:5) canvas
  // Layout: dark background → scaled app (960x600 centered) → rounded window chrome
  const finalMp4 = path.join(__dirname, 'markdeck_launch_demo.mp4');
  const compositeCmd = `${FFMPEG} -y -i "${rawConcat}" -filter_complex "
    color=c=#0a0a10:s=1080x1350:r=30[bg];
    [0:v]scale=960:600[app];
    [bg][app]overlay=60:375[out]
  " -map "[out]" -c:v libx264 -pix_fmt yuv420p -r 30 -preset medium -crf 18 -movflags +faststart "${finalMp4}"`;
  execSync(compositeCmd, { stdio: 'pipe' });
  console.log(`   ✓ Final composite: ${finalMp4}`);

  // Step 5: Copy to Desktop
  const desktopMp4 = path.join(process.env.HOME, 'Desktop', 'markdeck_launch_demo.mp4');
  fs.copyFileSync(finalMp4, desktopMp4);
  console.log(`   ✓ Desktop copy: ${desktopMp4}`);

  // Step 6: Generate thumbnail at t=22s (presentation mode scene)
  const thumbnailPng = path.join(__dirname, 'thumbnail.png');
  const desktopThumb = path.join(process.env.HOME, 'Desktop', 'markdeck_thumbnail.png');
  execSync(`${FFMPEG} -y -ss 22 -i "${finalMp4}" -vframes 1 -update 1 "${thumbnailPng}"`, { stdio: 'pipe' });
  fs.copyFileSync(thumbnailPng, desktopThumb);
  console.log(`   ✓ Thumbnail: ${thumbnailPng}`);

  // Step 7: Get final duration
  const probe = execSync(`${FFMPEG} -i "${finalMp4}" 2>&1 || true`).toString();
  const durMatch = probe.match(/Duration:\s*(\d+:\d+:\d+\.\d+)/);
  const duration = durMatch ? durMatch[1] : 'unknown';

  console.log('\n🎉 ═══════════════════════════════════════════');
  console.log('   PRODUCTION COMPLETE');
  console.log('   ═══════════════════════════════════════════');
  console.log(`   📹 Video:     ${finalMp4}`);
  console.log(`   📹 Desktop:   ${desktopMp4}`);
  console.log(`   🖼️  Thumbnail: ${thumbnailPng}`);
  console.log(`   ⏱️  Duration:  ${duration}`);
  console.log(`   📐 Resolution: 1080x1350 (4:5)`);
  console.log(`   🎬 Codec:     H.264 / 30fps`);
  console.log('   ═══════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('PRODUCTION ERROR:', err);
  process.exit(1);
});
