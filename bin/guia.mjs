// Abre o Guia de Desenvolvimento no navegador padrão.
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const file = resolve(import.meta.dirname, '../docs/guia-de-desenvolvimento/index.html');
const url = pathToFileURL(file).href;
const openers = { darwin: ['open', [url]], win32: ['cmd', ['/c', 'start', '', url]] };
const [cmd, args] = openers[process.platform] ?? ['xdg-open', [url]];

console.log(url);
const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
child.on('error', () => console.log('Não consegui abrir o navegador; abra a URL acima.'));
child.unref();
