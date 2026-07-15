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

    if (year >= 2000 && year <= 2009) {
        if (year === 2000) return 'two thousand';
        return 'two thousand and ' + convertNumberToWords(year % 100);
    }

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
 * Advanced Address House Number Pronunciation helper.
 * Converts 3-digit and 4-digit house numbers into grouped spoken words.
 */
function convertHouseNumber(numStr) {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return numStr;
    if (num < 100 || num > 9999) return convertNumberToWords(numStr);

    if (num >= 100 && num <= 999) {
        const hundreds = Math.floor(num / 100);
        const tens = num % 100;
        if (tens === 0) {
            return convertNumberToWords(hundreds) + ' hundred';
        } else if (tens < 10) {
            return convertNumberToWords(hundreds) + ' oh ' + convertNumberToWords(tens);
        } else {
            return convertNumberToWords(hundreds) + ' ' + convertNumberToWords(tens);
        }
    } else if (num >= 1000 && num <= 9999) {
        const thousands = Math.floor(num / 100);
        const tens = num % 100;
        if (num === 2000) return 'two thousand';
        if (tens === 0) {
            return convertNumberToWords(thousands) + ' hundred';
        } else if (tens < 10) {
            return convertNumberToWords(thousands) + ' oh ' + convertNumberToWords(tens);
        } else {
            return convertNumberToWords(thousands) + ' ' + convertNumberToWords(tens);
        }
    }
    return convertNumberToWords(numStr);
}

/**
 * Helper to convert Street Numbers.
 * Always returns ordinal words.
 * If street number >= 110 and middle digit is not zero (tens digit not zero),
 * we drop "hundred" / "hundred and" in the conversion.
 * Example: "110" -> "one tenth", "120" -> "one twentieth".
 */
function convertStreetNumber(numStr) {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return numStr;
    let words = ordinalToWords(numStr);
    if (num >= 110) {
        const tens = Math.floor((num % 100) / 10);
        if (tens !== 0) {
            words = words.replace(/\bhundred\s*(?:and)?\b/gi, '').replace(/\s+/g, ' ').trim();
        }
    }
    return words;
}

/**
 * Helper to check if a matched text is within a ceiling context (nearby word "ceiling").
 */
function isCeilingContext(text, match, matchIndex) {
    if (matchIndex === -1 || !text) return false;
    const before = text.substring(Math.max(0, matchIndex - 45), matchIndex).toLowerCase();
    const after = text.substring(matchIndex + match.length, Math.min(text.length, matchIndex + match.length + 45)).toLowerCase();
    return before.includes('ceiling') || after.includes('ceiling');
}

/**
 * Helper to format feet-inches dimensions consistently.
 */
