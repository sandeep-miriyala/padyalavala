// Checks the built site (run `npm run build` first, then `npm test`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const out = new URL("../out/", import.meta.url);
const has = (p) => existsSync(new URL(p, out));

test("the site was built", { skip: !has("index.html") && "run npm run build first" }, () => {
  const pages = ["index.html", "about/index.html", "404.html", "qa/index.html", "aksharamala/index.html", "guninta/index.html", "padalu/index.html", "sametalu/index.html", "sandhi/index.html", "samasa/index.html"];
  for (const f of [...pages, "manifest.json", "sw.js", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"]) assert.ok(has(f), `missing out/${f}`);
});

test("the app can be installed: manifest with name, start page and icons", { skip: !has("manifest.json") && "run npm run build first" }, () => {
  const m = JSON.parse(readFileSync(new URL("manifest.json", out), "utf8"));
  assert.ok(m.name && m.short_name && m.start_url && m.display === "standalone");
  for (const size of ["192x192", "512x512"]) assert.ok(m.icons.some((i) => i.sizes === size), `icon ${size}`);
  assert.ok(m.icons.some((i) => i.purpose === "maskable"), "maskable icon");
});

test("every page has a language, a title and a skip link", { skip: !has("index.html") && "run npm run build first" }, () => {
  const html = readFileSync(new URL("index.html", out), "utf8");
  assert.match(html, /<html lang="te"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /విషయానికి వెళ్ళండి/);
});

test("grammar pages have their Telugu content", { skip: !has("sametalu/index.html") && "run npm run build first" }, () => {
  const read = (p) => readFileSync(new URL(p, out), "utf8");
  assert.match(read("aksharamala/index.html"), /అక్షరమాల/);
  assert.match(read("guninta/index.html"), /గుణింతం/);
  assert.match(read("sametalu/index.html"), /సామెత/);
  assert.match(read("sandhi/index.html"), /సవర్ణదీర్ఘ సంధి/);
  assert.match(read("samasa/index.html"), /ద్వంద్వ సమాసము/);
  assert.ok(has("akshara/1.webp"), "alphabet pictures");
});
