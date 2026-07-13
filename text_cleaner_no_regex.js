/**
 * Simple text-to-speech cleaning and truncation utility.
 * Uses exact word lookups and basic string replacements.
 */

const WORD_REPLACEMENTS = {
    "sqft": "square feet",
    "sq": "square",
    "ft": "feet",
    "apt": "apartment",
    "br": "bedrooms",
    "ba": "baths",
    "nyc": "New York City"
};

/**
 * Standardizes common abbreviation words without using complex pattern matching.
 * @param {string} rawText - The raw listing description.
 * @returns {string} - Cleaned description text.
 */
function cleanText(rawText) {
    if (!rawText) return '';
    
    let words = rawText.split(/\s+/);
    
    words = words.map(w => {
        const cleanWord = w.toLowerCase().replace(/[,;.]/g, '');
        if (WORD_REPLACEMENTS[cleanWord]) {
            return WORD_REPLACEMENTS[cleanWord];
        }
        return w;
    });

    let t = words.join(' ');
    
    // Remove structural punctuation
    t = t.replace(/[,;]/g, ' ');

    // Normalize spacing
    while (t.includes('  ')) {
        t = t.replace('  ', ' ');
    }

    return t.trim();
}

/**
 * Truncates text to a maximum of 150-172 words, breaking at sentence-ending punctuation.
 * @param {string} text - Cleaned description text.
 * @returns {string} - Truncated description text.
 */
function truncateText(text) {
    if (!text) return '';
    
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length <= 150) {
        return text;
    }
    
    const windowWords = words.slice(0, 172);
    const windowText = windowWords.join(' ');

    const lastPuncIndex = Math.max(
        windowText.lastIndexOf('.'),
        windowText.lastIndexOf('!'),
        windowText.lastIndexOf('?')
    );

    if (lastPuncIndex !== -1) {
        return windowText.substring(0, lastPuncIndex + 1).trim();
    } else {
        return words.slice(0, 150).join(' ') + '.';
    }
}

/**
 * Main entry point to clean and truncate listing text.
 * @param {string} rawText - Raw input text.
 * @returns {string} - Final cleaned and truncated text.
 */
function cleanAndTruncate(rawText) {
    const cleaned = cleanText(rawText);
    return truncateText(cleaned);
}

module.exports = {
    cleanText,
    truncateText,
    cleanAndTruncate
};
