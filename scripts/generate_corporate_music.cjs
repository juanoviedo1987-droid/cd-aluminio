const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

// Configuración de audio
const SAMPLE_RATE = 44100;
const DURATION = 36; // 36 segundos
const NUM_SAMPLES = SAMPLE_RATE * DURATION;
const BPM = 116;
const BEAT_DUR = 60 / BPM;
const SIXTEENTH = BEAT_DUR / 4;
const BAR_DUR = BEAT_DUR * 4;

// Frecuencias
const CHORDS = [
  // C major: C4, E4, G4, C5 (Bass: C3)
  { root: 130.81, notes: [261.63, 329.63, 392.00, 523.25, 659.25] },
  // G major: B3, D4, G4, D5 (Bass: G2)
  { root: 98.00,  notes: [246.94, 293.66, 392.00, 587.33, 783.99] },
  // A minor: A3, C4, E4, A4 (Bass: A2)
  { root: 110.00, notes: [220.00, 261.63, 329.63, 440.00, 523.25] },
  // F major: F3, A3, C4, F4 (Bass: F2)
  { root: 87.31,  notes: [174.61, 220.00, 261.63, 349.23, 523.25] }
];

// Arpeggio index sequence (16 steps per bar)
const ARP_PATTERN = [0, 1, 2, 3, 1, 2, 4, 2, 0, 2, 3, 1, 2, 3, 4, 3];
// Bass rhythm triggers (in 16th notes): 0 (beat 1), 6 (beat 2.5), 8 (beat 3), 12 (beat 4)
const BASS_TRIGGERS = [0, 6, 8, 12];

const leftBuf = new Float32Array(NUM_SAMPLES);
const rightBuf = new Float32Array(NUM_SAMPLES);

// 1. Generar eventos y sumarlos a los buffers
for (let s = 0; s < NUM_SAMPLES; s++) {
  const t = s / SAMPLE_RATE;
  
  // Posición en compases
  const totalBars = t / BAR_DUR;
  const chordIdx = Math.floor(totalBars) % 4;
  const currentChord = CHORDS[chordIdx];
  const barTime = t % BAR_DUR;
  const sixteenthIdx = Math.floor(barTime / SIXTEENTH);
  const timeSinceSixteenth = barTime - (sixteenthIdx * SIXTEENTH);

  // --- Capa 1: PAD ARMÓNICO (Cálido y envolvente) ---
  let padSignal = 0;
  for (let n = 0; n < 3; n++) {
    const f = currentChord.notes[n];
    // Sutil coro / modulación
    const mod = 1 + 0.002 * Math.sin(2 * Math.PI * 3.5 * t);
    padSignal += Math.sin(2 * Math.PI * f * mod * t) * 0.04;
    padSignal += Math.sin(2 * Math.PI * (f * 2) * t) * 0.008;
  }
  // Suave ataque de compás
  const padEnvelope = Math.min(1, barTime / 0.3) * Math.min(1, (BAR_DUR - barTime) / 0.3);
  padSignal *= padEnvelope;

  // --- Capa 2: ARPEGIADOR MELÓDICO (Marimba / Campana alegre corporativa) ---
  const arpNoteIdx = ARP_PATTERN[sixteenthIdx % 16] % currentChord.notes.length;
  const arpF = currentChord.notes[arpNoteIdx];
  // Decaimiento exponencial agradable tipo plucky
  const arpEnv = Math.exp(-timeSinceSixteenth * 14);
  const arpSound = (
    Math.sin(2 * Math.PI * arpF * timeSinceSixteenth) * 0.7 +
    Math.sin(2 * Math.PI * arpF * 2 * timeSinceSixteenth) * 0.2 +
    Math.sin(2 * Math.PI * arpF * 3 * timeSinceSixteenth) * 0.05
  ) * arpEnv * 0.12;

  // Paneo estéreo alternante para dar sensación espacial moderna
  const pan = (sixteenthIdx % 2 === 0) ? 0.35 : 0.65;
  const arpL = arpSound * (1 - pan);
  const arpR = arpSound * pan;

  // --- Capa 3: BASSLINE (Línea de bajo corporativa) ---
  let bassSignal = 0;
  let minBassTime = 999;
  for (const trig of BASS_TRIGGERS) {
    const trigTime = trig * SIXTEENTH;
    if (barTime >= trigTime) {
      const dt = barTime - trigTime;
      if (dt < minBassTime) minBassTime = dt;
    }
  }
  if (minBassTime < 0.6) {
    const bassEnv = Math.exp(-minBassTime * 4.5);
    const bf = currentChord.root;
    bassSignal = (
      Math.sin(2 * Math.PI * bf * minBassTime) * 0.8 +
      Math.sin(2 * Math.PI * (bf * 2) * minBassTime) * 0.25
    ) * bassEnv * 0.16;
  }

  // --- Capa 4: SHAKER / PULSO RÍTMICO SUAVE (Modern corporate groove) ---
  let shakerSignal = 0;
  const eighthDur = BEAT_DUR / 2;
  const timeSinceEighth = (t % eighthDur);
  if (timeSinceEighth < 0.035) {
    const sEnv = Math.exp(-timeSinceEighth * 120);
    // Pseudo-white noise
    const noise = (Math.random() * 2 - 1);
    shakerSignal = noise * sEnv * 0.025;
  }

  // Fade In (primeros 2 seg) y Fade Out (últimos 3.5 seg)
  let masterEnv = 1;
  if (t < 2.0) {
    masterEnv = t / 2.0;
  } else if (t > (DURATION - 3.5)) {
    masterEnv = Math.max(0, (DURATION - t) / 3.5);
  }

  leftBuf[s] = (padSignal * 0.7 + arpL + bassSignal * 0.6 + shakerSignal) * masterEnv;
  rightBuf[s] = (padSignal * 0.7 + arpR + bassSignal * 0.6 + shakerSignal) * masterEnv;
}

