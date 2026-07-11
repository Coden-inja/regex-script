require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
    console.log("================================================================================");
    console.log("DATABASE TTS TEXT TRUNCATOR (CONCURRENT BATCHED - MYSQL2)");
    console.log("================================================================================");

    const startTime = performance.now();

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: Number(process.env.DATABASE_PORT) || 3306
    });

    try {
        console.log("Querying database for rows with non-empty tts_clean_overview to truncate...");

        const [properties] = await connection.execute(
            `SELECT id, tts_clean_overview FROM properties 
             WHERE tts_clean_overview IS NOT NULL 
               AND tts_clean_overview != '' 
               AND tts_clean_overview != 'SKIPPED_LEGAL_BOILERPLATE'`
        );

        console.log(`Fetched ${properties.length} rows to evaluate.`);
        console.log("-".repeat(80));

        let processedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        const samples = [];
        const BATCH_SIZE = 50;

        for (let i = 0; i < properties.length; i += BATCH_SIZE) {
            const chunk = properties.slice(i, i + BATCH_SIZE);

            const promises = chunk.map(async (prop) => {
                const text = prop.tts_clean_overview;
                const words = text.split(/\s+/).filter(w => w.length > 0);

                if (words.length <= 150) {
                    skippedCount++;
                    return; // Skip rows that are already <= 150 words
                }

                let truncatedText = '';
                const windowWords = words.slice(0, 172);
                const windowText = windowWords.join(' ');

                const lastPuncIndex = Math.max(
                    windowText.lastIndexOf('.'),
                    windowText.lastIndexOf('!'),
                    windowText.lastIndexOf('?')
                );

                if (lastPuncIndex !== -1) {
                    truncatedText = windowText.substring(0, lastPuncIndex + 1).trim();
                } else {
                    // If no punctuation found, hard-cut at 150 words + append '.'
                    truncatedText = words.slice(0, 150).join(' ') + '.';
                }

                try {
                    await connection.execute(
                        'UPDATE properties SET tts_clean_overview = ? WHERE id = ?',
                        [truncatedText, prop.id]
                    );
                    processedCount++;

                    if (samples.length < 3) {
                        samples.push({
                            id: prop.id,
                            originalWordCount: words.length,
                            truncatedWordCount: truncatedText.split(/\s+/).filter(w => w.length > 0).length,
                            original: text.substring(0, 150) + '...',
                            truncated: truncatedText
                        });
                    }
                } catch (err) {
                    errorCount++;
                    console.error(`[ERROR] Failed to update row ID ${prop.id}:`, err.message);
                }
            });

            await Promise.all(promises);

            console.log(`[PROGRESS] Evaluated ${Math.min(i + BATCH_SIZE, properties.length)} / ${properties.length} rows...`);
        }

        const endTime = performance.now();
        const totalDurationMs = endTime - startTime;

        console.log("\n================================================================================");
        console.log("TRUNCATION RUN METRICS");
        console.log("================================================================================");
        console.log(`Total Rows Evaluated:      ${properties.length}`);
        console.log(`Successfully Truncated:    ${processedCount}`);
        console.log(`Already <= 150 (Skipped):  ${skippedCount}`);
        console.log(`Errors Encountered:        ${errorCount}`);
        console.log(`Total Elapsed Time:        ${(totalDurationMs / 1000).toFixed(4)} seconds`);
        console.log("================================================================================");

        if (samples.length > 0) {
            console.log("\n=== TRUNCATION SAMPLES (VERIFICATION PASS) ===");
            samples.forEach((sample, index) => {
                console.log(`\nSample #${index + 1} - [ID ${sample.id}]`);
                console.log(`  Original Word Count:  ${sample.originalWordCount}`);
                console.log(`  Truncated Word Count: ${sample.truncatedWordCount}`);
                console.log(`  Truncated Content:    "${sample.truncated}"`);
            });
            console.log("================================================================================");
        }

    } catch (error) {
        console.error("Truncator script encountered a critical error:", error);
    } finally {
        await connection.end();
    }
}

main();
