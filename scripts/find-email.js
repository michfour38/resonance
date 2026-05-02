const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const email = "michelle.potgieter@gmail.com";

async function main() {
  console.log("Searching for:", email);

  const results = [];

  try {
    const entryLeads = await prisma.entry_leads.findMany({
      where: { email },
    });
    if (entryLeads.length) {
      results.push({ table: "entry_leads", data: entryLeads });
    }
  } catch {}

  try {
    const profiles = await prisma.profiles.findMany({
      where: { email },
    });
    if (profiles.length) {
      results.push({ table: "profiles", data: profiles });
    }
  } catch {}

  try {
    const anyTextMatch = await prisma.$queryRawUnsafe(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND data_type IN ('text','character varying')
    `);

    for (const col of anyTextMatch) {
      try {
        const rows = await prisma.$queryRawUnsafe(
          `SELECT * FROM "${col.table_name}" WHERE "${col.column_name}" = $1 LIMIT 5`,
          email
        );

        if (rows.length > 0) {
          results.push({
            table: col.table_name,
            column: col.column_name,
            data: rows,
          });
        }
      } catch {}
    }
  } catch {}

  if (results.length === 0) {
    console.log("❌ Email not found anywhere");
  } else {
    console.log("✅ FOUND:");
    results.forEach((r) => {
      console.log("\n---");
      console.log("Table:", r.table);
      if (r.column) console.log("Column:", r.column);
      console.log(r.data);
    });
  }

  await prisma.$disconnect();
}

main().catch(console.error);