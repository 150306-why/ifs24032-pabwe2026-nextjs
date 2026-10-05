import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Membaca APP_PORT dari .env (atau .env.example sebagai cadangan). */
function readPortFromEnv(): number {
  for (const file of [".env", ".env.example"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    const match = readFileSync(path, "utf-8").match(/^APP_PORT=(\d+)/m);
    if (match) return Number(match[1]);
  }
  return 3000;
}

const mode = process.argv[2] === "start" ? "start" : "dev";
const port = Number(process.env.APP_PORT) || readPortFromEnv();

const child = spawn("npx", ["next", mode, "-p", String(port)], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));
