process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const tls = require('tls');
const fs = require('fs');

const socket = tls.connect(993, 'imap.gmail.com');
let state = 'INIT';
let raw = '';

socket.on('data', (chunk) => {
  raw += chunk.toString();

  if (state === 'INIT' && raw.includes('* OK')) {
    state = 'LOGIN';
    raw = '';
    socket.write('A1 LOGIN jov.agn.ops@gmail.com synzktrnpefprxwa\r\n');
  } else if (state === 'LOGIN' && raw.includes('A1 OK')) {
    state = 'SELECT';
    raw = '';
    socket.write('A2 SELECT INBOX\r\n');
  } else if (state === 'SELECT' && raw.includes('A2 OK')) {
    state = 'FETCH_BODY';
    raw = '';
    // Mensaje 9 es el Fwd: CD Aluminio
    socket.write('A3 FETCH 9 (BODY.PEEK[])\r\n');
  } else if (state === 'FETCH_BODY' && raw.includes('A3 OK')) {
    fs.writeFileSync('email_9_content.eml', raw);
    console.log('Saved email 9 to email_9_content.eml, bytes:', raw.length);
    state = 'LOGOUT';
    socket.write('A4 LOGOUT\r\n');
  } else if (state === 'LOGOUT') {
    socket.end();
  }
});
