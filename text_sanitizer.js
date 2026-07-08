const writtenNumber = require('written-number');

/**
 * Custom number to words conversion supporting decimals and hyphens replacement.
 */
function convertNumberToWords(num) {
    if (num === null || num === undefined) return '';
    const nStr = num.toString().trim();
    if (nStr.includes('.')) {
        const parts = nStr.split('.');
        const intPart = parseInt(parts[0], 10);
        const intWords = isNaN(intPart) ? '' : (intPart === 0 ? 'zero' : writtenNumber(intPart));
        const decWords = parts[1].split('').map(d => {
            const digit = parseInt(d, 10);
            return isNaN(digit) ? '' : (digit === 0 ? 'zero' : writtenNumber(digit));
        }).filter(w => w !== '').join(' ');
        
        let result = '';
        if (intWords) result += intWords;
        if (decWords) result += (result ? ' point ' : 'point ') + decWords;
        return result.replace(/-/g, ' ');
    }
    
    const val = parseInt(nStr, 10);
    if (isNaN(val)) return '';
    if (val === 0) return 'zero';
    return writtenNumber(val).replace(/-/g, ' ');
}

/**
 * Ordinal to words conversion (e.g. 1st -> first, 127th -> one hundred twenty seventh).
 */
function ordinalToWords(numStr) {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return numStr;
    const words = convertNumberToWords(num);
    
    if (words.endsWith('one')) return words.slice(0, -3) + 'first';
    if (words.endsWith('two')) return words.slice(0, -3) + 'second';
    if (words.endsWith('three')) return words.slice(0, -5) + 'third';
    if (words.endsWith('five')) return words.slice(0, -4) + 'fifth';
    if (words.endsWith('eight')) return words.slice(0, -5) + 'eighth';
    if (words.endsWith('nine')) return words.slice(0, -4) + 'ninth';
    if (words.endsWith('twelve')) return words.slice(0, -6) + 'twelfth';
    if (words.endsWith('ty')) return words.slice(0, -2) + 'tieth';
    return words + 'th';
}

/**
 * Main cleanTextForTTS function.
 * Pre-processes text for TTS vocalization.
 * Returns null if the text contains boilerplate and should be skipped.
 */
