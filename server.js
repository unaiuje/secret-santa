// Servidor estático mínimo para el prototipo Regalizo (sin dependencias).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/manifest+json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};
const PORTS = [3000, 8080, 5500, 5000];

function tryListen(port) {
  const srv = http.createServer((req, res) => {
    let p;
    try {
      p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch (e) {
      res.writeHead(400); res.end(); return;
    }
    if (p === '/') p = '/index.html';
    const f = path.join(ROOT, path.normalize(p).replace(/^(\.\.[\/\\])+/, ''));
    if (!f.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    fs.readFile(f, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
  srv.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      const next = PORTS[PORTS.indexOf(port) + 1];
      if (next) tryListen(next);
      else { console.error('No hay puertos libres'); process.exit(1); }
    } else { throw e; }
  });
  srv.listen(port, '127.0.0.1', () => console.log('Regalizo en http://localhost:' + port));
}
tryListen(PORTS[0]);
