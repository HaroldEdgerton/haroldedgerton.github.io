import fs from "node:fs";
import path from "node:path";

const siteDir = path.join(process.cwd(), "site");

if (!fs.existsSync(siteDir)) {
  process.exit(0);
}

for (const entry of fs.readdirSync(siteDir)) {
  fs.rmSync(path.join(siteDir, entry), { recursive: true, force: true });
}
