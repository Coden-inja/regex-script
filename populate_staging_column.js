require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { cleanTextForTTS } = require('./text_sanitizer');

// Initialize database adapter with optimized connection limit for parallel updates
const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT),
    connectionLimit: 50,
    connectTimeout: 30000,
    acquireTimeout: 30000,
    ssl: false,
});

const prisma = new PrismaClient({
    adapter,
    log: ['error']
});

async function main() {
    console.log("================================================================================");
    console.log("DATABASE STAGING COLUMN POPULATOR (CONCURRENT BATCHED)");
    console.log("================================================================================");

    const startTime = performance.now();

    try {
        console.log("Querying database for rows with missing tts_clean_overview staging data...");

        // Execute raw query to bypass Prisma schema generation limits
        const properties = await prisma.$queryRaw`
            SELECT id, frontend_overview AS frontendOverview 
            FROM properties 
            WHERE is_published = 1 AND tts_clean_overview IS NULL
        `;

        console.log(`Fetched ${properties.length} published rows to process.`);
        console.log("-".repeat(80));

        let processedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        const samples = [];
        const BATCH_SIZE = 50;

        for (let i = 0; i < properties.length; i += BATCH_SIZE) {
            const chunk = properties.slice(i, i + BATCH_SIZE);

            const promises = chunk.map(async (prop) => {
                const rawText = prop.frontendOverview;
                let targetText = 'SKIPPED_LEGAL_BOILERPLATE';

                if (rawText) {
                    const cleaned = cleanTextForTTS(rawText);
                    if (cleaned !== null) {
                        targetText = cleaned;
                    } else {
                        skippedCount++;
                    }
                } else {
                    return;
                }

                try {
                    // Execute parameterized raw update
                    await prisma.$executeRaw`
                        UPDATE properties 
                        SET tts_clean_overview = ${targetText} 
                        WHERE id = ${prop.id}
                    `;
                    processedCount++;

                    // Capture a few samples of successful non-skipped updates
                    if (targetText !== 'SKIPPED_LEGAL_BOILERPLATE' && samples.length < 3) {
                        samples.push({
                            id: prop.id,
                            raw: rawText.substring(0, 150) + (rawText.length > 150 ? '...' : ''),
                            cleaned: targetText.substring(0, 150) + (targetText.length > 150 ? '...' : '')
                        });
                    }
                } catch (err) {
                    errorCount++;
                    console.error(`[ERROR] Failed to update row ID ${prop.id}:`, err.message);
                }
            });

            // Wait for the concurrent batch of updates to complete
            await Promise.all(promises);

            console.log(`[PROGRESS] Processed ${Math.min(i + BATCH_SIZE, properties.length)} / ${properties.length} rows...`);
        }

        const endTime = performance.now();
        const totalDurationMs = endTime - startTime;

        console.log("STAGING RUN METRICS");
        console.log("================================================================================");
        console.log(`Total Rows Found:          ${properties.length}`);
        console.log(`Successfully Populated:    ${processedCount}`);
        console.log(`Boilerplate Skips:         ${skippedCount}`);
        console.log(`Errors Encountered:        ${errorCount}`);
        console.log(`Total Elapsed Time:        ${(totalDurationMs / 1000).toFixed(4)} seconds`);
        console.log("================================================================================");

        if (samples.length > 0) {
            console.log("\n=== SUCCESSFUL UPDATE SAMPLES (VERIFICATION PASS) ===");
            samples.forEach((sample, index) => {
                console.log(`\nSample #${index + 1} - [ID ${sample.id}]`);
                console.log(`  Raw Text:     "${sample.raw}"`);
                console.log(`  Cleaned Text: "${sample.cleaned}"`);
            });
            console.log("================================================================================");
        }

    } catch (error) {
        console.error("Staging populator script encountered a critical error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
