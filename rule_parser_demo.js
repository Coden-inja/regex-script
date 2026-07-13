/**
 * RULE PARSER & REGEX STRATEGY DEMONSTRATION
 * 
 * This file is a demonstration designed to show how different sanitization rules
 * can be written using plain JavaScript (if/else and standard string methods) 
 * versus Regular Expressions (regex).
 * 
 * It highlights what is practical to write without regex, and what is mathematically
 * impossible or highly fragile without it.
 */

// --- RULE 1: REMOVING BOILERPLATE OPENERS ---
// Goal: Strip introductory marketing lines like "Available for immediate occupancy" or "Just listed".
function removeBoilerplateOpeners(text) {
    let t = text.trim();

    // METHOD A: Plain JavaScript (if/else and startsWith)
    // PROS: Extremely readable for a manager.
    // CONS: Doesn't handle variations in punctuation (e.g. "Just Listed!" or "Just listed...").
    if (t.toLowerCase().startsWith("available for immediate occupancy")) {
        t = t.substring(33).trim();
    } else if (t.toLowerCase().startsWith("now available")) {
        t = t.substring(13).trim();
    } else if (t.toLowerCase().startsWith("just listed")) {
        t = t.substring(11).trim();
    } else if (t.toLowerCase().startsWith("price reduced")) {
        t = t.substring(13).trim();
    }

    // METHOD B: Regex Alternative (used in production)
    // PROS: Handles variations in spaces, casing, and punctuation seamlessly in one go.
    // const boilerplateOpeners = [/^\s*Available for immediate occupancy[.,!?]*\s*/i, /^\s*Just Listed[.,!?]*\s*/i];
    // for (const regex of boilerplateOpeners) { t = t.replace(regex, ''); }

    return t;
}


// --- RULE 2: STANDARDIZING ABBREVIATIONS ---
// Goal: Replace real estate abbreviations like "sqft", "sq ft", "sq. ft." with "square feet".
function expandSquareFeet(text) {
    let t = text;

    // METHOD A: Plain JavaScript (if/else and includes/replace)
    // PROS: Simple to read.
    // CONS: Must hardcode every single permutation of spacing, dots, and capitalization.
    const variations = ["sqft", "sq ft", "sq. ft.", "sq.ft.", "s.f.", "sf"];
    for (const v of variations) {
        // We look for the variation and replace it
        while (t.toLowerCase().includes(v)) {
            const index = t.toLowerCase().indexOf(v);
            const originalMatch = t.substring(index, index + v.length);
            t = t.replace(originalMatch, "square feet");
        }
    }

    // METHOD B: Regex Alternative (used in production)
    // t = t.replace(/\b(?:sq\.?\s*ft\b\.?|sqft\b)/gi, 'square feet');

    return t;
}


// --- RULE 3: SPLITTING CAMELCASE WORDS ---
// Goal: Split merged words like "intoCentral" -> "into Central", or "PHDesign" -> "PH Design".
function splitCamelCase(text) {
    let t = text;

    // IS IT POSSIBLE WITHOUT REGEX?
    // - Technically yes, but we would have to loop through every single character of the 
    //   entire overview, check if a character is lowercase and the next one is uppercase,
    //   and splice a space between them.
    // - This is highly inefficient and complex in plain JS.
    
    // METHOD A: Plain JS Implementation (Character Loop)
    let result = "";
    for (let i = 0; i < t.length; i++) {
        result += t[i];
        if (i < t.length - 1) {
            const char = t[i];
            const nextChar = t[i + 1];
            // Check if char is lowercase/uppercase letter and nextChar is uppercase letter followed by lowercase
            const isLetter = (c) => /[a-zA-Z]/.test(c);
            const isUpper = (c) => c === c.toUpperCase() && c !== c.toLowerCase();
            const isLower = (c) => c === c.toLowerCase() && c !== c.toUpperCase();

            if (isLetter(char) && isLetter(nextChar) && isLower(char) && isUpper(nextChar)) {
                result += " "; // Insert space
            }
        }
    }
    t = result;

    // METHOD B: Regex Alternative (used in production)
    // PROS: Done in a single line.
    // t = t.replace(/([a-zA-Z])([A-Z][a-z]+)/g, '$1 $2');

    return t;
}