function cleanTextForTTS(rawText) {
    if (!rawText) return '';
    let t = rawText;

    // --- STEP 0: Safety Check (If human reviewers missed boilerplate, drop string execution context) ---
    const boilerplateRisk = /offering plan|offering terms|equal housing|file no\.|file number|sponsor:/i;
    if (boilerplateRisk.test(t)) {
        return null; // Return null so the caller knows to skip
    }

    // --- STEP 1: Currency Shorthand & Ranges (e.g., $1.275M to $5.995M) ---
    // Handle millions ranges first
    t = t.replace(/\$([0-9.]+)\s*(M|m)\b/g, (match, val) => {
        const numVal = parseFloat(val) * 1000000;
        return convertNumberToWords(numVal) + " dollars";
    });
    // Handle billions
    t = t.replace(/\$([0-9.]+)\s*(B|b)\b/g, (match, val) => {
        const numVal = parseFloat(val) * 1000000000;
        return convertNumberToWords(numVal) + " dollars";
    });
    
    // Handle standard numeric currency figures with commas ($360,000,000)
    t = t.replace(/\$([0-9,]+)(\.[0-9]{2})?/g, (match, val, cents) => {
        const cleanNum = val.replace(/,/g, '');
        let spoken = convertNumberToWords(cleanNum) + " dollars";
        if (cents) {
            const centVal = cents.replace('.', '');
            if (parseInt(centVal, 10) > 0) {
                spoken += " and " + convertNumberToWords(centVal) + " cents";
            }
        }
        return spoken;
    });

    // --- STEP 1.5: Pre-process non-currency numbers with commas (e.g. 2,000 sq ft or 2,482) ---
    t = t.replace(/\b\d{1,3}(,\d{3})+(\.\d+)?\b/g, (match) => {
        const cleanNum = match.replace(/,/g, '');
        return convertNumberToWords(cleanNum);
    });

    // --- STEP 1.7: Pre-process standalone decimals (e.g. 1.5 or 2.5) ---
    t = t.replace(/\b\d+\.\d+\b/g, (match) => {
        return convertNumberToWords(match);
    });

    // --- STEP 2: Structural Slashes & Specific Fractions ---
    t = t.replace(/\b(\d+)\s+1\/2\b/g, (m, num) => `${convertNumberToWords(num)} and a half`);
    t = t.replace(/\b1\/2\b/g, 'a half');
    t = t.replace(/\b(\d+)\s+1\/4\b/g, (m, num) => `${convertNumberToWords(num)} and a quarter`);
    t = t.replace(/\b1\/4\b/g, 'a quarter');
    
    // Per Square Foot Suffixes ($741/ft²)
    t = t.replace(/\/(?:ft²|sq\.?\s*ft\b\.?|sqft\b)/gi, ' per square foot');
    
    // Standard sq. ft. abbreviation expansion (when not preceded by a slash)
    t = t.replace(/\b(?:sq\.?\s*ft\b\.?|sqft\b)/gi, 'square feet');

    // --- STEP 3: Dimension Marks (Feet/Inches) ---
    // Normalize smart/curly quotes
    t = t.replace(/’|‘/g, "'").replace(/”|“/g, '"');
    
    // Matches 10'3" or 14'6 format
    t = t.replace(/\b(\d+)'\s*(\d+)(?:"|inches?|inch)?/gi, (match, ft, inch) => {
        return `${convertNumberToWords(ft)} feet ${convertNumberToWords(inch)} inches`;
    });
    
    // Matches standalone foot tags like 21' WIDE or 102' lot
    t = t.replace(/\b(\d+)'/g, (match, ft) => {
        const word = convertNumberToWords(ft);
        const unit = parseInt(ft, 10) === 1 ? 'foot' : 'feet';
        return `${word} ${unit}`;
    });

    // --- STEP 4: System Layout and Noise Redundancy ---
    t = t.replace(/\(\s*DEGREE\s*\)/gi, 'degrees');
    t = t.replace(/—|–/g, ' '); // Strip em/en dashes cleanly

    // --- STEP 5: Context-Aware Address Mapping & Structural Shorthand ---
    t = t.replace(/\bapt\b\.?/gi, 'apartment');
    t = t.replace(/\bapts\b\.?/gi, 'apartments');
    t = t.replace(/\bste\b\.?/gi, 'suite');
    t = t.replace(/\bstes\b\.?/gi, 'suites');
    t = t.replace(/\bblvd\b\.?/gi, 'boulevard');
    t = t.replace(/\bblvds\b\.?/gi, 'boulevards');
    t = t.replace(/\bave\b\.?/gi, 'avenue');
    t = t.replace(/\baves\b\.?/gi, 'avenues');
    t = t.replace(/\bCPW\b/g, 'Central Park West');
    t = t.replace(/\bRSD\b/g, 'Riverside Drive');
    
    // Expand Penthouse configurations cleanly (e.g., PH6A -> Penthouse Six A)
    t = t.replace(/\bPH(\d+)([A-Za-z]?)\b/gi, (m, num, letter) => {
        let spoken = 'Penthouse ' + convertNumberToWords(num);
        if (letter) spoken += ' ' + letter.toUpperCase();
        return spoken;
    });

    // Expand E/W/N/S directions before street names/numbers
    t = t.replace(/\bE\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'East $1');
    t = t.replace(/\bW\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'West $1');
    t = t.replace(/\bN\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'North $1');
    t = t.replace(/\bS\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'South $1');

    // Match Street abbreviations only when tightly bound to digits/orientations
    t = t.replace(/\b(\d+(?:st|nd|rd|th)?)\s+St\.?\b/gi, '$1 Street');

    // --- STEP 6: Standalone Ordinals & Floating Digits ---
    // Target numeric ordinals like 127th, 3rd (must be tightly bound using word boundaries)
    t = t.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (m, num) => ordinalToWords(num));
    
    // Target any remaining lingering single digits or standalone counts (e.g., "3 bedroom")
    t = t.replace(/\b\d+\b/g, (num) => convertNumberToWords(num));

    // --- STEP 7: CSV Clean & Sanitation ---
    t = t.replace(/[,;]/g, ' '); // Drop structural flow punctuation by converting to space
    t = t.replace(/[\t\r\n]+/g, ' '); // Flatten structural formatting breaks
    t = t.replace(/\s+/g, ' ');        // Condense spaces

    return t.trim();
}

module.exports = {
    convertNumberToWords,
    ordinalToWords,
    cleanTextForTTS
};