// Convertir a WAV buffer de 16-bit PCM estéreo
function createWavBuffer(left, right, sampleRate) {
  const numSamples = left.length;
  const byteRate = sampleRate * 4;
  const blockAlign = 4;
  const dataSize = numSamples * 4;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(2, 22);  // NumChannels (2)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Clamp entre -1.0 y 1.0
    const sampleL = Math.max(-1, Math.min(1, left[i]));
    const sampleR = Math.max(-1, Math.min(1, right[i]));
    const intL = sampleL < 0 ? sampleL * 0x8000 : sampleL * 0x7FFF;
    const intR = sampleR < 0 ? sampleR * 0x8000 : sampleR * 0x7FFF;

    buffer.writeInt16LE(Math.floor(intL), offset);
    buffer.writeInt16LE(Math.floor(intR), offset + 2);
    offset += 4;
  }

  return buffer;
}

console.log('Generando pista WAV estéreo...');
const wavBuffer = createWavBuffer(leftBuf, rightBuf, SAMPLE_RATE);
const tempWavPath = path.resolve('temp_music.wav');
const finalM4aPath = path.resolve('ambient_music.m4a');

fs.writeFileSync(tempWavPath, wavBuffer);
console.log(`WAV creado (${(wavBuffer.length / 1024 / 1024).toFixed(2)} MB). Codificando a M4A de alta fidelidad...`);

// Codificar con ffmpeg a AAC estéreo y aplicar un sutil chorus y ecualización de mastering
const cmd = `"${ffmpeg}" -y -i "${tempWavPath}" -c:a aac -b:a 160k -ar 44100 "${finalM4aPath}"`;
execSync(cmd);

if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath);

const stats = fs.statSync(finalM4aPath);
console.log(`✅ Música corporativa moderna generada exitosamente: ${finalM4aPath} (${(stats.size / 1024).toFixed(1)} KB)`);