// --- RULE 4: CONVERTING CURRENCY (e.g. $1.2M -> "one point two million dollars") ---
// Goal: Detect price ranges and write them out.
function convertCurrency(text) {
    // =========================================================================
    // IMPOSSIBLE WITHOUT REGEX:
    // How do you write an "if/else" condition for an arbitrary number of digits 
    // starting with "$" and ending with "M" or "B" or commas (e.g., $1.2M, $750,000)?
    // 
    // There are infinite price variations. We cannot write:
    // if (t.includes("$1.2M")) { t = t.replace("$1.2M", "one point two million dollars"); }
    // else if (t.includes("$1.3M")) { ... }
    // 
    // We *must* use pattern matching (regex) to extract the numeric digits, 
    // convert them to words, and reconstruct the text.
    // =========================================================================
    
    // REGEX IMPLEMENTATION (Mandatory):
    // t = t.replace(/\$([0-9.]+)\s*(M|m)\b/g, (match, val) => {
    //     const numVal = parseFloat(val) * 1000000;
    //     return convertNumberToWords(numVal) + " dollars";
    // });

    return text;
}


// --- RULE 5: CONVERTING DIMENSIONS (e.g. 10'3" or 12' x 14') ---
// Goal: Convert foot/inch notation into spoken text.
function convertDimensions(text) {
    // =========================================================================
    // IMPOSSIBLE WITHOUT REGEX:
    // Dimensions like 12'3" or 14' x 15' have infinite combinations.
    // Without regex, detecting that a word contains a single quote (') followed by 
    // digits and a double quote (") requires complex string scanning, splitting, 
    // and manual state-machine tracking.
    // =========================================================================
    
    // REGEX IMPLEMENTATION (Mandatory):
    // t = t.replace(/\b(\d+)'\s*(\d+)(?:"|inches?|inch)?/gi, (match, ft, inch) => {
    //     return `${convertNumberToWords(ft)} feet ${convertNumberToWords(inch)} inches`;
    // });

    return text;
}


// --- RULE 6: ADDRESS HOUSE NUMBERS (e.g. 870 West End Avenue -> "eight seventy") ---
// Goal: Read 3 or 4 digit street numbers like a human would (870 -> "eight seventy", 1420 -> "fourteen twenty").
function convertAddresses(text) {
    // =========================================================================
    // IMPOSSIBLE WITHOUT REGEX:
    // To know that "870" is a house number (and not a bedroom count or size spec), 
    // we must check if it is followed by a direction ("West", "East") or a street name 
    // and a street suffix ("End Avenue", "Street", "Plaza").
    // Doing this with pure string matching requires looking up every word in a dictionary
    // and running complex next-word index checks.
    // =========================================================================
    
    // REGEX IMPLEMENTATION (Mandatory):
    // const streetSuffixes = '(?:Street|Avenue|Road|Place|Boulevard|St\\.?|Ave\\.?|Rd\\.?|Pl\\.?|Blvd\\.?|Plaza|Drive|Dr\\.?)';
    // const directions = '(?:East|West|North|South|E\\.?|W\\.?|N\\.?|S\\.?)';
    // const addrPattern = new RegExp(`\\b(\\d{3,4})\\s+(${directions})\\s+([A-Z][a-zA-Z]+)\\s+(${streetSuffixes})\\b`, 'gi');
    // t = t.replace(addrPattern, (match, houseNum, dir, streetName, suffix) => {
    //     return `${convertHouseNumber(houseNum)} ${dir} ${streetName} ${suffix}`;
    // });

    return text;
}


// --- RULE 7: standALONE NUMBERS & YEARS (e.g. 1932 -> "nineteen thirty two") ---
// Goal: Detect years and ordinal ranks.
function convertYearsAndNumbers(text) {
    // =========================================================================
    // IMPOSSIBLE WITHOUT REGEX:
    // We must find sequence of digits (like "1932" or "2026") and determine if 
    // they represent a calendar year to call `convertYearToWords(year)`.
    // Without regex, checking if a word is entirely numeric and has 4 digits 
    // requires looping over every word, checking if it is an integer, checking 
    // its length, and replacing it.
    // =========================================================================
    
    return text;
}
