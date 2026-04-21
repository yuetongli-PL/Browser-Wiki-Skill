// @ts-check
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { collectBookContent } from '../../src/entrypoints/pipeline/collect-book-content.mjs';

const GENERATED_CONTEXT = {
  "host": "www.22biqu.com",
  "baseUrl": "https://www.22biqu.com/",
  "generatedAt": "2026-04-13T15:52:55.138Z",
  "capabilities": [
    "search-content",
    "navigate-to-content",
    "navigate-to-author",
    "navigate-to-chapter",
    "download-content"
  ],
  "profileVersion": 2,
  "historicalSamples": {
    "queries": [
      "玄鉴仙族"
    ],
    "books": [
      {
        "title": "玄鉴仙族",
        "finalUrl": "https://www.22biqu.com/biqu5735/",
        "authorName": "季越人"
      },
      {
        "title": "科技巨头",
        "finalUrl": "https://www.22biqu.com/biqu4738/",
        "authorName": "石慌"
      }
    ],
    "sourceRunDir": "C:\\Users\\lyt-p\\Desktop\\Browser-Wiki-Skill\\knowledge-base\\www.22biqu.com\\raw\\step-book-content\\20260413T141912512Z_www.22biqu.com_book-content"
  }
};
function normalizeWhitespace(v){return String(v ?? '').replace(/\s+/gu,' ').trim();}
function normalizeText(v){return normalizeWhitespace(String(v ?? '').normalize('NFKC'));}
function normalizeUrlNoFragment(v){if(!v)return null; try{const u=new URL(String(v)); u.hash=''; return u.toString();}catch{return String(v).split('#')[0];}}
async function readJson(p){return JSON.parse(await readFile(p,'utf8'));}
function pickBook(books, bookTitle, bookUrl){const t=normalizeText(bookTitle); const u=normalizeUrlNoFragment(bookUrl); return books.find((book)=> (u && normalizeUrlNoFragment(book.finalUrl)===u) || (t && normalizeText(book.title)===t)) ?? books[0] ?? null;}
export async function crawlBook(options = {}) {
  const bookTitle = normalizeText(options.bookTitle);
  const bookUrl = normalizeUrlNoFragment(options.bookUrl);
  if (!bookTitle && !bookUrl) throw new Error('Missing bookTitle or bookUrl.');
  const manifest = await collectBookContent(options.url || GENERATED_CONTEXT.baseUrl, {
    outDir: options.outDir ? path.resolve(options.outDir) : path.resolve(process.cwd(), 'book-content'),
    searchQueries: bookTitle ? [bookTitle] : [],
    targetBookTitle: bookTitle || undefined,
    targetBookUrl: bookUrl || undefined,
    skipFallback: true,
    maxFallbackBooks: 0,
  });
  const books = await readJson(manifest.files.books);
  const matched = pickBook(books, bookTitle, bookUrl);
  if (!matched?.downloadFile) {
    const error = new Error(bookTitle ? 'search-no-results: ' + bookTitle : 'book-not-found');
    error.code = 'search-no-results';
    throw error;
  }
  return {
    host: GENERATED_CONTEXT.host,
    baseUrl: GENERATED_CONTEXT.baseUrl,
    generatedContext: GENERATED_CONTEXT,
    manifestPath: manifest.files.manifest,
    outDir: manifest.outDir,
    bookTitle: matched.title,
    finalUrl: matched.finalUrl,
    downloadFile: matched.downloadFile,
    mode: 'crawled',
  };
}
function parseCliArgs(argv){ const options={}; const readValue=(i)=>{ if(i+1>=argv.length) throw new Error('Missing value for ' + argv[i]); return { value: argv[i+1], nextIndex: i+1 }; }; for(let i=0;i<argv.length;i+=1){ const token=argv[i]; switch(token){ case '--book-title': { const { value, nextIndex } = readValue(i); options.bookTitle=value; i=nextIndex; break; } case '--book-url': { const { value, nextIndex } = readValue(i); options.bookUrl=value; i=nextIndex; break; } case '--url': { const { value, nextIndex } = readValue(i); options.url=value; i=nextIndex; break; } case '--out-dir': { const { value, nextIndex } = readValue(i); options.outDir=value; i=nextIndex; break; } case '--help': case '-h': options.help=true; break; default: break; } } return options; }
const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if(entryPath && fileURLToPath(import.meta.url)===entryPath){ const options=parseCliArgs(process.argv.slice(2)); if(options.help){ process.stdout.write('Usage:\n  node crawler.mjs --book-title <title> [--book-url <url>] [--url <site>] [--out-dir <dir>]\n'); } else { crawlBook(options).then((result)=>console.log(JSON.stringify(result,null,2))).catch((error)=>{ console.error(error?.message ?? String(error)); process.exitCode=1; }); } }
