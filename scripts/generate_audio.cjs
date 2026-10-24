const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

// Generar una progresión de acordes corporativos suaves y relajantes (Do mayor y La menor)
// con envolvente armónica y fade in / fade out
const cmd = `"${ffmpeg}" -y -f lavfi -i "sine=frequency=261.63:duration=24" -f lavfi -i "sine=frequency=329.63:duration=24" -f lavfi -i "sine=frequency=392.00:duration=24" -f lavfi -i "sine=frequency=523.25:duration=24" -filter_complex "[0:a]volume=0.08[a0];[1:a]volume=0.07[a1];[2:a]volume=0.06[a2];[3:a]volume=0.05[a3];[a0][a1][a2][a3]amix=inputs=4:duration=first,lowpass=f=800,afade=t=in:ss=0:d=1.5,afade=t=out:st=21:d=3[out]" -map "[out]" -c:a aac -b:a 128k ambient_music.m4a`;

execSync(cmd);
console.log('Pista de música ambiental corporativa generada con éxito.');
