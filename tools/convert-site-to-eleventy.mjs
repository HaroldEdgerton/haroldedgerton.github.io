import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const siteDir = path.join(repoRoot, "site");
const srcDir = path.join(repoRoot, "src");

const managedDirs = [
  "about",
  "assets",
  "calendar",
  "events",
  "index.php",
  "living-here",
  "new",
  "news",
  "redirects",
  "resources",
  "search",
  "wp-content"
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rmIfExists(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, value);
}

function copyIfExists(from, to) {
  if (!fs.existsSync(from)) return;
  rmIfExists(to);
  fs.cpSync(from, to, { recursive: true });
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function yamlQuote(value) {
  return JSON.stringify(String(value || ""));
}

function extract(regex, html) {
  const match = html.match(regex);
  return match ? match[1] : "";
}

function walkHtml(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtml(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function toPermalink(file) {
  const rel = path.relative(siteDir, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function toSrcTemplate(file) {
  const rel = path.relative(siteDir, file);
  return path.join(srcDir, rel.replace(/\.html$/, ".njk"));
}

function normalizeMain(html) {
  return html
    .replace(/^\s+/, "")
    .replace(/\s+$/, "")
    .replace(/\n {4}/g, "\n");
}

function createContentPage(file, html) {
  const title = decodeHtml(extract(/<title>(.*?) \| Edgerton House<\/title>/s, html)) || "Edgerton House";
  const description = decodeHtml(extract(/<meta name="description" content="([^"]*)">/s, html));
  const mainMatch = html.match(/<main id="main" class="([^"]*)">([\s\S]*?)<\/main>/);
  if (!mainMatch) return false;

  const mainClass = mainMatch[1] || "main-standard";
  const content = normalizeMain(mainMatch[2]);
  const permalink = toPermalink(file);
  const output = `---\nlayout: layout.njk\ntitle: ${yamlQuote(title)}\ndescription: ${yamlQuote(description)}\nmainClass: ${yamlQuote(mainClass)}\npermalink: ${yamlQuote(permalink)}\n---\n${content}\n`;
  write(toSrcTemplate(file), output);
  return true;
}

function createRawPage(file, html) {
  const permalink = toPermalink(file);
  const output = `---\npermalink: ${yamlQuote(permalink)}\neleventyExcludeFromCollections: true\n---\n${html}`;
  write(toSrcTemplate(file), output);
}

function main() {
  if (!fs.existsSync(siteDir)) {
    throw new Error("site/ does not exist. Build or restore the generated site before converting.");
  }

  ensureDir(srcDir);
  for (const dir of managedDirs) rmIfExists(path.join(srcDir, dir));
  rmIfExists(path.join(srcDir, "index.njk"));
  rmIfExists(path.join(srcDir, "search-index.json"));
  rmIfExists(path.join(srcDir, ".nojekyll"));

  copyIfExists(path.join(siteDir, "assets"), path.join(srcDir, "assets"));
  copyIfExists(path.join(siteDir, "wp-content"), path.join(srcDir, "wp-content"));
  copyIfExists(path.join(siteDir, "new"), path.join(srcDir, "new"));
  copyIfExists(path.join(siteDir, ".nojekyll"), path.join(srcDir, ".nojekyll"));
  copyIfExists(path.join(siteDir, "search-index.json"), path.join(srcDir, "search-index.json"));

  const htmlFiles = walkHtml(siteDir);
  let contentPages = 0;
  let rawPages = 0;
  for (const file of htmlFiles) {
    const rel = path.relative(siteDir, file).split(path.sep).join("/");
    if (rel.startsWith("wp-content/") || rel.startsWith("new/")) continue;
    const html = read(file);
    if (rel.startsWith("index.php/")) {
      createRawPage(file, html);
      rawPages += 1;
    } else if (createContentPage(file, html)) {
      contentPages += 1;
    } else {
      createRawPage(file, html);
      rawPages += 1;
    }
  }

  console.log(`Converted ${contentPages} content pages and ${rawPages} raw pages into src/.`);
}

main();
