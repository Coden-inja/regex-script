/**
 * Simple text-to-speech cleaning and truncation utility.
 * Uses exact word lookups and basic string replacements without regular expressions.
 */

// 1. Multi-word and exact brand pronunciations
const BRAND_REPLACEMENTS = [
    { target: "SHoP Architects", replacement: "Shop Architects" },
    { target: "Miele", replacement: "Mee-luh" },
    { target: "Gaggenau", replacement: "Gah-guh-now" },
    { target: "Sub-Zero", replacement: "Sub Zero" },
    { target: "SubZero", replacement: "Sub Zero" },
    { target: "Dornbracht", replacement: "Dorn-brakt" },
    { target: "Dorn Bracht", replacement: "Dorn-brakt" },
    { target: "Duravit", replacement: "Doo-ruh-vit" },
    { target: "Toto Neorest", replacement: "To-to Nee-o-rest" },
    { target: "Toto", replacement: "To-to" },
    { target: "Smallbone of Devizes", replacement: "Small-bone of De-vye-ziz" },
    { target: "Smallbone Devizes", replacement: "Small-bone of De-vye-ziz" },
    { target: "Thierry Despont", replacement: "Tee-air-ee Day-pohn" },
    { target: "Molteni&C", replacement: "Mole-tay-nee and C" },
    { target: "Molteni", replacement: "Mole-tay-nee" },
    { target: "Lefroy Brooks", replacement: "Lefroy Brooks" },
    { target: "Lutron", replacement: "Loo-tron" },
    { target: "Jean Nouvel", replacement: "Zhahn Noo-vel" },
    { target: "Anish Kapoor", replacement: "Ah-neesh Kah-poor" },
    { target: "Antonio Lupi", replacement: "An-toe-nee-oh Loo-pee" },
    { target: "DeLemos & Cordes", replacement: "Deh-Lee-mose and Kor-deez" },
    { target: "Onda Argentata", replacement: "Ohn-dah Ar-jen-tah-tah" },
    { target: "Covelano", replacement: "Koe-veh-lah-noe" },
    { target: "MAWD", replacement: "M-A-W-D" },
    { target: "Salvatori", replacement: "Sal-vuh-tor-ee" },
    { target: "Crema d'Orcia", replacement: "Cray-muh Dor-chee-uh" },
    { target: "La Cornue", replacement: "Lah Cor-noo" },
    { target: "CetraRuddy", replacement: "Set-ruh-rud-ee" },
    { target: "Cetraruddy", replacement: "Set-ruh-rud-ee" },
    { target: "Fior di Bosco", replacement: "Fee-or dee Boss-co" },
    { target: "Agglo Ceppo", replacement: "Ahg-lo Chep-o" },
    { target: "Celeste Grigio", replacement: "Che-les-tay Gree-jo" },
    { target: "Pelle Grigio", replacement: "Pell-ay Gree-jo" },
    { target: "L'École des Beaux-Arts", replacement: "L'ay-kole day boh-zahr" },
    { target: "Studio Sofield", replacement: "Studio So-feeld" },
    { target: "P.E. Guerin", replacement: "P E Gair-in" },
    { target: "Bulthaup", replacement: "Boolt-howp" },
    { target: "Crestron", replacement: "Kres-tron" },
    { target: "Rafael Viñoly", replacement: "Rah-fah-el Vin-yoh-lee" },
    { target: "Deborah Berke", replacement: "De-buh-ruh Burk" },
    { target: "Shaun Hergatt", replacement: "Shawn Her-gat" },
    { target: "Les Clefs d'Or", replacement: "Lay Clay Dor" },
    { target: "Olson Kundig", replacement: "Ohl-son Kun-dig" },
    { target: "Savant", replacement: "Sah-vahnt" },
    { target: "Electrolux", replacement: "Ee-lek-tro-lux" },
    { target: "Daikin", replacement: "Dye-kin" },
    { target: "Liebherr", replacement: "Leeb-hehr" },
    { target: "Control4", replacement: "Control Four" },
    { target: "Somfy", replacement: "Sahm-fee" },
    { target: "Phylrich", replacement: "Fil-rich" },
    { target: "Robern", replacement: "Row-burn" },
    { target: "Annabelle Selldorf", replacement: "An-nuh-bel Sel-dorf" },
    { target: "Vica", replacement: "Vee-kuh" },
    { target: "Scavolini", replacement: "Skah-vo-lee-nee" },
    { target: "Clé", replacement: "Clay" },
    { target: "Porcelanosa", replacement: "Por-seh-lah-no-sah" },
    { target: "Thasos", replacement: "Tah-sose" },
    { target: "Arclinea", replacement: "Ark-li-nay-uh" },
    { target: "Thermador", replacement: "Ther-muh-dor" },
    { target: "Lafayette A. Goldstone", replacement: "Lah-fay-et A Gold-stone" },
    { target: "ButterflyMX", replacement: "Butterfly M X" },
    { target: "Blanco", replacement: "Blahn-ko" },
    { target: "Inès Lamunière", replacement: "Ee-nez Lah-mun-yair" },
    { target: "Francois Ier", replacement: "Francois Premier" },
    { target: "Peter Pennoyer", replacement: "Peter Pen-noy-er" },
    { target: "Theodore Prudon", replacement: "Theodore Pru-don" },
    { target: "John McCall", replacement: "John Muh-call" },
    { target: "Bakes & Kropp", replacement: "Bakes and Kropp" },
    { target: "JennAir", replacement: "Jen-Air" },
    { target: "Schindler", replacement: "Shind-ler" },
    { target: "Andrea Miranda", replacement: "And-ray-uh Mih-ran-duh" },
    { target: "Randy Kemper", replacement: "Randy Kem-per" },
    { target: "Anthony Ingrao", replacement: "Anthony In-gray-o" },
    { target: "Nero Marquina", replacement: "Nee-ro Mar-kee-nuh" },
    { target: "Gabellini Sheppard", replacement: "Gah-bel-lee-nee Shep-ard" },
    { target: "Gilles & Boissier", replacement: "Jeel ay Bwah-see-ay" },
    { target: "Gilles et Boissier", replacement: "Jeel ay Bwah-see-ay" },
    { target: "Faena", replacement: "Fah-ay-nuh" },
    { target: "Taj Mahal", replacement: "Tahj Muh-hal" },
    { target: "Hydrosystems", replacement: "Hydro-systems" },
    { target: "Grigio Onyx", replacement: "Gree-jo Onyx" },
    { target: "Kraus Hi-Tech", replacement: "Krow-ss High-Tech" },
    { target: "SO-IL", replacement: "So-Ill" },
    { target: "Lineadecor", replacement: "Lin-ee-uh-decor" },
    { target: "J'adore stone", replacement: "Jah-dor stone" },
    { target: "Caesarstone", replacement: "See-zer-stone" },
    { target: "Santa Marina", replacement: "Santa Muh-ree-nuh" },
    { target: "Buster & Punch", replacement: "Buster and Punch" },
    { target: "Arabescato Antico", replacement: "Ah-ruh-beh-skah-to Ahn-tee-co" },
    { target: "Amuneal", replacement: "Am-u-neel" },
    { target: "Kallista", replacement: "Kuh-lis-tuh" },
    { target: "MasterCool", replacement: "Master Cool" },
    { target: "Wright Fit", replacement: "Wright Fit" },
    { target: "Ubiquiti", replacement: "You-bik-wit-ee" },
    { target: "McIntosh", replacement: "Mak-in-tosh" },
    { target: "Bowers & Wilkins", replacement: "Bowers and Wilkins" },
    { target: "Nolita", replacement: "No-lee-tuh" },
    { target: "Veselka", replacement: "Veh-sel-kuh" },
    { target: "McSorley's", replacement: "Mak-sor-lees" },
    { target: "Richard Ciccarelli", replacement: "Richard Chi-cuh-rel-lee" },
    { target: "Eucalyptus", replacement: "You-cuh-lip-tus" },
    { target: "Neuvellano", replacement: "New-vel-lah-no" },
    { target: "ROTTET Studio", replacement: "Rot-tet Studio" },
    { target: "Rottet Studio", replacement: "Rot-tet Studio" },
    { target: "Grigio Orobico", replacement: "Gree-jo O-ro-bee-co" },
    { target: "Officine Gullo", replacement: "Oh-fee-chee-nay Gool-lo" },
    { target: "Altamarea Group", replacement: "Al-tuh-mah-ray-uh Group" },
    { target: "Melamed Architect", replacement: "Mel-ah-med Architect" },
    { target: "Diller Scofidio + Renfro", replacement: "Diller Sko-fee-dee-o and Ren-fro" },
    { target: "Studio Zuchowicki", replacement: "Studio Zoo-cho-wick-ee" },
    { target: "Maryam Nassir Zadeh", replacement: "Mah-ree-um Nah-seer Zay-deh" },
    { target: "Henrybuilt", replacement: "Henry-built" },
    { target: "Struxure", replacement: "Struk-chur" },
    { target: "Bromic", replacement: "Bro-mik" },
    { target: "Thermory Ash", replacement: "Ther-muh-ree Ash" },
    { target: "Renu Therapy", replacement: "Ree-new Therapy" },
    { target: "RiFRA", replacement: "Ree-frah" },
    { target: "Rifra", replacement: "Ree-frah" },
    { target: "Kamp Studios", replacement: "Kamp Studios" },
    { target: "Sow Haus", replacement: "So House" },
    { target: "Sonance", replacement: "So-nans" },
    { target: "Calacatta Paonazzo", replacement: "Kah-lah-kah-tah Pah-o-naht-so" },
    { target: "La Palestra", replacement: "Lah Palestra" },
    { target: "Michael Aiduss", replacement: "Michael Ay-duss" },
    { target: "Schumacher", replacement: "Shoo-mah-ker" },
    { target: "Chango & Co.", replacement: "Chang-go and Company" },
    { target: "Mike Ingui", replacement: "Mike In-gwee" },
    { target: "AGA Elise", replacement: "Ah-guh Elise" },
    { target: "Ipe", replacement: "Ee-pay" },
    { target: "Beyer Blinder Belle", replacement: "By-er Blinder Bell" },
    { target: "Alexandra Champalimaud", replacement: "Alexandra Sham-pah-lee-moh" },
    { target: "Montclair Danby", replacement: "Mont-clair Dan-bee" },
    { target: "Allmilmo", replacement: "All-mil-moh" },
    { target: "Celador Oyster", replacement: "Sel-uh-dor Oyster" },
    { target: "Pianeta Legno Aformosia", replacement: "Pee-uh-neh-tah Leg-no Ah-for-mo-zee-uh" },
    { target: "Grohe", replacement: "Gro-he" },
    { target: "Andres Escobar", replacement: "Andres Es-co-bar" },
    { target: "Jessie Lookfong", replacement: "Jessie Look-fong" },
    { target: "London Towne House", replacement: "London Towne House" },
    { target: "SHVO", replacement: "Shvo" },
    { target: "Daniel Boulud", replacement: "Daniel Boo-loo" },
    { target: "Boulud Privé", replacement: "Boo-loo Pree-vay" },
    { target: "Marin Architects", replacement: "Marin Architects" },
    { target: "Ellevi", replacement: "El-eh-vee" },
    { target: "Fischer + Makooi Architects", replacement: "Fischer and Muh-koo-ee Architects" },
    { target: "Alpi Wood", replacement: "Al-pee Wood" },
    { target: "Basaltina", replacement: "Bah-sal-tee-nuh" },
    { target: "James Corner Field Operations", replacement: "James Corner Field Operations" },
    { target: "Two Trees", replacement: "Two Trees" },
    { target: "Aran Cucine", replacement: "Ah-rahn Coo-chee-nay" },
    { target: "Printemps", replacement: "Prahn-tahm" },
    { target: "Maison Passerelle", replacement: "Mayson Pah-seh-rel" },
    { target: "Salon Vert", replacement: "Sah-lohn Vair" },
    { target: "Café Jalu", replacement: "Kah-fay Zhah-loo" },
    { target: "Harry Macklowe", replacement: "Harry Mack-low" },
    { target: "Hildreth Meière", replacement: "Hil-dreth Mee-air" },
    { target: "Augsburg oak", replacement: "Awgs-berg oak" },
    { target: "Poliform-Varenna", replacement: "Pol-ee-form Vah-ren-nuh" },
    { target: "Varenna", replacement: "Vah-ren-nuh" },
    { target: "Bavarian Spessart oak", replacement: "Bavarian Shpeh-sart oak" },
    { target: "Caesarstone Pietra Grey", replacement: "See-zer-stone Pee-eh-truh Grey" },
    { target: "Perlado Beige", replacement: "Pair-lah-do Beige" },
    { target: "Azul Grey", replacement: "Ah-zool Grey" },
    { target: "Faber", replacement: "Fay-ber" },
    { target: "Ariston", replacement: "Ah-ris-ton" },
    { target: "Rafael de Cárdenas", replacement: "Rah-fah-el de Car-deh-nahs" },
    { target: "Calacatta Vagli", replacement: "Calacatta Vagli" },
    { target: "Didimon Light", replacement: "Did-ee-mon Light" },
    { target: "Didimon", replacement: "Did-ee-mon Light" },
    { target: "El Ad East 74", replacement: "El Ad East seventy-four" },
    { target: "Siematic", replacement: "See-matic" },
    { target: "SieMatic", replacement: "See-matic" },
    { target: "Compaq", replacement: "Kom-pak" },
    { target: "CL-OTH Interiors", replacement: "Cloth Interiors" },
    { target: "Fulgor Milano", replacement: "Fool-gor Mee-lah-no" },
    { target: "Schiffini", replacement: "Shee-fee-nee" },
    { target: "Neptune Zen", replacement: "Neptune Zen" },
    { target: "Noir St. Laurent", replacement: "Nwahr San Law-rahn" },
    { target: "Agata & Valentina", replacement: "Ah-gah-tah and Val-en-tee-nah" },
    { target: "Rimadesio", replacement: "Ree-mah-day-zyoh" },
    { target: "Valcucine", replacement: "Val-coo-chee-nay" },
    { target: "Neil Denari", replacement: "Neil Deh-nah-ree" },
    { target: "RIVAA Gallery", replacement: "Ree-vah Gallery" },
    { target: "Gronenberg and Leuchtag", replacement: "Grow-nen-berg and Loyk-tag" },
    { target: "LaGuardia Design Group", replacement: "Lah-gward-ee-ah Design Group" },
    { target: "Ceppo Bianco", replacement: "Cheh-poe Bee-ahn-koe" },
    { target: "Dormakaba", replacement: "Dor-mah-kah-bah" },
    { target: "Birley Bakery", replacement: "Bur-lee Bakery" },
    { target: "Le Charlot", replacement: "Luh Shar-low" },
    { target: "Marcel’s", replacement: "Mar-sellz" },
    { target: "Daino Reale", replacement: "Dye-noe Ray-ah-lay" },
    { target: "Ingrao Inc.", replacement: "In-gray-oh Incorporated" },
    { target: "Ornare", replacement: "Or-nah-ray" },
    { target: "Schwartz & Gross", replacement: "Shwartz and Grose" },
    { target: "Lazza", replacement: "Laht-sah" },
    { target: "Reuveni LLC", replacement: "Reh-oo-ven-ee L-L-C" },
    { target: "Hotel des Artistes", replacement: "Hotel dayz Ar-teest" },
    { target: "Sabrina Condominium", replacement: "Suh-bree-nuh Condominium" },
    { target: "Sabrina", replacement: "Suh-bree-nuh Condominium" },
    { target: "Covelano marble", replacement: "Koe-veh-lah-noe marble" },
    { target: "NoHo", replacement: "No-Ho" },
    { target: "HVAC", replacement: "h-vack" },
    { target: "CAT 7", replacement: "Cat seven" },
    { target: "CAT7", replacement: "Cat seven" },
    { target: "1DSQ", replacement: "One Domino Square" },
    { target: "C.P.H. Gilbert", replacement: "C-P-H Gilbert" },
    { target: "CEA Design", replacement: "C-E-A Design" },
    { target: "W/D", replacement: "washer and dryer" },
    { target: "washer/dryer", replacement: "washer and dryer" },
    { target: "closet/dressing", replacement: "closet and dressing" },
    { target: "a/c", replacement: "air conditioning" },
    { target: "live/work", replacement: "live and work" },
    { target: "recreation/play", replacement: "recreation and play" }
];