function formatDimension(ftStr, inchStr, isCeiling = false) {
    const ftNum = parseInt(ftStr, 10);
    const inchNum = parseInt(inchStr, 10);
    const ftUnit = isCeiling ? 'foot' : (ftNum === 1 ? 'foot' : 'feet');
    const ftWords = convertNumberToWords(ftNum);
    if (inchNum === 0) {
        return `${ftWords} ${ftUnit}`;
    }
    const inchUnit = isCeiling ? 'inch' : (inchNum === 1 ? 'inch' : 'inches');
    const inchWords = convertNumberToWords(inchNum);
    return `${ftWords} ${ftUnit} ${inchWords} ${inchUnit}`;
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

const acronymReplacements = [
    { pattern: /\bSTAR\b/g, replacement: 'Star' },
    { pattern: /\bPILOT\b/g, replacement: 'Pilot' },
    { pattern: /\bLEED\b/g, replacement: 'Leed' },
    { pattern: /\bZIP\b/g, replacement: 'zip' }
];

/**
 * Unified helper that runs the entire cleaning pipeline, recording highlight candidates as tokens.
 */
function cleanTextForTTSWithTokens(rawText) {
    if (!rawText) return { textWithTokens: '', highlights: [] };
    let t = rawText;

    // Safety check: Offering plan/Sponsor disclosures
    const boilerplateRisk = /offering plan|offering terms|equal housing|file no\.|file number|\bsponsor(?:\s*:|\s+is|\s+makes|\s+reverses|\s+available\s+from)/i;
    if (boilerplateRisk.test(t)) {
        return { textWithTokens: null, highlights: [] };
    }

    // Delete everything inside parentheses, including the parentheses
    t = t.replace(/\s*\([^)]*\)/g, '');

    const highlights = [];
    let hlCounter = 0;

    function addHighlight(original, converted) {
        let cleanConverted = converted
            .replace(/\bft\b/gi, 'foot')
            .replace(/\bsf\b/gi, 'square feet');
        const token = `__HL_${hlCounter++}__`;
        highlights.push({ token, original: original.trim(), converted: cleanConverted.trim() });
        return token;
    }

    // Clean zero-width space characters early
    t = t.replace(/\u200b/g, '');

    // Normalize quotes, smart quotes, prime, double prime, and multiplication symbols early
    t = t.replace(/""/g, '"');
    t = t.replace(/’|‘/g, "'").replace(/”|“/g, '"').replace(/′/g, "'").replace(/″/g, '"');
    t = t.replace(/×/g, 'x'); // Standardize multiplication symbol to 'x'
    t = t.replace(/°/g, ' degree'); // Standardize degree symbol to 'degree'
    t = t.replace(/\s*\+\s*[-–]\s*/g, ' more or less ');
    t = t.replace(/\s*\+\s*\/\s*-\s*/g, ' more or less ');
    t = t.replace(/\+/g, ' plus');
    t = t.replace(/\bSHoP\b/g, 'Shop');

    // Strip virtual staging disclaimers
    t = t.replace(/\bPhotos\s+are\s+virtual(?:ly)?\s+staged\.?/gi, '');
    t = t.replace(/\bSome\s+images\s+(?:have\s+been|are)\s+virtually\s+staged\.?/gi, '');
    t = t.replace(/\bPhotos\s+virtually\s+furnished\.?/gi, '');
    t = t.replace(/\bdigitally\s+(?:altered|enhanced)\.?/gi, '');

    // Strip trailing spaces around hyphens in words (e.g., jaw- dropping -> jaw-dropping)
    t = t.replace(/\b([a-zA-Z]+)-\s+(?!and\b)([a-zA-Z]+)\b/g, '$1-$2');

    // Add space after comma if between two letters (e.g. services,a -> services, a)
    t = t.replace(/([a-zA-Z]),([a-zA-Z])/g, '$1, $2');

    // Typo corrections (common merged real estate terms)
    t = t.replace(/\batelephone\b/gi, 'a telephone');
    t = t.replace(/\bawayfrom\b/gi, 'away from');
    t = t.replace(/\bandpermit-ready\b/gi, 'and permit-ready');
    t = t.replace(/\bCentral ParkSightlines\b/gi, 'Central Park Sightlines');
    t = t.replace(/\bPH([A-Z][a-z]+)\b/g, 'PH $1');
    t = t.replace(/\bandriver\b/gi, 'and river');
    t = t.replace(/\bsprawlingnorth\b/gi, 'sprawling north');
    t = t.replace(/\belegantcoffered\b/gi, 'elegant coffered');
    t = t.replace(/\bfurtherthrough\b/gi, 'further through');

    // ==========================================
    // STAGE 2: Heading & Line Break Normalization
    // ==========================================

    // Strip known boilerplate openers
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

    // Strip short Welcome to / Introducing / Presenting (first sentence <= 6 words)
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

    // Remove Title Case heading on its own line (first lines)
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
                const hasBodyLine = lines.slice(1).some(line => line.trim().length > 0 && !isTitleCaseHeading(line));
                if (hasBodyLine) {
                    t = lines.slice(1).join('\n').trim();
                    firstLineChanged = true;
                }
            }
        }
    }

    // Remove inline ALL-CAPS heading only if it is on its own line or followed/contains a pipe symbol '|'
    const allCapsRegex = /^([A-Z0-9'’"“”&|/–,-]+(?![a-z])(?:\s+[A-Z0-9'’"“”&|/–,-]+(?![a-z])){2,})/g;
    const allCapsMatch = t.match(allCapsRegex);
    if (allCapsMatch) {
        const heading = allCapsMatch[0];
        const remaining = t.substring(heading.length);
        const remainingTrimmed = remaining.trim();
        const containsPipe = heading.includes('|') || remainingTrimmed.startsWith('|');
        const isOwnLine = t.slice(heading.length).startsWith('\n') || t.slice(heading.length).startsWith('\r');
        if (containsPipe || isOwnLine) {
            let newText = remainingTrimmed;
            if (newText.startsWith('|')) {
                newText = newText.substring(1).trim();
            }
            t = newText;
        }
    }

    // Standardize ALL-CAPS words to lowercase (except preserved acronyms)
    const preservedAcronyms = new Set([
        'NYC', 'CPW', 'RSD', 'PH', 'AM', 'PM', 'AV', 'TV', 'CCNY', 'FAR', 'HVAC', 'UV', 'AIR',
        'BBL', 'BAM', 'ADA', 'NOI', 'LIRR', 'STAR', 'PILOT', 'LEED', 'ZIP', 'FDR', 'THG', 'IJ', 'LED'
    ]);
    t = t.replace(/\b[A-Z]{2,}\b/g, (match) => {
        if (preservedAcronyms.has(match)) return match;
        return match.toLowerCase();
    });
    t = t.replace(/\b[A-HJ-Z]\b/g, (match) => match.toLowerCase());

    // Handle structural line breaks/bullet points by ensuring sentence punctuation
    t = t.split(/[\r\n]+/)
        .map(line => {
            let l = line.trim();
            if (l.length > 0 && !/[.!?,;:—–]$/.test(l)) {
                l += '.';
            }
            return l;
        })
        .join(' ');

    // ==========================================
    // STAGE 3: Transit, Compass & Abbreviation Collisions (FDR, A/C, Directions)
    // ==========================================

    // Transit line splaying (must run before generic slashes)
    t = t.replace(/\b([a-zA-Z])\/([a-zA-Z])\/([a-zA-Z])\b/gi, (match, p1, p2, p3) => `${p1.toUpperCase()}, ${p2.toUpperCase()}, and ${p3.toUpperCase()}`);
    t = t.replace(/\b([a-zA-Z])\/([a-zA-Z])\b(?=\s+(?:subway|train|line|station|transit)s?\b)/gi, (match, p1, p2) => `${p1.toUpperCase()} and ${p2.toUpperCase()}`);
    t = t.replace(/\b(\d+)\/(\d+)\/(\d+)\/(\d+)\b/g, '$1, $2, $3, and $4');
    t = t.replace(/\b(\d+)\/(\d+)\b(?=\s+(?:subway|train|line|station|transit)s?\b)/gi, '$1 and $2');

    // A/C expansion (must run after transit splaying)
    t = t.replace(/\b(?:A\/C|a\/c)\b/gi, 'air conditioning');
    t = t.replace(/\bAC\b/g, 'air conditioning');

    // Washer and dryer expansions
    t = t.replace(/\b(?:W\/D|w\/d)\b/gi, 'washer and dryer');
    t = t.replace(/\bwasher\/dryer\b/gi, 'washer and dryer');

    // Expand E/W/N/S directions before street names/numbers (avoiding possessive 's or smart 's)
    t = t.replace(/(?<!['’])\bE\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'East $1');
    t = t.replace(/(?<!['’])\bW\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'West $1');
    t = t.replace(/(?<!['’])\bN\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'North $1');
    t = t.replace(/(?<!['’])\bS\.?\s+(\d+(?:st|nd|rd|th)?)\b/gi, 'South $1');

    // Expand circa abbreviation followed by a year (e.g. c.1901 -> circa 1901)
    t = t.replace(/\bca?\.\s*(\d{4})\b/gi, 'circa $1');

    // Standard standalone abbreviations
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

    // Match Street abbreviations only when tightly bound to digits/orientations
    t = t.replace(/\b(\d+(?:st|nd|rd|th)?)\s+St\.?\b/gi, '$1 Street');

    // Expand St. followed by a name to Saint (e.g. St. Moritz -> Saint Moritz)
    t = t.replace(/\bSt\.?\s+([A-Z][a-z]+)\b/g, 'Saint $1');

    // Clean up trailing hyphens on direction words (e.g. north-, south-, east-, and west-facing -> north, south, east, and west-facing)
    t = t.replace(/\b(north|south|east|west)-(?=[,\s]|$)/gi, '$1');

    // ==========================================
    // STAGE 4: Address House Numbers & Bed/Bath Unit Splaying
    // ==========================================

    // Specific BR/BA slash splay (e.g. 2BR/2BA, 3bed/2.5bath)
    t = t.replace(/\b(\d+)\s*(?:BR|br|bed|bedroom)s?\s*[\/-]\s*(\d+(?:\.5)?)\s*(?:BA|ba|bath|bathroom)s?\b/gi, (match, br, ba) => {
        const brWord = convertNumberToWords(br) + ' bedroom';
        let baWord = '';
        if (ba.endsWith('.5')) {
            const baNum = parseInt(ba.split('.')[0], 10);
            baWord = convertNumberToWords(baNum) + ' and a half bath';
        } else {
            baWord = convertNumberToWords(ba) + ' bath';
        }
        const converted = `${brWord}, ${baWord}`;
        return addHighlight(match, converted);
    });

    // Address House Number conversions
    const streetSuffixes = '(?:Street|Avenue|Road|Place|Boulevard|St\\.?|Ave\\.?|Rd\\.?|Pl\\.?|Blvd\\.?|Plaza|Loop|Drive|Dr\\.?)';
    const directions = '(?:East|West|North|South|E\\.?|W\\.?|N\\.?|S\\.?)';

    // Address House Number Ranges (e.g. 159-161 Bleecker Street, 155-157 East 49th Street)
    const addrRangePattern = new RegExp(`\\b(\\d{3,4})\\s*-\\s*(\\d{3,4})\\s+(?:(${directions})\\s+)?(?:(\\d+(?:st|nd|rd|th)?)|([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)*))\\s+(${streetSuffixes})\\b`, 'gi');
    t = t.replace(addrRangePattern, (match, num1, num2, dir, streetNum, streetName, suffix) => {
        const h1 = convertHouseNumber(num1);
        const h2 = convertHouseNumber(num2);
        const d = dir ? dir + ' ' : '';
        let st = '';
        if (streetNum) {
            st = convertStreetNumber(streetNum.replace(/(st|nd|rd|th)$/i, '')) + ' ';
        } else {
            st = streetName + ' ';
        }
        const converted = `${h1} to ${h2} ${d}${st}${suffix}`;
        return addHighlight(match, converted);
    });

    // Numbered Street/Avenue Addresses (e.g. 155 East 49th Street)
    const addrPattern1 = new RegExp(`\\b(\\d{3,4})\\s+(${directions})\\s+(\\d+(?:st|nd|rd|th)?)\\s+(${streetSuffixes})\\b`, 'gi');
    t = t.replace(addrPattern1, (match, houseNum, dir, streetNum, suffix) => {
        const cleanStreet = convertStreetNumber(streetNum.replace(/(st|nd|rd|th)$/i, ''));
        const converted = `${convertHouseNumber(houseNum)} ${dir} ${cleanStreet} ${suffix}`;
        return addHighlight(match, converted);
    });

    // Named Street Addresses with Direction (e.g. 870 West End Avenue)
    const addrPattern2 = new RegExp(`\\b(\\d{3,4})\\s+(${directions})\\s+([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)*)\\s+(${streetSuffixes})\\b`, 'g');
    t = t.replace(addrPattern2, (match, houseNum, dir, streetName, suffix) => {
        const converted = `${convertHouseNumber(houseNum)} ${dir} ${streetName} ${suffix}`;
        return addHighlight(match, converted);
    });

    // Named Street Addresses without Direction (e.g. 1420 York Avenue, 870 United Nations Plaza)
    const addrPattern3 = new RegExp(`\\b(\\d{3,4})\\s+([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)*)\\s+(${streetSuffixes})\\b`, 'g');
    t = t.replace(addrPattern3, (match, houseNum, streetName, suffix) => {
        const converted = `${convertHouseNumber(houseNum)} ${streetName} ${suffix}`;
        return addHighlight(match, converted);
    });

    // Standalone Numbered Streets (e.g. 110th Street, 49th Avenue, 110 Street)
    const streetPattern = new RegExp(`\\b(\\d+)(st|nd|rd|th)?\\s+(${streetSuffixes})\\b`, 'gi');
    t = t.replace(streetPattern, (match, streetNum, ord, suffix) => {
        const converted = `${convertStreetNumber(streetNum)} ${suffix}`;
        return addHighlight(match, converted);
    });

    // Expand Penthouse configurations cleanly (e.g., PH6A -> Penthouse Six A)
    t = t.replace(/\bPH(\d+)([A-Za-z]?)\b/gi, (match, num, letter) => {
        let spoken = 'Penthouse ' + convertNumberToWords(num);
        if (letter) spoken += ' ' + letter.toUpperCase();
        return addHighlight(match, spoken);
    });

    // ==========================================
    // STAGE 5: Dimensions, Fractions & Units (Pre-processing while they are digits)
    // ==========================================

    // A.M. / P.M. / AM/PM -> AM / PM / AM or PM
    t = t.replace(/\bAM\/PM\b/gi, 'AM or PM');
    t = t.replace(/\ba\.m\./gi, 'AM').replace(/\bp\.m\./gi, 'PM');

    // Dimensions "by" replacement on raw digits/symbols (e.g. 51' x 26' -> 51' by 26')
    t = t.replace(/(\d+(?:\.\d+)?(?:\s*['"”]|ft|feet|in|inches)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/g, '$1 by $2');

    // Hyphenated dimension pairs (e.g. 11-6 x 10-0 or 11-6 by 10-0)
    t = t.replace(/\b(\d+)-(\d+)\s*(?:by|[xX×])\s*(\d+)-(\d+)\b/g, (match, ft1, in1, ft2, in2, offset) => {
        const isCeiling = isCeilingContext(t, match, offset);
        const converted = `${formatDimension(ft1, in1, isCeiling)} by ${formatDimension(ft2, in2, isCeiling)}`;
        return addHighlight(match, converted);
    });

    // Standalone hyphenated dimension (e.g. 11-6 feet / 11-6 ceiling)
    t = t.replace(/\b(\d+)-(\d+)\s*(?:feet|foot|ft|wide|long|high|ceiling)\b/gi, (match, ftStr, inchStr, offset) => {
        const isCeiling = match.toLowerCase().includes('ceiling') || isCeilingContext(t, match, offset);
        const converted = formatDimension(ftStr, inchStr, isCeiling);
        return addHighlight(match, converted);
    });

    // Matches feet and inches format: e.g. 16'1" or 16'10"
    t = t.replace(/(\d+(?:\.\d+)?)\s*'\s*(\d+(?:\.\d+)?)(?:"|inches?|inch)?/gi, (match, ft, inch, offset) => {
        const ftNum = parseFloat(ft);
        const inchNum = parseFloat(inch);
        const isCeiling = isCeilingContext(t, match, offset);
        const ftUnit = isCeiling ? 'foot' : (ftNum === 1 ? 'foot' : 'feet');
        const inchUnit = isCeiling ? 'inch' : (inchNum === 1 ? 'inch' : 'inches');
        const ftWords = ft.endsWith('.5') ? `${convertNumberToWords(Math.floor(ftNum))} and a half` : convertNumberToWords(ft);
        const inchWords = inch.endsWith('.5') ? `${convertNumberToWords(Math.floor(inchNum))} and a half` : convertNumberToWords(inch);
        const converted = `${ftWords} ${ftUnit} ${inchWords} ${inchUnit}`;
        return addHighlight(match, converted);
    });

    // Matches standalone foot tags like 21' WIDE or 102' lot
    t = t.replace(/(\d+(?:\.\d+)?)\s*'/g, (match, ft, offset) => {
        const ftNum = parseFloat(ft);
        const isCeiling = isCeilingContext(t, match, offset);
        const unit = isCeiling ? 'foot' : (ftNum === 1 ? 'foot' : 'feet');
        let converted = '';
        if (ft.endsWith('.5')) {
            const baseWords = convertNumberToWords(Math.floor(ftNum));
            converted = `${baseWords} ${unit} six inches`;
        } else {
            converted = `${convertNumberToWords(ft)} ${unit}`;
        }
        return addHighlight(match, converted);
    });

    // Matches standalone inch tags like 48" range
    t = t.replace(/(\d+(?:\.\d+)?)\s*"/g, (match, inch, offset) => {
        const inchNum = parseFloat(inch);
        const isCeiling = isCeilingContext(t, match, offset);
        const unit = isCeiling ? 'inch' : (inchNum === 1 ? 'inch' : 'inches');
        let converted = '';
        if (inch.endsWith('.5')) {
            const baseWords = convertNumberToWords(Math.floor(inchNum));
            converted = `${baseWords} and a half inches`;
        } else {
            converted = `${convertNumberToWords(inch)} ${unit}`;
        }
        return addHighlight(match, converted);
    });

    // Unit-aware square feet expansion
    t = t.replace(/\b([0-9]+(?:\s+[0-9]+)*|([0-9,.]+))\s*(?:-|–)?\s*(sf|sq\.?\s*ft\b\.?|sqft\b|square\s*feet|Squareft)\b/gi, (match, num, p2, unit) => {
        const cleanNum = num.replace(/[\s,]+/g, '');
        const converted = convertNumberToWords(cleanNum) + ' square feet';
        return addHighlight(match, converted);
    });

    // Per Square Foot Suffixes ($741/ft²)
    t = t.replace(/\/(?:ft²|sq\.?\s*ft\b\.?|sqft\b)/gi, (match) => {
        return addHighlight(match, ' per square foot');
    });

    // Standard sq. ft. abbreviation expansion (when not preceded by a slash)
    t = t.replace(/\b(?:sq\.?\s*ft\b\.?|sqft\b)/gi, (match) => {
        return addHighlight(match, 'square feet');
    });

    // Sq -> Square (done late to avoid breaking sq.ft. matches)
    t = t.replace(/\bSq\b/g, 'Square').replace(/\bsq\b/g, 'square');

    // FT -> Feet (done late to avoid breaking ft matches)
    t = t.replace(/\bFT\b/g, 'foot').replace(/\bft\b/g, 'foot');

    // Specific Fractions
    t = t.replace(/\b(\d+)\s+1\/2\b/g, (match, num) => {
        return addHighlight(match, `${convertNumberToWords(num)} and a half`);
    });
    t = t.replace(/\b1\/2\b/g, (match) => addHighlight(match, 'a half'));
    t = t.replace(/\b(\d+)\s+1\/4\b/g, (match, num) => {
        return addHighlight(match, `${convertNumberToWords(num)} and a quarter`);
    });
    t = t.replace(/\b1\/4\b/g, (match) => addHighlight(match, 'a quarter'));

    // ==========================================
    // STAGE 6: Phonetic Brand / Designer / Material Dictionary & Preserved Acronyms
    // ==========================================

    // Apply Brand Names & Material Phonetics replacements
    // (Disabled: keeping foreign/proper nouns raw per manual listening feedback)
    for (const bp of []) {
        t = t.replace(bp.pattern, bp.replacement);
    }

    // Apply Acronym letter-by-letter replacements (case-sensitive)
    for (const ar of acronymReplacements) {
        t = t.replace(ar.pattern, ar.replacement);
    }

    // BR / BRs -> bedrooms
    t = t.replace(/\bBRs?\b/g, 'bedrooms').replace(/\bbrs?\b/g, 'bedrooms');

    // Avoid doubling of formal dining room if already followed by FDR abbreviation
    t = t.replace(/\bformal\s+dining\s+room\s*(?:,|\b)\s*\(?\s*FDR\s*\)?/gi, 'formal dining room');

    // FDR -> formal dining room (remaining standalone FDR, protecting FDR Drive)
    t = t.replace(/\bFDR\b(?!\s+Drive\b)/gi, 'formal dining room');

    // NYC -> New York City
    t = t.replace(/\bNYC\b/g, 'New York City');

    // AV -> audio visual
    t = t.replace(/\bAV\b/gi, 'audio visual');

    // Generic CamelCase splitting for remaining merged words
    t = t.replace(/\b([A-Z]?[a-z]+)([A-Z][a-z]+)\b/g, '$1 $2');

    // ==========================================
    // STAGE 7: Standard Number Conversion & Spacing/Punctuation Cleanups
    // ==========================================

    // Convert remaining ampersands to 'and'
    t = t.replace(/\s*&\s*/g, ' and ');

    // Handle millions ranges first, e.g. $1.275M or $1.2M
    t = t.replace(/\$([0-9.]+)\s*(M|m)\b/g, (match, val) => {
        const numVal = parseFloat(val) * 1000000;
        const converted = convertNumberToWords(numVal) + " dollars";
        return addHighlight(match, converted);
    });
    // Handle billions
    t = t.replace(/\$([0-9.]+)\s*(B|b)\b/g, (match, val) => {
        const numVal = parseFloat(val) * 1000000000;
        const converted = convertNumberToWords(numVal) + " dollars";
        return addHighlight(match, converted);
    });

    // Handle standard currency figures
    t = t.replace(/\$([0-9]+(?:,[0-9]+)*)(\.[0-9]{2})?/g, (match, val, cents) => {
        const cleanNum = val.replace(/,/g, '');
        let spoken = convertNumberToWords(cleanNum) + " dollars";
        if (cents) {
            const centVal = cents.replace('.', '');
            if (parseInt(centVal, 10) > 0) {
                spoken += " and " + convertNumberToWords(centVal) + " cents";
            }
        }
        return addHighlight(match, spoken);
    });

    // Convert decimal bathrooms
    t = t.replace(/\b(\d+)\.5\s*(baths?|bathrooms?)\b/gi, (match, num, unit) => {
        const words = convertNumberToWords(num);
        const converted = `${words} and a half ${unit}`;
        return addHighlight(match, converted);
    });

    // Large round numbers
    t = t.replace(/\b\d{1,3}(,\d{3})+(\.\d+)?\b/g, (match) => {
        const cleanNum = match.replace(/,/g, '');
        const valFloat = parseFloat(cleanNum);
        let converted = '';
        if (!isNaN(valFloat) && valFloat >= 1000000 && valFloat % 10000 === 0) {
            const millions = valFloat / 1000000;
            converted = convertNumberToWords(millions) + ' million';
        } else {
            converted = convertNumberToWords(cleanNum);
        }
        return addHighlight(match, converted);
    });

    // Standalone decimals
    t = t.replace(/\b\d+\.\d+\b/g, (match) => {
        const converted = convertNumberToWords(match);
        return addHighlight(match, converted);
    });

    // Decade and plural numbers
    t = t.replace(/\b(\d{2,4})s\b/g, (match, digitStr) => {
        const val = parseInt(digitStr, 10);
        let converted = match;
        if (val === 60) converted = 'sixties';
        else if (val === 70) converted = 'seventies';
        else if (val === 80) converted = 'eighties';
        else if (val === 90) converted = 'nineties';
        else if (val === 20) converted = 'twenties';
        else if (val === 30) converted = 'thirties';
        else if (val === 40) converted = 'forties';
        else if (val === 50) converted = 'fifties';
        else if (val >= 1800 && val <= 2099 && val % 10 === 0) {
            const baseWords = convertYearToWords(val.toString());
            converted = baseWords.replace(/\btwenty\b/g, 'twenties')
                .replace(/\bthirty\b/g, 'thirties')
                .replace(/\bforty\b/g, 'forties')
                .replace(/\bfifty\b/g, 'fifties')
                .replace(/\bsixty\b/g, 'sixties')
                .replace(/\bseventy\b/g, 'seventies')
                .replace(/\beighty\b/g, 'eighties')
                .replace(/\bninety\b/g, 'nineties');
        }
        return addHighlight(match, converted);
    });

    // Standard year translation
    t = t.replace(/\b(18|19|20)\d{2}\b/g, (match) => {
        const converted = convertYearToWords(match);
        return addHighlight(match, converted);
    });

    // Standalone ordinals
    t = t.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (match, num) => {
        const converted = ordinalToWords(num);
        return addHighlight(match, converted);
    });

    // Remaining standalone integers
    t = t.replace(/\b\d+\b/g, (match) => {
        const converted = convertNumberToWords(match);
        return addHighlight(match, converted);
    });

    // Alphanumeric number conversions
    t = t.replace(/\b([Oo]ne)(\d+)([']s)?\b/g, (match, word, num, possessive) => {
        const converted = `${word} ${convertNumberToWords(num)}${possessive || ''}`;
        return addHighlight(match, converted);
    });
    t = t.replace(/([a-zA-Z])(\d+)/g, (match, letter, num) => {
        const converted = `${letter} ${convertNumberToWords(num)}`;
        return addHighlight(match, converted);
    });
    t = t.replace(/(\d+)([a-zA-Z]+)/g, (match, num, letter) => {
        if (/^(?:st|nd|rd|th)$/i.test(letter)) return match;
        const converted = `${convertNumberToWords(num)} ${letter}`;
        return addHighlight(match, converted);
    });

    // Final unit adjustments
    t = t.replace(/\bft\b/g, 'foot');
    t = t.replace(/\bsf\b/g, 'square feet');

    // Clean up slashes between words/numbers
    t = t.replace(/\b([a-zA-Z0-9-]+)\s*\/\s*\b([a-zA-Z0-9-]+)\b/g, '$1 and $2');
    t = t.replace(/\b([a-zA-Z0-9-]+)\s*\/\s*\b([a-zA-Z0-9-]+)\b/g, '$1 and $2');

    // Replace pipe symbols
    t = t.replace(/\s*\|\s*/g, ', ');

    // Clean up multiple periods
    t = t.replace(/\.{2,}/g, '.');

    // Remove commas before 'and'
    t = t.replace(/,\s*and\b/gi, ' and');

    // Clean up duplicate commas
    t = t.replace(/,\s*,/g, ',');

    // Standardize spacing around commas/semicolons
    t = t.replace(/\s*,\s*/g, ', ');
    t = t.replace(/\s*;\s*/g, '; ');

    // Clean up period-comma or comma-period relics
    t = t.replace(/\.,/g, ', ');
    t = t.replace(/,\./g, '.');

    // Ensure space after sentence-ending punctuation
    t = t.replace(/([.!?])([a-zA-Z])/g, (match, punc, letter) => `${punc} ${letter.toUpperCase()}`);

    // Clean up space before sentence-ending punctuation
    t = t.replace(/\s+([.!?])/g, '$1');

    t = t.replace(/[\t\r\n]+/g, ' ');
    t = t.replace(/\s+/g, ' ');

    // Capitalize first letter of each sentence
    t = t.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, char) => prefix + char.toUpperCase());

    return { textWithTokens: t.trim(), highlights };
}

/**
 * Main cleanTextForTTS function.
 * Pre-processes text for TTS vocalization using a 7-stage sequential pipeline.
 * Returns null if the text contains boilerplate and should be skipped.
 */
function cleanTextForTTS(rawText) {
    const { textWithTokens, highlights } = cleanTextForTTSWithTokens(rawText);
    if (textWithTokens === null) return null;
    let plain = textWithTokens;
    // Replace tokens from last to first to handle double-digit token indices correctly if any match nesting happens
    highlights.slice().reverse().forEach(hl => {
        plain = plain.replace(hl.token, hl.converted);
    });
    return plain;
}

/**
 * Main cleanTextForTTSWithHighlight function.
 * Pre-processes text for TTS vocalization and returns HTML-formatted string with highlights.
 */
function cleanTextForTTSWithHighlight(rawText) {
    const { textWithTokens, highlights } = cleanTextForTTSWithTokens(rawText);
    if (textWithTokens === null) return null;
    let html = textWithTokens;
    highlights.slice().reverse().forEach(hl => {
        html = html.replace(hl.token, `<span style="color: #0000ff; font-weight: bold;">${hl.converted} {${hl.original}}</span>`);
    });
    return html;
}

/**
 * Processes, cleans, and truncates raw text, returning both plain and HTML versions.
 */
function cleanAndTruncateTTS(rawText) {
    const { textWithTokens, highlights } = cleanTextForTTSWithTokens(rawText);
    if (textWithTokens === null) {
        return { plain: null, html: null };
    }

    // Build the segments array
    const segments = [];
    let lastIndex = 0;
    const tokenRegex = /__HL_(\d+)__/g;
    let match;
    while ((match = tokenRegex.exec(textWithTokens)) !== null) {
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                content: textWithTokens.substring(lastIndex, match.index)
            });
        }
        const hlIndex = parseInt(match[1], 10);
        segments.push({
            type: 'highlight',
            hl: highlights[hlIndex]
        });
        lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < textWithTokens.length) {
        segments.push({
            type: 'text',
            content: textWithTokens.substring(lastIndex)
        });
    }

    // Construct the full plain text
    const plainText = segments.map(s => s.type === 'text' ? s.content : s.hl.converted).join('');

    // Perform truncation logic on the plain text to find the suffix limit
    let targetTextPlain = '';
    let prefixLength = plainText.length;
    let needsFallbackPeriod = false;

    const words = plainText.split(/\s+/).filter(w => w.length > 0);
    if (words.length <= 150) {
        targetTextPlain = plainText;
        prefixLength = plainText.length;
    } else {
        const windowWords = words.slice(0, 172);
        const windowText = windowWords.join(' ');

        const lastPuncIndex = Math.max(
            windowText.lastIndexOf('.'),
            windowText.lastIndexOf('!'),
            windowText.lastIndexOf('?')
        );

        if (lastPuncIndex !== -1) {
            targetTextPlain = windowText.substring(0, lastPuncIndex + 1).trim();
            const cleanTargetSig = targetTextPlain.replace(/\s+/g, '');
            let plainTextIdx = 0;
            let targetIdx = 0;
            while (plainTextIdx < plainText.length && targetIdx < cleanTargetSig.length) {
                if (plainText[plainTextIdx].replace(/\s/g, '') === cleanTargetSig[targetIdx]) {
                    targetIdx++;
                }
                plainTextIdx++;
            }
            prefixLength = plainTextIdx;
        } else {
            targetTextPlain = words.slice(0, 150).join(' ') + '.';
            const word150 = words.slice(0, 150).join(' ');
            const cleanTargetSig = word150.replace(/\s+/g, '');
            let plainTextIdx = 0;
            let targetIdx = 0;
            while (plainTextIdx < plainText.length && targetIdx < cleanTargetSig.length) {
                if (plainText[plainTextIdx].replace(/\s/g, '') === cleanTargetSig[targetIdx]) {
                    targetIdx++;
                }
                plainTextIdx++;
            }
            prefixLength = plainTextIdx;
            needsFallbackPeriod = true;
        }
    }

    // Slice segments to prefixLength
    const slicedSegments = [];
    let currentLength = 0;
    for (const seg of segments) {
        const segText = seg.type === 'text' ? seg.content : seg.hl.converted;
        if (currentLength + segText.length <= prefixLength) {
            slicedSegments.push(seg);
            currentLength += segText.length;
        } else {
            const remaining = prefixLength - currentLength;
            if (seg.type === 'text') {
                slicedSegments.push({
                    type: 'text',
                    content: seg.content.substring(0, remaining)
                });
            } else {
                slicedSegments.push({
                    type: 'highlight',
                    hl: {
                        original: seg.hl.original,
                        converted: seg.hl.converted.substring(0, remaining)
                    }
                });
            }
            break;
        }
    }

    // If we need a fallback period, append it to the last segment of the sliced HTML/plain
    if (needsFallbackPeriod && slicedSegments.length > 0) {
        const lastSeg = slicedSegments[slicedSegments.length - 1];
        if (lastSeg.type === 'text') {
            lastSeg.content = lastSeg.content.trim() + '.';
        } else {
            slicedSegments.push({ type: 'text', content: '.' });
        }
    }

    // Construct final truncated plain and HTML strings
    const finalPlain = slicedSegments.map(s => s.type === 'text' ? s.content : s.hl.converted).join('').trim();
    const finalHtml = slicedSegments.map(s => {
        if (s.type === 'text') {
            return s.content;
        } else {
            return `<span style="color: #0000ff; font-weight: bold;">${s.hl.converted} {${s.hl.original}}</span>`;
        }
    }).join('').trim();

    return {
        plain: finalPlain,
        html: finalHtml
    };
}

module.exports = {
    convertNumberToWords,
    convertYearToWords,
    convertHouseNumber,
    ordinalToWords,
    cleanTextForTTS,
    cleanTextForTTSWithHighlight,
    cleanAndTruncateTTS
};
