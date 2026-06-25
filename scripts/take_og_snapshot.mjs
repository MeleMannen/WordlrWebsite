#!/usr/bin/env node

import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { webkit } from "playwright";

const APP_HOST = process.env.APP_HOST ?? "127.0.0.1";
const OUTPUT_PATH = process.argv[2] ?? path.join("public", "og-preview.png");
const USE_EXTERNAL_URL = Boolean(process.env.OG_SNAPSHOT_URL);
const TARGET_PATH = "/open-graph-builder";

async function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.unref();
    server.on("error", reject);
    server.listen(0, APP_HOST, () => {
      const address = server.address();

      if (typeof address === "string" || address === null) {
        reject(new Error("Could not resolve an available local port."));
        return;
      }

      const { port } = address;
      server.close(() => resolve(port));
    });
  });
}

function waitForServer(url, timeoutMs = 60000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await fetch(url);

        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // Next may still be compiling. Keep polling until timeout.
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }

      setTimeout(poll, 500);
    };

    poll();
  });
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function findExistingTargetUrl(output) {
  const localUrlMatches = [...output.matchAll(/-\s+Local:\s+(https?:\/\/\S+)/g)];
  const existingLocalUrl = localUrlMatches.at(-1)?.[1];

  if (
    output.includes("Another next dev server is already running") &&
    existingLocalUrl
  ) {
    return `${existingLocalUrl}${TARGET_PATH}`;
  }

  return null;
}

function resolveTargetUrlFromDevServerExit({ code, output }) {
  const existingTargetUrl = findExistingTargetUrl(output);

  if (code !== 0 && existingTargetUrl) {
    return existingTargetUrl;
  }

  if (code !== 0) {
    throw new Error(`Next dev server exited with code ${code}.`);
  }

  throw new Error("Next dev server exited before the snapshot was taken.");
}

async function startDevServer() {
  const existingServer = await findExistingDevServerFromLock();

  if (existingServer) {
    return existingServer;
  }

  const port = process.env.APP_PORT ?? (await findAvailablePort());
  const targetUrl = `http://${APP_HOST}:${port}${TARGET_PATH}`;
  let serverOutput = "";
  const child = spawn(
    "npm",
    ["run", "dev", "--", "--hostname", APP_HOST, "--port", String(port)],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    }
  );

  const captureOutput = (data) => {
    const text = data.toString();
    serverOutput += text;
    process.stdout.write(data);
  };

  child.stdout.on("data", captureOutput);
  child.stderr.on("data", captureOutput);

  const devServerExit = new Promise((resolve) => {
    child.once("exit", (code) => {
      resolve({
        code,
        output: serverOutput,
      });
    });
  });

  const resolvedTargetUrl = await Promise.race([
    waitForServer(targetUrl).then(async () => {
      const exitResult = await Promise.race([
        devServerExit,
        delay(1500).then(() => null),
      ]);
      const existingTargetUrl = findExistingTargetUrl(serverOutput);

      if (exitResult) {
        return resolveTargetUrlFromDevServerExit(exitResult);
      }

      if (existingTargetUrl) {
        return existingTargetUrl;
      }

      return targetUrl;
    }),
    devServerExit.then(resolveTargetUrlFromDevServerExit),
  ]);

  if (resolvedTargetUrl !== targetUrl) {
    await waitForServer(resolvedTargetUrl);

    return {
      targetUrl: resolvedTargetUrl,
      stop: () => {
        child.kill("SIGTERM");
      },
    };
  }

  return {
    targetUrl: resolvedTargetUrl,
    stop: () => {
      child.kill("SIGTERM");
    },
  };
}

async function findExistingDevServerFromLock() {
  if (process.env.APP_PORT) {
    return null;
  }

  const lockPath = path.join(".next", "dev", "lock");

  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));

    if (typeof lock.appUrl !== "string") {
      return null;
    }

    const targetUrl = `${lock.appUrl}${TARGET_PATH}`;
    await waitForServer(targetUrl, 2000);

    return {
      targetUrl,
      stop: () => {},
    };
  } catch {
    return null;
  }
}

async function waitForCanvasRender(page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas");

    if (!(canvas instanceof HTMLCanvasElement) || canvas.width === 0 || canvas.height === 0) {
      return false;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return false;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let index = 3; index < imageData.length; index += 4) {
      if (imageData[index] !== 0) {
        return true;
      }
    }

    return false;
  });
}

async function main() {
  execSync("npx playwright install webkit", { stdio: "inherit" });

  const server = USE_EXTERNAL_URL
    ? {
        targetUrl: process.env.OG_SNAPSHOT_URL,
        stop: () => {},
      }
    : await startDevServer();

  const browser = await webkit.launch({ headless: true });

  try {
    const page = await browser.newPage({
      /**
       * Intentionally making the height taller to make the Next.js
       * dev indicator not overlap with the snapshot area.
       */
      viewport: { width: 1280, height: 1000 },
    });

    await page.goto(server.targetUrl, { waitUntil: "networkidle" });

    const snapshotContainerElement = page.locator(`.ogBuilderPreview`);
    const snapshotElement = page.locator(`.openGraphBuilderThemeRootContainer`);

    await snapshotContainerElement.waitFor({ state: "attached" });
    await snapshotElement.waitFor({ state: "attached" });
    await waitForCanvasRender(page);

    await snapshotContainerElement.evaluate((el) => {
      el.style.setProperty("--preview-scale-factor", "1");
    });

    await snapshotElement.evaluate((el) => {
      el.style.borderRadius = "0px";
    });

    await snapshotElement.screenshot({ path: OUTPUT_PATH });

    console.log(`Saved snapshot to ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
    server.stop();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
