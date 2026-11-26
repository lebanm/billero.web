import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { handleRequest } from '../edge/language-router.mjs';

const staticOnly = process.argv.includes('--static');
const args = process.argv.slice(2).filter(arg => arg !== '--static');
const root = path.resolve(args[1] || fileURLToPath(new URL('../', import.meta.url)));
const port = Number(args[0] || 8788);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
async function origin(request) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url).pathname); } catch { return new Response(null, { status: 400 }); }
  let filename = path.resolve(root, '.' + pathname);
  const relative = path.relative(root, filename);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p => p.startsWith('.')) || /^(ai|scripts|tests|edge|node_modules|predaja-)/.test(relative)) return new Response(null, { status: 404 });
  if (pathname.endsWith('/')) filename = path.join(filename, 'index.html');
  else if (!path.extname(pathname)) {
    if (await stat(filename).then(info => info.isDirectory(), () => false)) {
      const target = new URL(request.url);
      target.pathname += '/';
      return Response.redirect(target, 301);
    }
    filename += '.html';
  }
  try {
    const bytes = await readFile(filename);
    return new Response(request.method === 'HEAD' ? null : bytes, { headers: { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' } });
  } catch { return new Response('Not found', { status: 404 }); }
}
const server = http.createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, { method: incoming.method, headers: incoming.headers });
    const response = await (staticOnly ? origin(request) : handleRequest(request, origin));
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) { console.error(error); outgoing.writeHead(500); outgoing.end('Preview error'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port} (${staticOnly ? 'static, no Worker' : 'with Worker'})`));
