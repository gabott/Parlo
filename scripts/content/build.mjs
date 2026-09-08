import { compileAll } from "./pipeline.mjs";

try {
  const { bundles, manifest } = await compileAll({ write: true });
  console.log(`Built ${bundles.length} bundle(s); manifest ${manifest.checksum}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
