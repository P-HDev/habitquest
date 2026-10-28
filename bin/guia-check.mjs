// Falha se o guia citar caminho inexistente em <code> ou link #ancora sem id.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'docs/guia-de-desenvolvimento/index.html'), 'utf8');

const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<[^>]+>/g, '');
const PATH_RE = /^[\w.@-]+(\/[\w.@-]+)*\/?$/;
const FILE_RE = /^[\w.@/-]+\.(md|json|ts|tsx|mjs|js|toml|html|yml|yaml)$/;

const withoutPre = html.replace(/<pre>[\s\S]*?<\/pre>/g, '');
const codes = [...withoutPre.matchAll(/<code>([\s\S]*?)<\/code>/g)].map((m) => decode(m[1]).trim());
const paths = [...new Set(codes)].filter(
  (c) => !c.startsWith('@') && (c.includes('/') || FILE_RE.test(c)) && (FILE_RE.test(c) || PATH_RE.test(c)),
);
const missingPaths = paths.filter((p) => !existsSync(resolve(root, p)));

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
const anchors = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]))];
const missingAnchors = anchors.filter((a) => !ids.includes(a));

for (const p of missingPaths) console.error(`caminho inexistente: ${p}`);
for (const a of missingAnchors) console.error(`âncora sem id: #${a}`);
for (const d of new Set(dupIds)) console.error(`id duplicado: ${d}`);

const failed = missingPaths.length + missingAnchors.length + dupIds.length > 0;
console.log(`guia:check ${failed ? 'FALHOU' : 'ok'} — ${paths.length} caminhos, ${anchors.length} âncoras, ${ids.length} ids`);
process.exit(failed ? 1 : 0);
