import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const required = [
  "public/index.html",
  "public/assets/index-CIJTfFxp.css",
  "public/assets/TradePanel-CTD15WYE.css",
  "public/carpathian-hero.png",
  "public/admin/index.html",
  "public/admin/admin.js",
  "public/wallet/index.html",
  "public/wallet/manifest.webmanifest",
  "public/wallet/icons/apple-touch-icon.png",
  "public/wallet/icons/icon-192.png",
  "public/wallet/icons/icon-512.png",
  "public/wallet/wallet.css",
  "public/wallet/wallet.js",
  "public/site-content.js",
  "netlify/functions/price.mjs",
  "netlify/functions/metrics.mjs",
  "netlify/functions/news.mjs",
  "netlify/functions/admin-session.mjs",
  "netlify/functions/admin-content.mjs",
  "netlify/functions/site-content.mjs",
  "netlify/functions/admin-media.mjs",
  "netlify/functions/media.mjs",
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing required files:\n${missing.join("\n")}`);
  process.exit(1);
}

const walletPage = readFileSync("public/wallet/index.html", "utf8");
const requiredWalletMarkers = [
  "Wallet im Browser öffnen",
  "Auf Android testen",
  "Zum iPhone-Startbildschirm",
  "/downloads/300-wallet-android-preprod.apk",
  "/downloads/300-wallet-chrome-preprod-preview.zip",
  "Preprod-Testversion",
  "data-wallet-preview-status",
  "data-wallet-frame",
  "/wallet-app/index.html",
];
const missingMarkers = requiredWalletMarkers.filter((marker) => !walletPage.includes(marker));

if (missingMarkers.length) {
  console.error(`Wallet page is missing required integration markers:\n${missingMarkers.join("\n")}`);
  process.exit(1);
}

const homePage = readFileSync("public/index.html", "utf8");
const missingHomeMarkers = [
  'class="wallet-nav-link" href="/wallet/"',
  'class="wallet-promo"',
  'href="/wallet/">300 Wallet öffnen',
].filter((marker) => !homePage.includes(marker));
if (missingHomeMarkers.length) {
  console.error(`Homepage is missing visible wallet entry points:\n${missingHomeMarkers.join("\n")}`);
  process.exit(1);
}

const netlifyConfiguration = readFileSync("netlify.toml", "utf8");
if (
  !netlifyConfiguration.includes('for = "/wallet-app/assets/cardano/*"') ||
  !netlifyConfiguration.includes('Content-Type = "application/wasm"')
) {
  console.error("Netlify configuration must serve the stable Cardano WASM path as application/wasm");
  process.exit(1);
}

const walletManifest = JSON.parse(readFileSync("public/wallet/manifest.webmanifest", "utf8"));
if (walletManifest.start_url !== "/wallet/" || walletManifest.scope !== "/wallet/" || walletManifest.display !== "standalone") {
  console.error("Wallet web app manifest must use /wallet/ for start_url and scope with standalone display");
  process.exit(1);
}

const androidBuild = "public/downloads/300-wallet-android-preprod.apk";
if (existsSync(androidBuild) && statSync(androidBuild).size < 1_000_000) {
  console.error("Android APK is unexpectedly small; refusing a likely placeholder artifact");
  process.exit(1);
}

const chromeBuild = "public/downloads/300-wallet-chrome-preprod-preview.zip";
if (existsSync(chromeBuild) && statSync(chromeBuild).size < 1_000_000) {
  console.error("Chrome preview ZIP is unexpectedly small; refusing a likely placeholder artifact");
  process.exit(1);
}

for (const script of ["public/wallet/wallet.js", "scripts/integrate-wallet-web.mjs", "scripts/local-server.mjs"]) {
  execFileSync(process.execPath, ["--check", script], { stdio: "inherit" });
}

const walkFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const absolutePath = join(directory, entry.name);
  return entry.isDirectory() ? walkFiles(absolutePath) : [absolutePath];
});

const walletBuildIndex = "public/wallet-app/index.html";
if (existsSync(walletBuildIndex)) {
  const manifestPath = "public/wallet-app/build-manifest.json";
  if (!existsSync(manifestPath)) {
    console.error("Integrated wallet build is missing public/wallet-app/build-manifest.json");
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (
    manifest.schemaVersion !== 1 ||
    manifest.basePath !== "/wallet-app" ||
    manifest.network !== "preprod" ||
    manifest.mainnetSigningEnabled !== false ||
    typeof manifest.sourceCommit !== "string" ||
    !manifest.sourceCommit
  ) {
    console.error("Integrated wallet build manifest has unexpected release metadata");
    process.exit(1);
  }

  const appIndex = readFileSync(walletBuildIndex, "utf8");
  const rootReferences = [...appIndex.matchAll(/(?:src|href)=["'](\/[^"']*)["']/g)].map((match) => match[1]);
  const invalidReferences = rootReferences.filter((reference) => reference !== "/wallet-app" && !reference.startsWith("/wallet-app/"));
  if (invalidReferences.length) {
    console.error(`Integrated wallet build contains root-relative paths outside /wallet-app:\n${[...new Set(invalidReferences)].join("\n")}`);
    process.exit(1);
  }

  const walletFiles = walkFiles("public/wallet-app");
  const wasmFiles = walletFiles.filter((file) => file.endsWith(".wasm"));
  if (wasmFiles.length !== 1) {
    console.error(`Integrated wallet build must contain exactly one WASM file, found ${wasmFiles.length}`);
    process.exit(1);
  }

  const wasmRelativePath = relative("public/wallet-app", wasmFiles[0]).split(sep).join("/");
  if (
    !wasmRelativePath.startsWith("assets/cardano/cardano_serialization_lib_bg.") ||
    manifest.wasmPath !== wasmRelativePath
  ) {
    console.error(`Integrated wallet build uses an unstable or untracked WASM path: ${wasmRelativePath}`);
    process.exit(1);
  }
  if (statSync(wasmFiles[0]).size < 1_000_000) {
    console.error("Integrated Cardano WASM is unexpectedly small");
    process.exit(1);
  }

  const expectedWasmUrl = `/wallet-app/${wasmRelativePath}`;
  const wasmReferences = [];
  for (const javaScriptFile of walletFiles.filter((file) => file.endsWith(".js"))) {
    const source = readFileSync(javaScriptFile, "utf8");
    wasmReferences.push(
      ...[...source.matchAll(/["']([^"']+\.wasm(?:[?#][^"']*)?)["']/gi)].map((match) => match[1]),
    );
    if (/["'][^"']*(?:node_modules\/\.pnpm|\.pnpm\/)[^"']*\.wasm["']/i.test(source)) {
      console.error(`Integrated wallet JavaScript contains an unstable pnpm WASM reference: ${javaScriptFile}`);
      process.exit(1);
    }
  }
  if (wasmReferences.length < 1) {
    console.error(`Integrated wallet JavaScript does not reference ${expectedWasmUrl}`);
    process.exit(1);
  }
  const invalidWasmReferences = wasmReferences.filter((reference) => reference !== expectedWasmUrl);
  if (invalidWasmReferences.length) {
    console.error(`Integrated wallet JavaScript contains unexpected WASM URLs:\n${invalidWasmReferences.join("\n")}`);
    process.exit(1);
  }
}

console.log("Public deploy package is ready.");
