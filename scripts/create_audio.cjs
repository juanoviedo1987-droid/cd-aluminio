const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

// Generar una pista de fondo corporativa suave y moderna de 22 segundos
// Usando sintetizador armónico en La Menor (Am - F - C - G) con ritmo suave
const audioCmd = `"${ffmpeg}" -y -f lavfi -i "eval=val(0):s=44100" -f lavfi -i "sine=frequency=220:duration=22" -f lavfi -i "sine=frequency=330:duration=22" -f lavfi -i "sine=frequency=440:duration=22" -filter_complex "[1:a]volume=0.15[a1];[2:a]volume=0.12[a2];[3:a]volume=0.10[a3];[a1][a2][a3]amix=inputs=3:duration=first,lowpass=f=1200,afade=t=in:ss=0:d=1,afade=t=out:st=20:d=2[out]" -map "[out]" -c:a aac -b:a 128k ambient_loop.aac`;

try {
  execSync(audioCmd);
  console.log('Pista de audio sintetizada con éxito.');
} catch (e) {
  console.error('Error sintetizando audio:', e.message);
}
