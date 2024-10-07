const fs = require('fs');
const path = require('path');

const prodManifestPath = path.join(__dirname, '../snap.manifest.json');
const devManifestPath = path.join(__dirname, '../snap.manifest.dev.json');

if (!fs.existsSync(devManifestPath)) {
  console.warn('snap.manifest.dev.json does not exist. Skipping the merge process.');
  process.exit(0); // Exit the script gracefully
}

const prodManifest = JSON.parse(fs.readFileSync(prodManifestPath, 'utf-8'));
const devManifest = JSON.parse(fs.readFileSync(devManifestPath, 'utf-8'));

const mergedManifest = {
  ...prodManifest,
  initialPermissions: devManifest.initialPermissions, // Keep the initialPermissions from the dev manifest
};

fs.writeFileSync(devManifestPath, JSON.stringify(mergedManifest, null, 2));
console.log('snap.manifest.dev.json has been updated successfully.');
