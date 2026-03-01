import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = process.env.PORT || "3000";
const host = "127.0.0.1";
const targetUrl = `http://${host}:${port}`;

const child = spawn("react-router-serve", ["./build/server/index.js"], {
  env: process.env,
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

