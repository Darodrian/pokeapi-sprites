import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spritesDir = path.join(repoRoot, "sprites");
const shinyDir = path.join(spritesDir, "shiny");
const normalManifest = JSON.parse(
  fs.readFileSync(path.join(spritesDir, "manifest.json"), "utf8")
);

function readSprite(key) {
  const baseId = key.slice(0, 4);
  const variation = key.length === 8 ? key.slice(4) : null;
  const dir = path.join(shinyDir, baseId, ...(variation ? [variation] : []));
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;

  const xmlPath = path.join(dir, "AnimData.xml");
  if (!fs.existsSync(xmlPath)) return null;

  const xml = fs.readFileSync(xmlPath, "utf8");
  const declared = new Set(
    [...xml.matchAll(/<Name>([^<]+)<\/Name>/g)].map((m) => m[1].trim())
  );
  if (!declared.has("Walk")) return null;

  const anims = fs
    .readdirSync(dir)
    .filter((file) => /-Anim\.png$/.test(file))
    .map((file) => file.replace(/-Anim\.png$/, ""))
    .filter((anim) => declared.has(anim))
    .sort();

  return anims.includes("Walk") ? anims : null;
}

function diskKeys() {
  const keys = [];
  for (const id of fs.readdirSync(shinyDir)) {
    if (!/^\d{4}$/.test(id)) continue;
    const dir = path.join(shinyDir, id);
    if (!fs.statSync(dir).isDirectory()) continue;
    keys.push(id);
    for (const variation of fs.readdirSync(dir)) {
      if (!/^\d{4}$/.test(variation)) continue;
      const varDir = path.join(dir, variation);
      if (fs.statSync(varDir).isDirectory()) keys.push(id + variation);
    }
  }
  return keys;
}

const manifest = {};
for (const key of Object.keys(normalManifest)) {
  const anims = readSprite(key);
  if (anims) manifest[key] = anims;
}

const known = new Set(Object.keys(manifest));
for (const key of diskKeys().sort()) {
  if (known.has(key)) continue;
  const anims = readSprite(key);
  if (anims) manifest[key] = anims;
}

fs.writeFileSync(
  path.join(spritesDir, "manifest-shiny.json"),
  JSON.stringify(manifest, null, 2)
);

console.log(`manifest-shiny.json: ${Object.keys(manifest).length} playable sprites`);
