import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

type SeedModule = Record<string, unknown>;

async function run() {
  const seedsDir = path.resolve(process.cwd(), "prisma", "seeds");
  const entries = await fs.readdir(seedsDir, { withFileTypes: true });

  const seedFiles = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        (entry.name === "seed-week9.ts" || entry.name === "seed-week10.ts")
    )
    .map((entry) => entry.name)
    .sort();

  if (seedFiles.length === 0) {
    console.log("No matching seed files found in prisma/seeds");
    process.exit(0);
  }

  for (const fileName of seedFiles) {
    const fullPath = path.join(seedsDir, fileName);
    const moduleUrl = pathToFileURL(fullPath).href;
    const mod = (await import(moduleUrl)) as SeedModule;

    const seedEntries = Object.entries(mod).filter(
      ([key, value]) => key.startsWith("seed") && typeof value === "function"
    ) as Array<[string, () => Promise<unknown>]>;

    if (seedEntries.length === 0) {
      console.log(`Skipping ${fileName} (no exported seed function found)`);
      continue;
    }

    for (const [exportName, seedFn] of seedEntries) {
      console.log(`Running ${fileName} → ${exportName}...`);
      await seedFn();
      console.log(`Done: ${fileName} → ${exportName}`);
    }
  }

  console.log("All seeds completed.");
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed runner failed:");
  console.error(error);
  process.exit(1);
});