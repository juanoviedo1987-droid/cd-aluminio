const fs = require('fs');

const eml = fs.readFileSync('email_9_content.eml', 'utf8');

const marker = 'Content-Disposition: attachment; filename="Texto para cotizador 1.xlsx"';
const parts = eml.split(marker);
if (parts.length < 2) {
  console.error('Attachment not found');
  process.exit(1);
}

const sub = parts[1];
const b64Data = sub.split('\r\n\r\n')[1].split('--0000')[0].replace(/\r?\n/g, '');
fs.writeFileSync('Texto para cotizador 1.xlsx', Buffer.from(b64Data, 'base64'));
console.log('Saved Texto para cotizador 1.xlsx successfully! Size:', fs.statSync('Texto para cotizador 1.xlsx').size);
