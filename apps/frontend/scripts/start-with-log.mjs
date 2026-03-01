import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const frontendRoot = resolve(import.meta.dirname, "..");
const repoRoot = resolve(frontendRoot, "..", "..");
const environment = process.env.NODE_ENV || "development";
const envFiles = [".env", ".env.local", `.env.${environment}`, `.env.${environment}.local`];

const parseEnvLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex <= 0) return null;

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
};

const loadEnvFrom = (baseDir) => {
  envFiles.forEach((fileName) => {
    const filePath = resolve(baseDir, fileName);
    if (!existsSync(filePath)) return;

    const contents = readFileSync(filePath, "utf8");
    contents.split("\n").forEach((line) => {
      const parsed = parseEnvLine(line);
      if (!parsed) return;
      process.env[parsed.key] = parsed.value;
    });
  });
};

loadEnvFrom(repoRoot);
loadEnvFrom(frontendRoot);

const port = process.env.FRONTEND_PORT || process.env.PORT || "3001";
const host = "127.0.0.1";
const targetUrl = `http://${host}:${port}`;

const child = spawn("react-router-serve", ["./build/server/index.js"], {
  env: {
    ...process.env,
    PORT: port,
  },
  stdio: "inherit",
  shell: process.platform === "win32",
});

let frontendReady = false;

const waitForFrontend = async () => {
  while (!frontendReady && !child.killed) {
    try {
      const response = await fetch(targetUrl);
      if (response.ok) {
        frontendReady = true;
        console.log(`Frontend listening at http://localhost:${port}`);
        return;
      }
    } catch {
      // Ignore until ready.
    }
    await sleep(250);
  }
};

void waitForFrontend();

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
