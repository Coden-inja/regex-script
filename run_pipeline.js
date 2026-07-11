require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { cleanTextForTTS } = require('./text_sanitizer');

async function main() {
    console.log("================================================================================");
    console.log("UNIFIED TEXT CLEANING & TRUNCATION PIPELINE");
    console.log("================================================================================");

    const startTime = performance.now();
    const isReviewedOnly = process.argv.includes('--reviewed');
    
    const logFilePath = path.join(__dirname, 'pipeline_run.log');
    // Initialize log file
    fs.writeFileSync(logFilePath, `=== PIPELINE RUN LOG - ${new Date().toISOString()} ===\n`);
    fs.appendFileSync(logFilePath, `Mode: ${isReviewedOnly ? 'TARGETED (15 REVIEWED IDs)' : 'ALL PUBLISHED PROPERTIES'}\n`);
    fs.appendFileSync(logFilePath, "=".repeat(80) + "\n\n");

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: Number(process.env.DATABASE_PORT) || 3306
    });

    try {
        let query = '';
        let targetIds = [3382, 4785, 2836, 469, 4914, 1986, 1784, 573, 1670, 5346, 1671, 3573, 6483, 4561, 6347];

        if (isReviewedOnly) {
            console.log(`Running in TARGETED mode for the ${targetIds.length} reviewed property IDs.`);
            query = `SELECT id, frontend_overview FROM properties WHERE id IN (${targetIds.join(',')})`;
        } else {
            console.log("Running in FULL mode for all published properties.");
            query = 'SELECT id, frontend_overview FROM properties WHERE is_published = 1';
        }

        const [properties] = await connection.execute(query);
        console.log(`Fetched ${properties.length} rows from the database.`);
        console.log(`Logs will be written to: ${logFilePath}`);
        console.log("-".repeat(80));

        let processedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        const BATCH_SIZE = 50;

        for (let i = 0; i < properties.length; i += BATCH_SIZE) {
            const chunk = properties.slice(i, i + BATCH_SIZE);
            const logEntries = [];

            const promises = chunk.map(async (prop) => {
                const rawText = prop.frontend_overview;
                let targetText = 'SKIPPED_LEGAL_BOILERPLATE';
                let cleanedBeforeTruncation = '';
                let rawWordCount = 0;
                let cleanedWordCount = 0;
                let finalWordCount = 0;

                if (rawText && rawText !== 'null') {
                    rawWordCount = rawText.split(/\s+/).filter(w => w.length > 0).length;
                    const cleaned = cleanTextForTTS(rawText);

                    if (cleaned !== null) {
                        cleanedBeforeTruncation = cleaned;
                        cleanedWordCount = cleaned.split(/\s+/).filter(w => w.length > 0).length;

                        // Perform truncation logic
                        const words = cleaned.split(/\s+/).filter(w => w.length > 0);
                        if (words.length <= 150) {
                            targetText = cleaned;
                        } else {
                            const windowWords = words.slice(0, 172);
                            const windowText = windowWords.join(' ');

                            const lastPuncIndex = Math.max(
                                windowText.lastIndexOf('.'),
                                windowText.lastIndexOf('!'),
                                windowText.lastIndexOf('?')
                            );

                            if (lastPuncIndex !== -1) {
                                targetText = windowText.substring(0, lastPuncIndex + 1).trim();
                            } else {
                                targetText = words.slice(0, 150).join(' ') + '.';
                            }
                        }
                        finalWordCount = targetText.split(/\s+/).filter(w => w.length > 0).length;
                    } else {
                        skippedCount++;
                    }
                } else {
                    return; // Skip completely empty/null rows from updating
                }

                // Helper to limit text to a specific word count in logs
                const limitWords = (str, limit) => {
                    if (!str) return '';
                    const words = str.split(/\s+/).filter(w => w.length > 0);
                    if (words.length <= limit) return str;
                    return words.slice(0, limit).join(' ') + '... [truncated in log]';
                };

                const loggedRaw = limitWords(rawText, 200);
                const loggedCleaned = limitWords(cleanedBeforeTruncation, 200);

                // Write detailed side-by-side transformation log
                const logEntry = [
                    `Row ID: ${prop.id}`,
                    `Raw Word Count:       ${rawWordCount}`,
                    `Cleaned Word Count:   ${cleanedWordCount}`,
                    `Truncated Word Count: ${finalWordCount}`,
                    `[RAW TEXT]:\n${loggedRaw}`,
                    `[CLEANED TEXT]:\n${loggedCleaned || '(SKIPPED/EMPTY)'}`,
                    `[FINAL TRUNCATED TEXT]:\n${targetText}`,
                    "-".repeat(80),
                    ""
                ].join('\n');

                logEntries.push({ id: prop.id, entry: logEntry });

                try {
                    await connection.execute(
                        'UPDATE properties SET tts_clean_overview = ? WHERE id = ?',
                        [targetText, prop.id]
                    );
                    processedCount++;
                } catch (err) {
                    errorCount++;
                    console.error(`[ERROR] Failed to update row ID ${prop.id}:`, err.message);
                    fs.appendFileSync(logFilePath, `[ERROR] Failed to update row ID ${prop.id}: ${err.message}\n\n`);
                }
            });

            await Promise.all(promises);

            // Print logs sequentially so they don't interleave in the terminal
            logEntries.sort((a, b) => a.id - b.id).forEach(item => {
                fs.appendFileSync(logFilePath, item.entry);
                console.log(item.entry);
            });

            console.log(`[PROGRESS] Processed ${Math.min(i + BATCH_SIZE, properties.length)} / ${properties.length} rows...`);
        }

        const endTime = performance.now();
        const totalDurationMs = endTime - startTime;

        const summaryMetrics = [
            "",
            "=".repeat(80),
            "PIPELINE RUN METRICS",
            "=".repeat(80),
            `Total Rows Evaluated:      ${properties.length}`,
            `Successfully Updated:      ${processedCount}`,
            `Boilerplate Skips:         ${skippedCount}`,
            `Errors Encountered:        ${errorCount}`,
            `Total Elapsed Time:        ${(totalDurationMs / 1000).toFixed(4)} seconds`,
            "=".repeat(80)
        ].join('\n');

        console.log(summaryMetrics);
        fs.appendFileSync(logFilePath, summaryMetrics + '\n');

    } catch (error) {
        console.error("Pipeline script encountered a critical error:", error);
        fs.appendFileSync(logFilePath, `\n[CRITICAL ERROR]: ${error.stack}\n`);
    } finally {
        await connection.end();
    }
}

main();