// 2. Acronym mappings
const ACRONYM_REPLACEMENTS = [
    { target: "BBL", replacement: "B-B-L" },
    { target: "BAM", replacement: "B-A-M" },
    { target: "ADA", replacement: "A-D-A" },
    { target: "NOI", replacement: "N-O-I" },
    { target: "LIRR", replacement: "L-I-R-R" },
    { target: "FAR", replacement: "F-A-R" },
    { target: "STAR", replacement: "Star" },
    { target: "PILOT", replacement: "Pilot" },
    { target: "LEED", replacement: "Leed" },
    { target: "ZIP", replacement: "zip" }
];

// 3. Single-word abbreviations (split-by-space mapping)
const WORD_REPLACEMENTS = {
    "sqft": "square feet",
    "sq": "square",
    "ft": "feet",
    "apt": "apartment",
    "br": "bedrooms",
    "ba": "baths",
    "nyc": "New York City",
    "st": "Street",
    "ave": "Avenue",
    "rd": "Road",
    "dr": "Drive",
    "pl": "Place",
    "w": "West",
    "e": "East",
    "n": "North",
    "s": "South",
    "uv": "U V",
    "mpfp": "M P F P",
    "nys": "New York State",
    "op": "Offering Plan",
    "so-il": "So-Ill",
    "134vap": "One thirty-four V A P",
    "llc": "L L C",
    "av": "audio visual",
    "nyu": "N-Y-U",
    "bia": "B-I-A",
    "dcs": "D-C-S",
    "bbq": "B-B-Q",
    "tv": "T-V",
    "zip": "zip"
};

