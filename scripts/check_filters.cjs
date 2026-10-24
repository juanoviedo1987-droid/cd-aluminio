const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const out = execSync(`"${ffmpeg}" -filters`).toString();
console.log('has drawtext:', out.includes('drawtext'));
console.log('has subtitles:', out.includes('subtitles'));
