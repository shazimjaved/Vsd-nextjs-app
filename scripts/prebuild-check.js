
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("🔍 Running pre-build self-healing check...");

// Verify firebase.json exists
const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
if (!fs.existsSync(firebaseJsonPath)) {
  console.error("❌ firebase.json not found! Build may fail.");
  process.exit(1);
}

// Load firebase.json
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));

// Verify apphosting.yaml exists (required for App Hosting/Prototyper)
const apphostingYamlPath = path.join(__dirname, '..', 'apphosting.yaml');
if (!fs.existsSync(apphostingYamlPath)) {
  console.warn("⚠️ apphosting.yaml not found. App Hosting deployments may fail.");
} else {
  console.log("✅ apphosting.yaml found.");
}

// Note: We're using App Hosting, not standard hosting
// Standard hosting config is not needed for Prototyper/App Hosting workflow
console.log("✅ Using App Hosting configuration (configured via apphosting.yaml).");

// Verify node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log("📦 node_modules missing. Installing dependencies...");
  execSync('npm install', { stdio: 'inherit' });
  console.log("✅ Dependencies installed.");
}

// Backup current build for rollback
const buildPath = path.join(__dirname, '..', 'build');
const backupPath = path.join(__dirname, '..', 'build_backup');
if (fs.existsSync(buildPath)) {
  fs.rmSync(backupPath, { recursive: true, force: true });
  fs.renameSync(buildPath, backupPath);
  console.log("💾 Build backup created for rollback.");
}

console.log("✅ Pre-build self-healing check complete. Ready to build!");
