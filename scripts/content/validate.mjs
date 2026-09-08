import { compileAll } from "./pipeline.mjs";

try {
  const { bundles } = await compileAll();
  console.log(`Validated ${bundles.length} content bundle(s).`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