/**
 * Performs a single-pass case-insensitive replacement of a target string
 * within text. Does not use regular expressions.
 */
function replaceStringCaseInsensitive(text, target, replacement) {
    let result = '';
    let searchIndex = 0;
    const lowerText = text.toLowerCase();
    const lowerTarget = target.toLowerCase();
    
    while (true) {
        const index = lowerText.indexOf(lowerTarget, searchIndex);
        if (index === -1) {
            result += text.substring(searchIndex);
            break;
        }
        result += text.substring(searchIndex, index) + replacement;
        searchIndex = index + target.length;
    }
    return result;
}

/**
 * Standardizes common abbreviation words without using complex pattern matching.
 * @param {string} rawText - The raw listing description.
 * @returns {string} - Cleaned description text.
 */
function cleanText(rawText) {
    if (!rawText) return '';
    let t = rawText;

    // Apply multi-word brand pronunciations
    for (const rule of BRAND_REPLACEMENTS) {
        t = replaceStringCaseInsensitive(t, rule.target, rule.replacement);
    }

    // Apply acronym mappings
    for (const rule of ACRONYM_REPLACEMENTS) {
        t = replaceStringCaseInsensitive(t, rule.target, rule.replacement);
    }

    // Apply single-word abbreviations
    let words = t.split(/\s+/);
    words = words.map(w => {
        const cleanWord = w.toLowerCase().replace(/[,;.]/g, '');
        if (WORD_REPLACEMENTS[cleanWord]) {
            return WORD_REPLACEMENTS[cleanWord];
        }
        return w;
    });
    t = words.join(' ');

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
