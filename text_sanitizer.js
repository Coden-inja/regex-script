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

const brandPhonetics = [
    { pattern: /\bSHoP\s+Architects\b/gi, replacement: 'S H O P Architects' },
    { pattern: /\bMiele\b/gi, replacement: 'Mee-luh' },
    { pattern: /\bGaggenau\b/gi, replacement: 'Gah-guh-now' },
    { pattern: /\bSub-Zero\b/gi, replacement: 'Sub Zero' },
    { pattern: /\bSubZero\b/gi, replacement: 'Sub Zero' },
    { pattern: /\bDornbracht\b/gi, replacement: 'Dorn-brakt' },
    { pattern: /\bDorn\s+Bracht\b/gi, replacement: 'Dorn-brakt' },
    { pattern: /\bDuravit\b/gi, replacement: 'Doo-ruh-vit' },
    { pattern: /\bToto\s+Neorest\b/gi, replacement: 'To-to Nee-o-rest' },
    { pattern: /\bToto\b/gi, replacement: 'To-to' },
    { pattern: /\bSmallbone\s+of\s+Devizes\b/gi, replacement: 'Small-bone of De-vye-ziz' },
    { pattern: /\bSmallbone\s+Devizes\b/gi, replacement: 'Small-bone of De-vye-ziz' },
    { pattern: /\bThierry\s+Despont\b/gi, replacement: 'Tee-air-ee Day-pohn' },
    { pattern: /\bMolteni&C\b/gi, replacement: 'Mole-tay-nee and C' },
    { pattern: /\bMolteni\b/gi, replacement: 'Mole-tay-nee' },
    { pattern: /\bLefroy\s+Brooks\b/gi, replacement: 'Lefroy Brooks' },
    { pattern: /\bLutron\b/gi, replacement: 'Loo-tron' },
    { pattern: /\bJean\s+Nouvel\b/gi, replacement: 'Zhahn Noo-vel' },
    { pattern: /\bAnish\s+Kapoor\b/gi, replacement: 'Ah-neesh Kah-poor' },
    { pattern: /\bAntonio\s+Lupi\b/gi, replacement: 'An-toe-nee-oh Loo-pee' },
    { pattern: /\bDeLemos\s+&\s+Cordes\b/gi, replacement: 'Deh-Lee-mose and Kor-deez' },
    { pattern: /\bOnda\s+Argentata\b/gi, replacement: 'Ohn-dah Ar-jen-tah-tah' },
    { pattern: /\bCovelano\b/gi, replacement: 'Koe-veh-lah-noe' },
    { pattern: /\bMAWD\b/g, replacement: 'M-A-W-D' },
    { pattern: /\bSalvatori\b/gi, replacement: 'Sal-vuh-tor-ee' },
    { pattern: /\bCrema\s+d'Orcia\b/gi, replacement: 'Cray-muh Dor-chee-uh' },
    { pattern: /\bLa\s+Cornue\b/gi, replacement: 'Lah Cor-noo' },
    { pattern: /\bCetra\s*Ruddy\b/gi, replacement: 'Set-ruh-rud-ee' },
    { pattern: /\bFior\s+di\s+Bosco\b/gi, replacement: 'Fee-or dee Boss-co' },
    { pattern: /\bAgglo\s+Ceppo\b/gi, replacement: 'Ahg-lo Chep-o' },
    { pattern: /\bCeleste\s+Grigio\b/gi, replacement: 'Che-les-tay Gree-jo' },
    { pattern: /\bPelle\s+Grigio\b/gi, replacement: 'Pell-ay Gree-jo' },
    { pattern: /\bL'École\s+des\s+Beaux-Arts\b/gi, replacement: "L'ay-kole day boh-zahr" },
    { pattern: /\bStudio\s+Sofield\b/gi, replacement: 'Studio So-feeld' },
    { pattern: /\bP\.E\.\s+Guerin\b/gi, replacement: 'P E Gair-in' },
    { pattern: /\bBulthaup\b/gi, replacement: 'Boolt-howp' },
    { pattern: /\bCrestron\b/gi, replacement: 'Kres-tron' },
    { pattern: /\bRafael\s+Viñoly\b/gi, replacement: 'Rah-fah-el Vin-yoh-lee' },
    { pattern: /\bDeborah\s+Berke\b/gi, replacement: 'De-buh-ruh Burk' },
    { pattern: /\bShaun\s+Hergatt\b/gi, replacement: 'Shawn Her-gat' },
    { pattern: /\bLes\s+Clefs\s+d'Or\b/gi, replacement: 'Lay Clay Dor' },
    { pattern: /\bOlson\s+Kundig\b/gi, replacement: 'Ohl-son Kun-dig' },
    { pattern: /\bSavant\b/gi, replacement: 'Sah-vahnt' },
    { pattern: /\bElectrolux\b/gi, replacement: 'Ee-lek-tro-lux' },
    { pattern: /\bDaikin\b/gi, replacement: 'Dye-kin' },
    { pattern: /\bLiebherr\b/gi, replacement: 'Leeb-hehr' },
    { pattern: /\bControl4\b/gi, replacement: 'Control Four' },
    { pattern: /\bSomfy\b/gi, replacement: 'Sahm-fee' },
    { pattern: /\bPhylrich\b/gi, replacement: 'Fil-rich' },
    { pattern: /\bRobern\b/gi, replacement: 'Row-burn' },
    { pattern: /\bAnnabelle\s+Selldorf\b/gi, replacement: 'An-nuh-bel Sel-dorf' },
    { pattern: /\bVica\b/gi, replacement: 'Vee-kuh' },
    { pattern: /\bScavolini\b/gi, replacement: 'Skah-vo-lee-nee' },
    { pattern: /\bClé\b/gi, replacement: 'Clay' },
    { pattern: /\bPorcelanosa\b/gi, replacement: 'Por-seh-lah-no-sah' },
    { pattern: /\bThasos\b/gi, replacement: 'Tah-sose' },
    { pattern: /\bArclinea\b/gi, replacement: 'Ark-li-nay-uh' },
    { pattern: /\bThermador\b/gi, replacement: 'Ther-muh-dor' },
    { pattern: /\bLafayette\s+A\.\s+Goldstone\b/gi, replacement: 'Lah-fay-et A Gold-stone' },
    { pattern: /\bButterflyMX\b/gi, replacement: 'Butterfly M X' },
    { pattern: /\bBlanco\b/gi, replacement: 'Blahn-ko' },
    { pattern: /\bInès\s+Lamunière\b/gi, replacement: 'Ee-nez Lah-mun-yair' },
    { pattern: /\bFrancois\s+Ier\b/gi, replacement: 'Francois Premier' },
    { pattern: /\bPeter\s+Pennoyer\b/gi, replacement: 'Peter Pen-noy-er' },
    { pattern: /\bTheodore\s+Prudon\b/gi, replacement: 'Theodore Pru-don' },
    { pattern: /\bJohn\s+McCall\b/gi, replacement: 'John Muh-call' },
    { pattern: /\bBakes\s+&\s+Kropp\b/gi, replacement: 'Bakes and Kropp' },
    { pattern: /\bJennAir\b/gi, replacement: 'Jen-Air' },
    { pattern: /\bSchindler\b/gi, replacement: 'Shind-ler' },
    { pattern: /\bAndrea\s+Miranda\b/gi, replacement: 'And-ray-uh Mih-ran-duh' },
    { pattern: /\bRandy\s+Kemper\b/gi, replacement: 'Randy Kem-per' },
    { pattern: /\bAnthony\s+Ingrao\b/gi, replacement: 'Anthony In-gray-o' },
    { pattern: /\bNero\s+Marquina\b/gi, replacement: 'Nee-ro Mar-kee-nuh' },
    { pattern: /\bGabellini\s+Sheppard\b/gi, replacement: 'Gah-bel-lee-nee Shep-ard' },
    { pattern: /\bGilles\s+&\s+Boissier\b/gi, replacement: 'Jeel ay Bwah-see-ay' },
    { pattern: /\bGilles\s+et\s+Boissier\b/gi, replacement: 'Jeel ay Bwah-see-ay' },
    { pattern: /\bFaena\b/gi, replacement: 'Fah-ay-nuh' },
    { pattern: /\bTaj\s+Mahal\b/gi, replacement: 'Tahj Muh-hal' },
    { pattern: /\bHydrosystems\b/gi, replacement: 'Hydro-systems' },
    { pattern: /\bGrigio\s+Onyx\b/gi, replacement: 'Gree-jo Onyx' },
    { pattern: /\bKraus\s+Hi-Tech\b/gi, replacement: 'Krow-ss High-Tech' },
    { pattern: /\bSO-IL\b/gi, replacement: 'So-Ill' },
    { pattern: /\bLineadecor\b/gi, replacement: 'Lin-ee-uh-decor' },
    { pattern: /\bJ'adore\s+stone\b/gi, replacement: 'Jah-dor stone' },
    { pattern: /\bCaesarstone\b/gi, replacement: 'See-zer-stone' },
    { pattern: /\bSanta\s+Marina\b/gi, replacement: 'Santa Muh-ree-nuh' },
    { pattern: /\bBuster\s+&\s+Punch\b/gi, replacement: 'Buster and Punch' },
    { pattern: /\bArabescato\s+Antico\b/gi, replacement: 'Ah-ruh-beh-skah-to Ahn-tee-co' },
    { pattern: /\bAmuneal\b/gi, replacement: 'Am-u-neel' },
    { pattern: /\bKallista\b/gi, replacement: 'Kuh-lis-tuh' },
    { pattern: /\bMasterCool\b/gi, replacement: 'Master Cool' },
    { pattern: /\bWright\s+Fit\b/gi, replacement: 'Wright Fit' },
    { pattern: /\bUbiquiti\b/gi, replacement: 'You-bik-wit-ee' },
    { pattern: /\bMcIntosh\b/gi, replacement: 'Mak-in-tosh' },
    { pattern: /\bBowers\s+&\s+Wilkins\b/gi, replacement: 'Bowers and Wilkins' },
    { pattern: /\bNolita\b/gi, replacement: 'No-lee-tuh' },
    { pattern: /\bVeselka\b/gi, replacement: 'Veh-sel-kuh' },
    { pattern: /\bMcSorley's\b/gi, replacement: 'Mak-sor-lees' },
    { pattern: /\bRichard\s+Ciccarelli\b/gi, replacement: 'Richard Chi-cuh-rel-lee' },
    { pattern: /\bEucalyptus\b/gi, replacement: 'You-cuh-lip-tus' },
    { pattern: /\bNeuvellano\b/gi, replacement: 'New-vel-lah-no' },
    { pattern: /\bROTTET\s+Studio\b/gi, replacement: 'Rot-tet Studio' },
    { pattern: /\bRottet\s+Studio\b/gi, replacement: 'Rot-tet Studio' },
    { pattern: /\bGrigio\s+Orobico\b/gi, replacement: 'Gree-jo O-ro-bee-co' },
    { pattern: /\bOfficine\s+Gullo\b/gi, replacement: 'Oh-fee-chee-nay Gool-lo' },
    { pattern: /\bAltamarea\s+Group\b/gi, replacement: 'Al-tuh-mah-ray-uh Group' },
    { pattern: /\bMelamed\s+Architect\b/gi, replacement: 'Mel-ah-med Architect' },
    { pattern: /\bDiller\s+Scofidio\s+\+\s+Renfro\b/gi, replacement: 'Diller Sko-fee-dee-o and Ren-fro' },
    { pattern: /\bStudio\s+Zuchowicki\b/gi, replacement: 'Studio Zoo-cho-wick-ee' },
    { pattern: /\bMaryam\s+Nassir\s+Zadeh\b/gi, replacement: 'Mah-ree-um Nah-seer Zay-deh' },
    { pattern: /\bHenrybuilt\b/gi, replacement: 'Henry-built' },
    { pattern: /\bStruxure\b/gi, replacement: 'Struk-chur' },
    { pattern: /\bBromic\b/gi, replacement: 'Bro-mik' },
    { pattern: /\bThermory\s+Ash\b/gi, replacement: 'Ther-muh-ree Ash' },
    { pattern: /\bRenu\s+Therapy\b/gi, replacement: 'Ree-new Therapy' },
    { pattern: /\bRiFRA\b/gi, replacement: 'Ree-frah' },
    { pattern: /\bRifra\b/gi, replacement: 'Ree-frah' },
    { pattern: /\bKamp\s+Studios\b/gi, replacement: 'Kamp Studios' },
    { pattern: /\bSow\s+Haus\b/gi, replacement: 'So House' },
    { pattern: /\bSonance\b/gi, replacement: 'So-nans' },
    { pattern: /\bCalacatta\s+Paonazzo\b/gi, replacement: 'Kah-lah-kah-tah Pah-o-naht-so' },
    { pattern: /\bLa\s+Palestra\b/gi, replacement: 'Lah Pah-les-tra' },
    { pattern: /\bMichael\s+Aiduss\b/gi, replacement: 'Michael Ay-duss' },
    { pattern: /\bSchumacher\b/gi, replacement: 'Shoo-mah-ker' },
    { pattern: /\bChango\s+&\s+Co\.\b/gi, replacement: 'Chang-go and Company' },
    { pattern: /\bMike\s+Ingui\b/gi, replacement: 'Mike In-gwee' },
    { pattern: /\bAGA\s+Elise\b/gi, replacement: 'Ah-guh Eh-leez' },
    { pattern: /\bIpe\b/gi, replacement: 'Ee-pay' },
    { pattern: /\bBeyer\s+Blinder\s+Belle\b/gi, replacement: 'By-er Blinder Bell' },
    { pattern: /\bAlexandra\s+Champalimaud\b/gi, replacement: 'Alexandra Sham-pah-lee-moh' },
    { pattern: /\bMontclair\s+Danby\b/gi, replacement: 'Mont-clair Dan-bee' },
    { pattern: /\bAllmilmo\b/gi, replacement: 'All-mil-moh' },
    { pattern: /\bCelador\s+Oyster\b/gi, replacement: 'Sel-uh-dor Oyster' },
    { pattern: /\bPianeta\s+Legno\s+Aformosia\b/gi, replacement: 'Pee-uh-neh-tah Leg-no Ah-for-mo-zee-uh' },
    { pattern: /\bGrohe\b/gi, replacement: 'Gro-he' },
    { pattern: /\bAndres\s+Escobar\b/gi, replacement: 'Andres Es-co-bar' },
    { pattern: /\bJessie\s+Lookfong\b/gi, replacement: 'Jessie Look-fong' },
    { pattern: /\bLondon\s+Towne\s+House\b/gi, replacement: 'London Towne House' },
    { pattern: /\bSHVO\b/gi, replacement: 'Shvo' },
    { pattern: /\bDaniel\s+Boulud\b/gi, replacement: 'Daniel Boo-loo' },
    { pattern: /\bBoulud\s+Privé\b/gi, replacement: 'Boo-loo Pree-vay' },
    { pattern: /\bMarin\s+Architects\b/gi, replacement: 'Marin Architects' },
    { pattern: /\bEllevi\b/gi, replacement: 'El-eh-vee' },
    { pattern: /\bFischer\s+\+\s+Makooi\s+Architects\b/gi, replacement: 'Fischer and Muh-koo-ee Architects' },
    { pattern: /\bAlpi\s+Wood\b/gi, replacement: 'Al-pee Wood' },
    { pattern: /\bBasaltina\b/gi, replacement: 'Bah-sal-tee-nuh' },
    { pattern: /\bJames\s+Corner\s+Field\s+Operations\b/gi, replacement: 'James Corner Field Operations' },
    { pattern: /\bTwo\s+Trees\b/gi, replacement: 'Two Trees' },
    { pattern: /\bAran\s+Cucine\b/gi, replacement: 'Ah-rahn Coo-chee-nay' },
    { pattern: /\bPrintemps\b/gi, replacement: 'Prahn-tahm' },
    { pattern: /\bMaison\s+Passerelle\b/gi, replacement: 'Mayson Pah-seh-rel' },
    { pattern: /\bSalon\s+Vert\b/gi, replacement: 'Sah-lohn Vair' },
    { pattern: /\bCafé\s+Jalu\b/gi, replacement: 'Kah-fay Zhah-loo' },
    { pattern: /\bHarry\s+Macklowe\b/gi, replacement: 'Harry Mack-low' },
    { pattern: /\bHildreth\s+Meière\b/gi, replacement: 'Hil-dreth Mee-air' },
    { pattern: /\bAugsburg\s+oak\b/gi, replacement: 'Awgs-berg oak' },
    { pattern: /\bPoliform-Varenna\b/gi, replacement: 'Pol-ee-form Vah-ren-nuh' },
    { pattern: /\bVarenna\b/gi, replacement: 'Vah-ren-nuh' },
    { pattern: /\bBavarian\s+Spessart\s+oak\b/gi, replacement: 'Bavarian Shpeh-sart oak' },
    { pattern: /\bCaesarstone\s+Pietra\s+Grey\b/gi, replacement: 'See-zer-stone Pee-eh-truh Grey' },
    { pattern: /\bPerlado\s+Beige\b/gi, replacement: 'Pair-lah-do Beige' },
    { pattern: /\bAzul\s+Grey\b/gi, replacement: 'Ah-zool Grey' },
    { pattern: /\bFaber\b/gi, replacement: 'Fay-ber' },
    { pattern: /\bAriston\b/gi, replacement: 'Ah-ris-ton' },
    { pattern: /\bRafael\s+de\s+Cárdenas\b/gi, replacement: 'Rah-fah-el de Car-deh-nahs' },
    { pattern: /\bCalacatta\s+Vagli\b/gi, replacement: 'Kah-lah-kah-tah Val-yee' },
    { pattern: /\bDidimon\s+Light\b/gi, replacement: 'Did-ee-mon Light' },
    { pattern: /\bDidimon\b/gi, replacement: 'Did-ee-mon Light' },
    { pattern: /\bEl\s+Ad\s+East\s+74\b/gi, replacement: 'El Ad East seventy-four' },
    { pattern: /\bSiematic\b/gi, replacement: 'See-matic' },
    { pattern: /\bSieMatic\b/gi, replacement: 'See-matic' },
    { pattern: /\bCompaq\b/gi, replacement: 'Kom-pak' },
    { pattern: /\bCL-OTH\s+Interiors\b/gi, replacement: 'Cloth Interiors' },
    { pattern: /\bFulgor\s+Milano\b/gi, replacement: 'Fool-gor Mee-lah-no' },
    { pattern: /\bSchiffini\b/gi, replacement: 'Shee-fee-nee' },
    { pattern: /\bNeptune\s+Zen\b/gi, replacement: 'Neptune Zen' },
    { pattern: /\bNoir\s+St\.\s+Laurent\b/gi, replacement: 'Nwahr San Law-rahn' },
    { pattern: /\bAgata\s+&\s+Valentina\b/gi, replacement: 'Ah-gah-tah and Val-en-tee-nah' },
    { pattern: /\bRimadesio\b/gi, replacement: 'Ree-mah-day-zyoh' },
    { pattern: /\bValcucine\b/gi, replacement: 'Val-coo-chee-nay' },
    { pattern: /\bNeil\s+Denari\b/gi, replacement: 'Neil Deh-nah-ree' },
    { pattern: /\bRIVAA\s+Gallery\b/gi, replacement: 'Ree-vah Gallery' },
    { pattern: /\bGronenberg\s+and\s+Leuchtag\b/gi, replacement: 'Grow-nen-berg and Loyk-tag' },
    { pattern: /\bLaGuardia\s+Design\s+Group\b/gi, replacement: 'Lah-gward-ee-ah Design Group' },
    { pattern: /\bCeppo\s+Bianco\b/gi, replacement: 'Cheh-poe Bee-ahn-koe' },
    { pattern: /\bDormakaba\b/gi, replacement: 'Dor-mah-kah-bah' },
    { pattern: /\bBirley\s+Bakery\b/gi, replacement: 'Bur-lee Bakery' },
    { pattern: /\bLe\s+Charlot\b/gi, replacement: 'Luh Shar-low' },
    { pattern: /\bMarcel’s\b/gi, replacement: 'Mar-sellz' },
    { pattern: /\bDaino\s+Reale\b/gi, replacement: 'Dye-noe Ray-ah-lay' },
    { pattern: /\bIngrao\s+Inc\.\b/gi, replacement: 'In-gray-oh Incorporated' },
    { pattern: /\bOrnare\b/gi, replacement: 'Or-nah-ray' },
    { pattern: /\bSchwartz\s+&\s+Gross\b/gi, replacement: 'Shwartz and Grose' },
    { pattern: /\bLazza\b/gi, replacement: 'Laht-sah' },
    { pattern: /\bReuveni\s+LLC\b/gi, replacement: 'Reh-oo-ven-ee L-L-C' },
    { pattern: /\bHotel\s+des\s+Artistes\b/gi, replacement: 'Hotel dayz Ar-teest' },
    { pattern: /\bLa\s+Cornue\b/gi, replacement: 'Lah Cor-noo' },
    { pattern: /\bSabrina\s+Condominium\b/gi, replacement: 'Suh-bree-nuh Condominium' },
    { pattern: /\bSabrina\b/gi, replacement: 'Suh-bree-nuh Condominium' },
    { pattern: /\bCovelano\s+marble\b/gi, replacement: 'Koe-veh-lah-noe marble' },
    { pattern: /\bAnish\s+Kapoor\b/gi, replacement: 'Ah-neesh Kah-poor' },
    { pattern: /\bAntonio\s+Lupi\b/gi, replacement: 'An-toe-nee-oh Loo-pee' },
    { pattern: /\bDeLemos\s+&\s+Cordes\b/gi, replacement: 'Deh-Lee-mose and Kor-deez' }
];

const acronymReplacements = [
    { pattern: /\bSTAR\b/g, replacement: 'Star' },
    { pattern: /\bPILOT\b/g, replacement: 'Pilot' },
    { pattern: /\bLEED\b/g, replacement: 'Leed' },
    { pattern: /\bZIP\b/g, replacement: 'zip' }
];

/**
 * Main cleanTextForTTS function.
 * Pre-processes text for TTS vocalization using a 7-stage sequential pipeline.
 * Returns null if the text contains boilerplate and should be skipped.
 */
function cleanTextForTTS(rawText) {
    if (!rawText) return '';
    let t = rawText;

    // ==========================================
    // STAGE 1: Safety Check & Early Normalizations
    // ==========================================
    
    // Safety check: Offering plan/Sponsor disclosures
    const boilerplateRisk = /offering plan|offering terms|equal housing|file no\.|file number|\bsponsor(?:\s*:|\s+is|\s+makes|\s+reverses|\s+available\s+from)/i;
    if (boilerplateRisk.test(t)) {
        return null; // Skip execution context
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
        return `${brWord}, ${baWord}`;
    });

    // Address House Number conversions
    const streetSuffixes = '(?:Street|Avenue|Road|Place|Boulevard|St\\.?|Ave\\.?|Rd\\.?|Pl\\.?|Blvd\\.?|Plaza|Loop|Drive|Dr\\.?)';
    const directions = '(?:East|West|North|South|E\\.?|W\\.?|N\\.?|S\\.?)';
    
    // Numbered Street/Avenue Addresses (e.g. 155 East 49th Street)
    const addrPattern1 = new RegExp(`\\b(\\d{3,4})\\s+(${directions})\\s+(\\d+(?:st|nd|rd|th)?)\\s+(${streetSuffixes})\\b`, 'gi');
    t = t.replace(addrPattern1, (match, houseNum, dir, streetNum, suffix) => {
        return `${convertHouseNumber(houseNum)} ${dir} ${streetNum} ${suffix}`;
    });
    
    // Named Street Addresses with Direction (e.g. 870 West End Avenue)
    const addrPattern2 = new RegExp(`\\b(\\d{3,4})\\s+(${directions})\\s+([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)*)\\s+(${streetSuffixes})\\b`, 'g');
    t = t.replace(addrPattern2, (match, houseNum, dir, streetName, suffix) => {
        return `${convertHouseNumber(houseNum)} ${dir} ${streetName} ${suffix}`;
    });
    
    // Named Street Addresses without Direction (e.g. 1420 York Avenue, 870 United Nations Plaza)
    const addrPattern3 = new RegExp(`\\b(\\d{3,4})\\s+([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)*)\\s+(${streetSuffixes})\\b`, 'g');
    t = t.replace(addrPattern3, (match, houseNum, streetName, suffix) => {
        return `${convertHouseNumber(houseNum)} ${streetName} ${suffix}`;
    });

    // Expand Penthouse configurations cleanly (e.g., PH6A -> Penthouse Six A)
    t = t.replace(/\bPH(\d+)([A-Za-z]?)\b/gi, (m, num, letter) => {
        let spoken = 'Penthouse ' + convertNumberToWords(num);
        if (letter) spoken += ' ' + letter.toUpperCase();
        return spoken;
    });

    // ==========================================
    // STAGE 5: Dimensions, Fractions & Units (Pre-processing while they are digits)
    // ==========================================

    // A.M. / P.M. / AM/PM -> AM / PM / AM or PM
    t = t.replace(/\bAM\/PM\b/gi, 'AM or PM');
    t = t.replace(/\ba\.m\./gi, 'AM').replace(/\bp\.m\./gi, 'PM');

    // Dimensions "by" replacement on raw digits/symbols (e.g. 51' x 26' -> 51' by 26')
    t = t.replace(/(\d+(?:\.\d+)?(?:\s*['"”]|ft|feet|in|inches)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/g, '$1 by $2');

    // Matches feet and inches format: e.g. 16'1" or 16'10"
    t = t.replace(/(\d+(?:\.\d+)?)\s*'\s*(\d+(?:\.\d+)?)(?:"|inches?|inch)?/gi, (match, ft, inch) => {
        const ftNum = parseFloat(ft);
        const inchNum = parseFloat(inch);
        const ftUnit = ftNum === 1 ? 'foot' : 'feet';
        const inchUnit = inchNum === 1 ? 'inch' : 'inches';
        const ftWords = ft.endsWith('.5') ? `${convertNumberToWords(Math.floor(ftNum))} and a half` : convertNumberToWords(ft);
        const inchWords = inch.endsWith('.5') ? `${convertNumberToWords(Math.floor(inchNum))} and a half` : convertNumberToWords(inch);
        return `${ftWords} ${ftUnit} ${inchWords} ${inchUnit}`;
    });

    // Matches standalone foot tags like 21' WIDE or 102' lot
    t = t.replace(/(\d+(?:\.\d+)?)\s*'/g, (match, ft) => {
        const ftNum = parseFloat(ft);
        const unit = ftNum === 1 ? 'foot' : 'feet';
        if (ft.endsWith('.5')) {
            const baseWords = convertNumberToWords(Math.floor(ftNum));
            return `${baseWords} and a half feet`;
        }
        return `${convertNumberToWords(ft)} ${unit}`;
    });

    // Matches standalone inch tags like 48" range
    t = t.replace(/(\d+(?:\.\d+)?)\s*"/g, (match, inch) => {
        const inchNum = parseFloat(inch);
        const unit = inchNum === 1 ? 'inch' : 'inches';
        if (inch.endsWith('.5')) {
            const baseWords = convertNumberToWords(Math.floor(inchNum));
            return `${baseWords} and a half inches`;
        }
        return `${convertNumberToWords(inch)} ${unit}`;
    });

    // Unit-aware square feet expansion
    t = t.replace(/\b([0-9,.]+)\s*(?:-|–)?\s*(sf|sq\.?\s*ft\b\.?|sqft\b|square\s*feet|Squareft)\b/gi, (match, num, unit) => {
        const cleanNum = num.replace(/,/g, '');
        return convertNumberToWords(cleanNum) + ' square feet';
    });

    // Per Square Foot Suffixes ($741/ft²)
    t = t.replace(/\/(?:ft²|sq\.?\s*ft\b\.?|sqft\b)/gi, ' per square foot');

    // Standard sq. ft. abbreviation expansion (when not preceded by a slash)
    t = t.replace(/\b(?:sq\.?\s*ft\b\.?|sqft\b)/gi, 'square feet');

    // Sq -> Square (done late to avoid breaking sq.ft. matches)
    t = t.replace(/\bSq\b/g, 'Square').replace(/\bsq\b/g, 'square');
    
    // FT -> Feet (done late to avoid breaking ft matches)
    t = t.replace(/\bFT\b/g, 'Feet').replace(/\bft\b/g, 'feet');

    // Specific Fractions
    t = t.replace(/\b(\d+)\s+1\/2\b/g, (m, num) => `${convertNumberToWords(num)} and a half`);
    t = t.replace(/\b1\/2\b/g, 'a half');
    t = t.replace(/\b(\d+)\s+1\/4\b/g, (m, num) => `${convertNumberToWords(num)} and a quarter`);
    t = t.replace(/\b1\/4\b/g, 'a quarter');

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

    // Generic CamelCase splitting for remaining merged words (run after brand phonetics to avoid breaking brand names, narrowed to standard patterns)
    t = t.replace(/\b([A-Z]?[a-z]+)([A-Z][a-z]+)\b/g, '$1 $2');

    // ==========================================
    // STAGE 7: Standard Number Conversion & Spacing/Punctuation Cleanups
    // ==========================================

    // Convert remaining ampersands to 'and'
    t = t.replace(/\s*&\s*/g, ' and ');

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
    t = t.replace(/\$([0-9]+(?:,[0-9]+)*)(\.[0-9]{2})?/g, (match, val, cents) => {
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

    // Pre-process large round numbers >= 1,000,000 ending in zeros to millions notation (without currency prefix)
    t = t.replace(/\b\d{1,3}(,\d{3})+(\.\d+)?\b/g, (match) => {
        const cleanNum = match.replace(/,/g, '');
        const valFloat = parseFloat(cleanNum);
        if (!isNaN(valFloat) && valFloat >= 1000000 && valFloat % 10000 === 0) {
            const millions = valFloat / 1000000;
            return convertNumberToWords(millions) + ' million';
        }
        return convertNumberToWords(cleanNum);
    });

    // Pre-process standalone decimals (e.g. 1.5 or 2.5)
    t = t.replace(/\b\d+\.\d+\b/g, (match) => {
        return convertNumberToWords(match);
    });

    // Convert decade and plural numbers (e.g. 60s -> sixties, 1920s -> nineteen twenties)
    t = t.replace(/\b(\d{2,4})s\b/g, (match, digitStr) => {
        const val = parseInt(digitStr, 10);
        if (val === 60) return 'sixties';
        if (val === 70) return 'seventies';
        if (val === 80) return 'eighties';
        if (val === 90) return 'nineties';
        if (val === 20) return 'twenties';
        if (val === 30) return 'thirties';
        if (val === 40) return 'forties';
        if (val === 50) return 'fifties';
        if (val >= 1800 && val <= 2099 && val % 10 === 0) {
            const baseWords = convertYearToWords(val.toString());
            return baseWords.replace(/\btwenty\b/g, 'twenties')
                            .replace(/\bthirty\b/g, 'thirties')
                            .replace(/\bforty\b/g, 'forties')
                            .replace(/\bfifty\b/g, 'fifties')
                            .replace(/\bsixty\b/g, 'sixties')
                            .replace(/\bseventy\b/g, 'seventies')
                            .replace(/\beighty\b/g, 'eighties')
                            .replace(/\bninety\b/g, 'nineties');
        }
        return match;
    });

    // Standard year translation: four-digit numbers from 1800 to 2099
    t = t.replace(/\b(18|19|20)\d{2}\b/g, (match) => convertYearToWords(match));

    // Standalone ordinals (e.g. 3rd -> third)
    t = t.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (m, num) => ordinalToWords(num));

    // Remaining standalone integers
    t = t.replace(/\b\d+\b/g, (num) => convertNumberToWords(num));

    // Handle alphanumeric number conversions (e.g. One57 -> One fifty seven, R10 -> R ten, 71A -> seventy one A)
    t = t.replace(/\b([Oo]ne)(\d+)([']s)?\b/g, (m, word, num, possessive) => {
        return `${word} ${convertNumberToWords(num)}${possessive || ''}`;
    });
    t = t.replace(/([a-zA-Z])(\d+)/g, (m, letter, num) => `${letter} ${convertNumberToWords(num)}`);
    t = t.replace(/(\d+)([a-zA-Z]+)/g, (m, num, letter) => {
        if (/^(?:st|nd|rd|th)$/i.test(letter)) return m;
        return `${convertNumberToWords(num)} ${letter}`;
    });

    // Final unit adjustments for splayed alphanumeric units (e.g. thirty ft -> thirty feet)
    t = t.replace(/\bft\b/g, 'feet');
    t = t.replace(/\bsf\b/g, 'square feet');

    // Clean up slashes between words/numbers (e.g. room/gallery -> room and gallery, C1-9/R10 -> C1-9 and R10)
    t = t.replace(/\b([a-zA-Z0-9-]+)\s*\/\s*\b([a-zA-Z0-9-]+)\b/g, '$1 and $2');
    t = t.replace(/\b([a-zA-Z0-9-]+)\s*\/\s*\b([a-zA-Z0-9-]+)\b/g, '$1 and $2');

    // Replace pipe symbols with a comma to add structural pauses
    t = t.replace(/\s*\|\s*/g, ', ');

    // Clean up multiple periods, e.g. "..." or ".." -> "."
    t = t.replace(/\.{2,}/g, '.');

    // Remove commas before 'and' to prevent double pauses in TTS audio
    t = t.replace(/,\s*and\b/gi, ' and');

    // Clean up duplicate commas, e.g. ",," -> ","
    t = t.replace(/,\s*,/g, ',');

    // Standardize spacing around commas and semicolons (preserve breathing pauses)
    t = t.replace(/\s*,\s*/g, ', ');
    t = t.replace(/\s*;\s*/g, '; ');

    // Clean up period-comma or comma-period relics left by replacements
    t = t.replace(/\.,/g, ', ');
    t = t.replace(/,\./g, '.');

    // Ensure space after sentence-ending punctuation followed by a letter, and capitalize it
    t = t.replace(/([.!?])([a-zA-Z])/g, (match, punc, letter) => `${punc} ${letter.toUpperCase()}`);

    // Clean up space before sentence-ending punctuation
    t = t.replace(/\s+([.!?])/g, '$1');

    t = t.replace(/[\t\r\n]+/g, ' '); // Flatten structural formatting breaks
    t = t.replace(/\s+/g, ' ');        // Condense spaces

    // Capitalize the first letter of each sentence
    t = t.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, char) => prefix + char.toUpperCase());

    return t.trim();
}

module.exports = {
    convertNumberToWords,
    convertYearToWords,
    convertHouseNumber,
    ordinalToWords,
    cleanTextForTTS
};
