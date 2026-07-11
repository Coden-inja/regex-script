const writtenNumber = require('written-number');

/**
 * Custom number to words conversion supporting decimals, hyphens replacement,
 * and automatic conversion of large numbers >= 1,000,000 ending in zeros to millions notation.
 */
function convertNumberToWords(num) {
    if (num === null || num === undefined) return '';
    let nStr = num.toString().trim();
    
    // Check if it's a large round number we can convert to millions (e.g. 3,600,000 -> 3.6 million)
    const valFloat = parseFloat(nStr.replace(/,/g, ''));
    if (!isNaN(valFloat) && valFloat >= 1000000 && valFloat % 10000 === 0) {
        const millions = valFloat / 1000000;
        return convertNumberToWords(millions) + ' million';
    }

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
 * Year to words conversion (e.g. 1932 -> nineteen thirty two, 2026 -> twenty twenty six).
 */
function convertYearToWords(yearStr) {
    const year = parseInt(yearStr, 10);
    if (year < 1800 || year > 2099) return convertNumberToWords(yearStr);
    
    if (year === 2000) return 'two thousand';
    
    const century = Math.floor(year / 100);
    const decade = year % 100;
    
    const centuryWords = convertNumberToWords(century);
    if (decade === 0) {
        return centuryWords + ' hundred';
    } else if (decade < 10) {
        return centuryWords + ' oh ' + convertNumberToWords(decade);
    } else {
        return centuryWords + ' ' + convertNumberToWords(decade);
    }
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
 * Helper to identify if a line qualifies as a Title Case heading.
 */
function isTitleCaseHeading(line) {
    const l = line.trim();
    if (l.length === 0) return false;
    
    // If it contains bedroom/bathroom/size specs (e.g. 3 Beds, 2 Baths or 3 bedrooms), do not strip it
    if (/\b\d+\s*(?:bed|bath|br|ba|sq?\.?\s*ft|sqft|square|room)/i.test(l)) {
        return false;
    }

    const words = l.split(/\s+/)
        .map(w => w.replace(/[^a-zA-Z]/g, ''))
        .filter(w => w.length > 0);
    if (words.length === 0) return false;
    if (words.length > 12) return false;

    const hasSentenceEndingPunc = /[.!?]$/.test(l);
    const capWords = words.filter(w => /^[A-Z]/.test(w));
    const isCapitalized = (capWords.length / words.length) >= 0.5;

    return !hasSentenceEndingPunc && isCapitalized;
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

    // --- PHASE A: Heading & Boilerplate Removal ---
    
    // 0a: Strip known boilerplate openers
    const boilerplateOpeners = [
        /^\s*Available for immediate occupancy[.,!?]*\s*/i,
        /^\s*Now available[.,!?]*\s*/i,
        /^\s*New Price[.,!?]*\s*/i,
        /^\s*Open House(?:\s+[^.\n!?]*)?[.,!?]*\s*/i,
        /^\s*SHOWINGS BY APPOINTMENT(?:\s+ONLY)?[.,!?]*\s*/i,
        /^\s*HUGE REDUCTION[.,!?]*\s*/i,
        /^\s*JUST LISTED[.,!?]*\s*/i,
        /^\s*PRICE REDUCED[.,!?]*\s*/i,
        /^\s*Exclusive Offering[.,!?]*\s*/i
    ];
    let changed = true;
    while (changed) {
        changed = false;
        for (const regex of boilerplateOpeners) {
            if (regex.test(t)) {
                t = t.replace(regex, '');
                changed = true;
            }
        }
    }

    // 0b: Strip short "Welcome to"/"Introducing"/"Presenting" (only if first sentence <= 6 words)
    const firstSentenceMatch = t.match(/^([^.!?\n]|\.(?=\d))+(?:[.!?\n]+)?/);
    if (firstSentenceMatch) {
        const firstSentence = firstSentenceMatch[0];
        const cleanSentence = firstSentence.trim().replace(/[.!?\n]+$/, '');
        const words = cleanSentence.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 0) {
            const firstWord = words[0].toLowerCase();
            const secondWord = words[1] ? words[1].toLowerCase() : '';
            const isWelcomeTo = (firstWord === 'welcome' && secondWord === 'to');
            const isIntroducingOrPresenting = (firstWord === 'introducing' || firstWord === 'presenting');
            if ((isWelcomeTo || isIntroducingOrPresenting) && words.length <= 6) {
                t = t.substring(firstSentenceMatch[0].length).trim();
            }
        }
    }

    // 0c: Remove Title Case heading on its own line
    // line must be <= 12 words, >= 50% capitalized words, no digits, no sentence-ending punctuation
    let firstLineChanged = true;
    while (firstLineChanged) {
        firstLineChanged = false;
        const lines = t.split('\n');
        if (lines.length > 0) {
            const firstLine = lines[0].trim();
            if (firstLine.length === 0) {
                t = lines.slice(1).join('\n').trim();
                firstLineChanged = true;
            } else if (isTitleCaseHeading(firstLine)) {
                // Only strip if there is at least one line following that is NOT a title case heading
                const hasBodyLine = lines.slice(1).some(line => line.trim().length > 0 && !isTitleCaseHeading(line));
                if (hasBodyLine) {
                    t = lines.slice(1).join('\n').trim();
                    firstLineChanged = true;
                }
            }
        }
    }

    // 0d: Remove inline ALL-CAPS heading (allowing common punctuation and pipe symbols)
    // 3+ consecutive ALL-CAPS words at string start, no period between heading and body
    const allCapsRegex = /^([A-Z0-9'’"“”&|/–,-]+(?![a-z])(?:\s+[A-Z0-9'’"“”&|/–,-]+(?![a-z])){2,})/g;
    const allCapsMatch = t.match(allCapsRegex);
    if (allCapsMatch) {
        const heading = allCapsMatch[0];
        const remaining = t.substring(heading.length);
        const remainingTrimmed = remaining.trim();
        if (remainingTrimmed.length > 0 && !remainingTrimmed.startsWith('.')) {
            t = remainingTrimmed;
        }
    }

    // 0e: Standardize ALL-CAPS words to lowercase (except for preserved acronyms)
    const preservedAcronyms = new Set(['NYC', 'CPW', 'RSD', 'PH', 'AM', 'PM', 'AV', 'TV', 'CCNY', 'FAR', 'HVAC', 'UV', 'AIR']);
    t = t.replace(/\b[A-Z]{2,}\b/g, (match) => {
        if (preservedAcronyms.has(match)) return match;
        return match.toLowerCase();
    });
    t = t.replace(/\b[A-HJ-Z]\b/g, (match) => match.toLowerCase());

    // 0f: Handle structural line breaks/bullet points by ensuring sentence punctuation
    t = t.split(/[\r\n]+/)
        .map(line => {
            let l = line.trim();
            if (l.length > 0 && !/[.!?,;:—–]$/.test(l)) {
                l += '.';
            }
            return l;
        })
        .join(' ');

    // --- PHASE B: Early Cleanups & Abbreviation Expansion ---
    // Normalize smart punctuation early (including prime and double prime symbols)
    t = t.replace(/’|‘/g, "'").replace(/”|“/g, '"').replace(/′/g, "'").replace(/″/g, '"');

    // Dimensions "by" replacement on raw digits/symbols (e.g. 51' x 26' -> 51' by 26')
    t = t.replace(/(\d+(?:\s*['"”]|ft|feet|in|inches)?)\s*[xX×]\s*(\d+)/g, '$1 by $2');

    // A.M. / P.M. / AM/PM -> AM / PM / AM or PM
    t = t.replace(/\bAM\/PM\b/gi, 'AM or PM');
    t = t.replace(/\ba\.m\./gi, 'AM').replace(/\bp\.m\./gi, 'PM');
    
    // SF / -SF / S.F. -> square feet / -square feet
    t = t.replace(/(-\s*)?\b(?:SF|S\.F\.)\b/gi, (match, hyphen) => hyphen ? '-square feet' : 'square feet');
    
    // Replace pipe symbols with a comma
    t = t.replace(/\s*\|\s*/g, ', ');

    // Spacing around word-bound hyphens (e.g. jaw- dropping -> jaw-dropping)
    t = t.replace(/\b([a-zA-Z]+)-\s+([a-zA-Z]+)\b/g, '$1-$2');

    // Add space after comma if between two letters (e.g. services,a -> services, a)
    t = t.replace(/([a-zA-Z]),([a-zA-Z])/g, '$1, $2');

    // Expand circa abbreviations followed by a year (e.g. c.1901 -> circa 1901)
    t = t.replace(/\bca?\.\s*(\d{4})\b/gi, 'circa $1');

    // Ensure consistent pronunciation of Miele (e.g. Mee-luh)
    t = t.replace(/\bMiele\b/gi, 'Mee-luh');

    // BR / BRs -> bedrooms
    t = t.replace(/\bBRs?\b/g, 'bedrooms').replace(/\bbrs?\b/g, 'bedrooms');

    // FDR -> formal dining room
    t = t.replace(/\bFDR\b/g, 'formal dining room');

    // SHoP Architects -> S H O P Architects
    t = t.replace(/\bSHoP\b/g, 'S H O P');

    // NYC -> New York City
    t = t.replace(/\bNYC\b/g, 'New York City');

    // AV -> audio visual
    t = t.replace(/\bAV\b/gi, 'audio visual');

    // Common real estate spacing/typo corrections
    t = t.replace(/\batelephone\b/gi, 'a telephone');
    t = t.replace(/\bawayfrom\b/gi, 'away from');
    t = t.replace(/\bandpermit-ready\b/gi, 'and permit-ready');
    t = t.replace(/\bCentral ParkSightlines\b/gi, 'Central Park Sightlines');
    t = t.replace(/\bPH([A-Z][a-z]+)\b/g, 'PH $1');
    t = t.replace(/\bandriver\b/gi, 'and river');
    t = t.replace(/\bsprawlingnorth\b/gi, 'sprawling north');
    t = t.replace(/\belegantcoffered\b/gi, 'elegant coffered');

    // --- PHASE C: Number Conversion ---
    
    // 1. Handle unit-aware numbers first to prevent digit-splitting bugs (e.g. 6,700sf or 4,000SF)
    t = t.replace(/\b([0-9,.]+)\s*(?:-|–)?\s*(sf|sq\.?\s*ft|sqft|square\s*feet|Squareft)\b/gi, (match, num, unit) => {
        const cleanNum = num.replace(/,/g, '');
        return convertNumberToWords(cleanNum) + ' square feet';
    });

    // Handle millions ranges first, e.g. $1.275M or $1.2M
    t = t.replace(/\$([0-9.]+)\s*(M|m)\b/g, (match, val) => {
        const numVal = parseFloat(val) * 1000000;
        return convertNumberToWords(numVal) + " dollars";
    });
    // Handle billions
    t = t.replace(/\$([0-9.]+)\s*(B|b)\b/g, (match, val) => {
        const numVal = parseFloat(val) * 1000000000;
        return convertNumberToWords(numVal) + " dollars";
    });
    
    // Handle standard numeric currency figures with commas ($360,000,000 or $360,000)
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

    // Convert decimal .5 baths to "and a half" (e.g. 4.5 bathrooms -> four and a half bathrooms)
    t = t.replace(/\b(\d+)\.5\s*(baths?|bathrooms?)\b/gi, (match, num, unit) => {
        const words = convertNumberToWords(num);
        return `${words} and a half ${unit}`;
    });

    // Pre-process non-currency numbers with commas (e.g. 2,000 sq ft or 2,482)
    t = t.replace(/\b\d{1,3}(,\d{3})+(\.\d+)?\b/g, (match) => {
        const cleanNum = match.replace(/,/g, '');
        return convertNumberToWords(cleanNum);
    });

    // Pre-process standalone decimals (e.g. 1.5 or 2.5)
    t = t.replace(/\b\d+\.\d+\b/g, (match) => {
        return convertNumberToWords(match);
    });

    // Structural Slashes & Specific Fractions
    t = t.replace(/\b(\d+)\s+1\/2\b/g, (m, num) => `${convertNumberToWords(num)} and a half`);
    t = t.replace(/\b1\/2\b/g, 'a half');
    t = t.replace(/\b(\d+)\s+1\/4\b/g, (m, num) => `${convertNumberToWords(num)} and a quarter`);
    t = t.replace(/\b1\/4\b/g, 'a quarter');
    
    // Per Square Foot Suffixes ($741/ft²)
    t = t.replace(/\/(?:ft²|sq\.?\s*ft\b\.?|sqft\b)/gi, ' per square foot');
    
    // Standard sq. ft. abbreviation expansion (when not preceded by a slash)
    t = t.replace(/\b(?:sq\.?\s*ft\b\.?|sqft\b)/gi, 'square feet');

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

    // --- PHASE D: Address & Layout Expansion ---
    t = t.replace(/\(\s*DEGREE\s*\)/gi, 'degrees');
    t = t.replace(/—|–/g, ' '); // Strip em/en dashes cleanly
    
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

    // Sq -> Square (done late to avoid breaking sq.ft. matches)
    t = t.replace(/\bSq\b/g, 'Square').replace(/\bsq\b/g, 'square');
    
    // FT -> Feet (done late to avoid breaking ft matches)
    t = t.replace(/\bFT\b/g, 'Feet').replace(/\bft\b/g, 'feet');
    
    // Expand Penthouse configurations cleanly (e.g., PH6A -> Penthouse Six A)
    t = t.replace(/\bPH(\d+)([A-Za-z]?)\b/gi, (m, num, letter) => {
        let spoken = 'Penthouse ' + convertNumberToWords(num);
        if (letter) spoken += ' ' + letter.toUpperCase();
        return spoken;
    });

    // Expand E/W/N/S directions before street names/numbers (avoiding possessive 's)
    t = t.replace(/(?<!')\bE\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'East $1');
    t = t.replace(/(?<!')\bW\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'West $1');
    t = t.replace(/(?<!')\bN\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'North $1');
    t = t.replace(/(?<!')\bS\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'South $1');

    // Expand St. followed by a name to Saint (e.g. St. Moritz -> Saint Moritz)
    t = t.replace(/\bSt\.?\s+([A-Z][a-z]+)\b/g, 'Saint $1');

    // Match Street abbreviations only when tightly bound to digits/orientations
    t = t.replace(/\b(\d+(?:st|nd|rd|th)?)\s+St\.?\b/gi, '$1 Street');

    // Clean up trailing hyphens on direction words (e.g. north- south- -> north south)
    t = t.replace(/\b(north|south|east|west)-\s+/gi, '$1 ');

    // Clean up slashes between words/numbers (e.g. room/gallery -> room and gallery, C1-9/R10 -> C1-9 and R10)
    // Note: This runs after fractions are already converted to avoid breaking 1/2 or 1/4.
    t = t.replace(/\b([a-zA-Z0-9-]+)\s*\/\s*\b([a-zA-Z0-9-]+)\b/g, '$1 and $2');

    // Handle alphanumeric number conversions (e.g. One57 -> One fifty seven, R10 -> R ten)
    t = t.replace(/\b([Oo]ne)(\d+)([']s)?\b/g, (m, word, num, possessive) => {
        return `${word} ${convertNumberToWords(num)}${possessive || ''}`;
    });
    t = t.replace(/([a-zA-Z])(\d+)/g, (m, letter, num) => `${letter} ${convertNumberToWords(num)}`);

    // --- STEP 6: Standalone Ordinals & Floating Digits ---
    t = t.replace(/\b(18|19|20)\d{2}\b/g, (match) => convertYearToWords(match));
    t = t.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (m, num) => ordinalToWords(num));
    t = t.replace(/\b\d+\b/g, (num) => convertNumberToWords(num));

    // --- PHASE E: CSV Clean & Sanitation (Step 7) ---
    // Note: Semicolons and commas are PRESERVED for natural TTS pacing and voice pauses.
    t = t.replace(/[\t\r\n]+/g, ' '); // Flatten structural formatting breaks
    t = t.replace(/\s+/g, ' ');        // Condense spaces

    // Capitalize the first letter of each sentence
    t = t.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, char) => prefix + char.toUpperCase());

    return t.trim();
}

module.exports = {
    convertNumberToWords,
    convertYearToWords,
    ordinalToWords,
    cleanTextForTTS
};
