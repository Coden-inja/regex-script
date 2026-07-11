# Manual Observations from all_overviews.csv

This document tracks raw real estate description terminology, brand names, abbreviations, and formatting anomalies that require special Text-to-Speech (TTS) normalization rules.

---

## Chunk 1: Lines 1 to 800 (Property IDs 1 to 65)

### 1. Acronyms & ALL-CAPS Abbreviations
* **NoHo** (IDs 3, 4, 39, 40): Pronounce as a word "No-Ho".
* **HVAC** (IDs 4, 12, 13): Pronounce as a word "h-vack".
* **BBL** (ID 8): Spelled out letter-by-letter "B-B-L".
* **ZIP** (ID 8): Pronounce as a word "zip".
* **NYC** (IDs 10, 47, 759): Spelled out letter-by-letter "N-Y-C" (or expanded to "New York City").
* **AB Concept** (IDs 10, 58): Pronounce letter-by-letter for letters "A-B Concept".
* **E. 70th St.** (ID 105): "E." should expand to "East" and "St." to "Street".
* **SHoP Architects** (IDs 12, 186): Pronounce as a word "Shop Architects".
* **P.E. Guerin** (ID 12, 180): Pronounce letter-by-letter "P-E Gair-in".
* **UV** (ID 13, 197): Spelled out letter-by-letter "U-V".
* **AV** (ID 13, 197): Spelled out letter-by-letter "A-V" or expanded to "audio visual".
* **LLC** (IDs 39, 498): Spelled out letter-by-letter "L-L-C".
* **NYU** (ID 39, 544): Spelled out letter-by-letter "N-Y-U".
* **CAT 7** (ID 25, 421): Spelled out as "Cat seven".
* **BIA** (ID 23, 345): Spelled out letter-by-letter "B-I-A".
* **1DSQ** (ID 21, 329): Expanded to "One Domino Square".
* **DCS** (ID 23, 339, 343): Spelled out letter-by-letter "D-C-S".
* **BBQ** (ID 23, 339): Spelled out letter-by-letter "B-B-Q" or expanded to "barbecue".
* **TV** (ID 48, 624): Pronounced as "T-V" or expanded to "Trump Village" (in context: "TV 3 and 4").
* **C.P.H. Gilbert** (ID 59, 685): Spelled out letter-by-letter "C-P-H Gilbert".
* **CEA Design** (ID 63, 775): Spelled out letter-by-letter "C-E-A Design".

### 2. Slashes & Conjunctions
* **architect-and** (ID 3, 11): Replace with "architect and".
* **one-and-a-half** (ID 4, 12): Replace with "one and a half".
* **W/D** (IDs 8, 13, 195): Expand to "washer and dryer".
* **washer/dryer** (ID 16, 222): Expand to "washer and dryer".
* **closet/dressing** (ID 13, 193): Expand to "closet and dressing".
* **a/c** or **A/C** (IDs 17, 25, 249): Expand to "air conditioning".
* **wet-over-dry** (IDs 39, 546): Replace with "wet over dry".
* **disappears / collapses** (IDs 23, 339): Replace with "disappears and collapses".
* **live/work** (IDs 64, 794): Replace with "live and work".
* **recreation/play** (IDs 43, 564): Replace with "recreation and play".

### 3. Alphanumeric & Digit-Unit Combinations
* **2-bedroom** / **2-bathroom** (ID 1): Splay hyphens to "two bedroom" / "two bathroom".
* **1-bedroom** (ID 5): Splay hyphen to "one bedroom".
* **7-story** / **4-unit** (ID 7): Splay hyphens to "seven story" / "four unit".
* **2nd** (ID 8): Expand ordinal to "second".
* **24.25'** / **53.08'** (ID 8): Convert to "twenty-four point two-five feet" and "fifty-three point zero-eight feet".
* **51E** (ID 10): Expand to "fifty-one E".
* **14'-6"** (ID 10): Convert to "fourteen feet six inches".
* **30'** / **10'** (IDs 11, 91, 105): Convert to "thirty feet" / "ten feet".
* **12'6"** / **13'10"** / **11'6"** / **8'2"** / **14'6"** (ID 11): Convert to feet and inches (e.g. "twelve feet six inches", "thirteen feet ten inches").
* **20'x30'** / **22'10"x15'10"** / **28'x10'** (ID 11): Convert dimensions using "by" (e.g. "twenty feet by thirty feet").
* **111W57** (ID 12): Convert to "One eleven West fifty-seven".
* **360deg** / **270deg** (IDs 12, 13): Convert to "three hundred sixty degrees" / "two hundred seventy degrees".
* **11.5'** (ID 13): Convert to "eleven and a half feet" or "eleven point five feet".
* **20A** (ID 16): Convert to "twenty A".
* **29-foot** / **6-inch** (ID 16, 17): Convert to "twenty-nine foot" / "six inch".
* **180-square-foot** (ID 17): Convert to "one hundred eighty square feet".
* **113 North 9th Street** (ID 20): Convert to "One thirteen North ninth Street".
* **2,443-square-foot** (ID 21): Convert to "two thousand four hundred forty-three square foot".
* **PH1C** (ID 21): Convert to "Penthouse one C".
* **10 and a half foot** (ID 21): "ten and a half foot" (keep as is or ensure number conversion).
* **674-square-foot** (ID 21): Convert to "six hundred seventy-four square foot".
* **76 South 2nd Street** / **76 North 8th Street** (IDs 22, 23): Convert ordinals to "second" / "eighth".
* **36-inch** / **665-square-foot** (ID 23): Convert to "thirty-six inch" / "six hundred sixty-five square foot".
* **76 N 8 th St** (ID 23): Convert to "seventy-six North eighth Street".
* **7,750 SF** (ID 24): Convert to "seven thousand seven hundred fifty square feet".
* **6.5 Bathrooms** (ID 24): Convert to "six and a half bathrooms".
* **18-room** / **21-Foot-high** / **12-14-inch-wide** (IDs 25, 411): Convert to "eighteen room" / "twenty-one foot high" / "twelve to fourteen inch wide".
* **48""** (ID 25): Convert to "forty-eight inch".
* **730 Park** (ID 25): Convert to "seven thirty Park".
* **20-story** (ID 25): Convert to "twenty story".
* **50%** / **3%** (ID 25): Convert to "fifty percent" / "three percent".
* **17 x 24** (ID 26): Convert to "seventeen by twenty-four".
* **12-foot-high** (ID 26): Convert to "twelve foot high".
* **1C** (ID 30): Convert to "one C".
* **421-a** (ID 30): Convert to "four twenty-one a".
* **2/5** (ID 30): Convert to "two or five" (subway lines).
* **29'6" by 22'4"** (ID 33): Convert to "twenty-nine feet six inches by twenty-two feet four inches".
* **701 Prospect** (ID 34): Convert to "seven hundred one Prospect".
* **776 sq ft** (ID 34): Convert to "seven hundred seventy-six square feet".
* **7-inch** / **10-foot** (ID 34): Convert to "seven inch" / "ten foot".
* **91 East 31st Street** (ID 35): Convert to "ninety-one East thirty-first Street".
* **18’ x 100’** (ID 35): Convert to "eighteen feet by one hundred feet".
* **2,160 square feet** (ID 35): Convert to "two thousand one hundred sixty square feet".
* **3,960 square feet** / **1,800 square feet** (ID 35): Convert to "three thousand nine hundred sixty square feet" / "one thousand eight hundred square feet".
* **4400** (ID 36): Convert to "forty-four hundred".
* **1.1M** (ID 37): Convert to "one point one million dollars".
* **22-foot** (ID 43): Convert to "twenty-two foot".
* **5-burner** (ID 44): Convert to "five burner".
* **59D** (ID 45): Convert to "fifty-nine D".
* **880 square foot** (ID 45): Convert to "eight hundred eighty square feet".
* **575 feet** (ID 45): Convert to "five hundred seventy-five feet".
* **100,000 square feet** (ID 45): Convert to "one hundred thousand square feet".
* **9’6”** (ID 47): Convert to "nine feet six inches".
* **17.5%** (ID 47): Convert to "seventeen point five percent".
* **125 Perry Street** (ID 51): Convert to "one hundred twenty-five Perry Street".
* **7,700 square feet** / **2,800 square feet** (ID 51): Convert to "seven thousand seven hundred square feet" / "two thousand eight hundred square feet".
* **44-46 Barrow Street** (ID 55): Convert to "forty-four to forty-six Barrow Street".
* **44'** (ID 55): Convert to "forty-four foot".
* **13,000 square foot** / **10,500 square foot** / **2,200 square foot** (ID 55): Convert to "thirteen thousand square feet" / "ten thousand five hundred square feet" / "two thousand two hundred square feet".
* **1122 Madison Avenue** (ID 57): Convert to "eleven twenty-two Madison Avenue".
* **9,678 interior square feet** (ID 58): Convert to "nine thousand six hundred seventy-eight square feet".
* **2,000 sf** (ID 58): Convert to "two thousand square feet".
* **14'6"** (ID 58): Convert to "fourteen feet six inches".
* **15' x 105'** (ID 59): Convert to "fifteen feet by one hundred five feet".
* **14,300 interior square fee** (ID 60): Note spelling typo "square fee" in raw data; convert to "fourteen thousand three hundred square feet".
* **336W23** (ID 64): Convert to "three hundred three-six West twenty-third".
* **20B** (ID 65): Convert to "twenty B".

### 4. Luxury Brand Names & Material Phonetics
* **Sub-Zero** (IDs 7, 9, 10): Pronounce as "Sub Zero".
* **Celeste Grigio** (ID 9): Italian marble. Pronounce as "Che-les-tay Gree-jo".
* **Pelle Grigio** (ID 9): Italian marble. Pronounce as "Pell-ay Gree-jo".
* **Smallbone of Devizes** (IDs 10, 58): Luxury cabinetry. Pronounce as "Small-bone of De-vye-ziz".
* **Miele** (IDs 10, 20, 25, 26): German brand. Pronounce as "Mee-luh".
* **L'École des Beaux-Arts** (ID 11): French. Pronounce as "L'ay-kole day boh-zahr".
* **Thierry Despont** (ID 62): Architect. Pronounce as "Tee-air-ee Day-pohn".
* **Molteni** (ID 62): Italian brand. Pronounce as "Mole-tay-nee".
* **White Macauba** (ID 12): Marble type. Pronounce as "White Mah-cow-bah".
* **Studio Sofield** (IDs 12, 186): Design firm. Pronounce as "Studio So-feeld".
* **Gaggenau** (IDs 12, 13, 25): German appliance brand. Pronounce as "Gah-guh-now".
* **P.E. Guerin** (IDs 12, 180): Hardware brand. Pronounce as "P E Gair-in".
* **Bulthaup** (IDs 13, 63): German kitchen brand. Pronounce as "Boolt-howp".
* **Crestron** (ID 13, 197): Automation. Pronounce as "Kres-tron".
* **Lutron** (IDs 13, 20, 306): Automation. Pronounce as "Loo-tron".
* **Rafael Viñoly** (ID 14, 208): Architect. Pronounce as "Rah-fah-el Vin-yoh-lee".
* **Deborah Berke** (ID 14, 208): Designer. Pronounce as "De-buh-ruh Burk".
* **Shaun Hergatt** (ID 14, 208): Chef. Pronounce as "Shawn Her-gat".
* **Les Clefs d'Or** (ID 14, 208): Concierge association. Pronounce as "Lay Clay Dor".
* **Olson Kundig** (IDs 15, 16, 211): Architecture firm. Pronounce as "Ohl-son Kun-dig".
* **Jackbox** (IDs 15, 16): Olson Kundig design. Pronounce as "Jack-box".
* **Savant** (IDs 17, 25, 231): Automation. Pronounce as "Sah-vahnt".
* **Electrolux** (IDs 17, 255): Appliance brand. Pronounce as "Ee-lek-tro-lux".
* **Daikin** (IDs 18, 290): Japanese brand. Pronounce as "Dye-kin".
* **Liebherr** (IDs 20, 300): German refrigeration brand. Pronounce as "Leeb-hehr".
* **Dornbracht** (IDs 20, 300): German fixtures brand. Pronounce as "Dorn-brakt".
* **Control4** (IDs 20, 306): Automation. Pronounce as "Control Four".
* **Somfy** (IDs 20, 306): Motorized shade brand. Pronounce as "Sahm-fee".
* **Phylrich** (IDs 21, 327): Fixtures brand. Pronounce as "Fil-rich".
* **Robern** (IDs 21, 327): Cabinet brand. Pronounce as "Row-burn".
* **Annabelle Selldorf** (IDs 21, 327): Architect. Pronounce as "An-nuh-bel Sel-dorf".
* **Vica** (IDs 21, 327): Design collection. Pronounce as "Vee-kuh".
* **Scavolini** (IDs 23, 337): Italian cabinetry. Pronounce as "Skah-vo-lee-nee".
* **Clé** (IDs 23, 341): Tile brand. Pronounce as "Clay".
* **Porcelanosa** (IDs 23, 341): Spanish finishes brand. Pronounce as "Por-seh-lah-no-sah".
* **Thasos** (IDs 24, 372): Greek marble. Pronounce as "Tah-sose".
* **Arclinea** (IDs 25, 415): Italian kitchen design brand. Pronounce as "Ark-li-nay-uh".
* **Thermador** (IDs 25, 415): Appliance brand. Pronounce as "Ther-muh-dor".
* **Lafayette A. Goldstone** (IDs 25, 423): Architect. Pronounce as "Lah-fay-et A Gold-stone".
* **ButterflyMX** (IDs 37, 39, 522): Virtual doorman. Pronounce as "Butterfly M X".
* **Blanco** (IDs 39, 538): Sink brand. Pronounce as "Blahn-ko".
* **Inès Lamunière** (IDs 50, 526): Swiss architect. Pronounce as "Ee-nez Lah-mun-yair".
* **Francois Ier** (IDs 59, 685): French style. Pronounce as "Francois Premier".
* **Peter Pennoyer** (IDs 59, 685): Architect. Pronounce as "Peter Pen-noy-er".
* **Theodore Prudon** (IDs 59, 685): Architect. Pronounce as "Theodore Pru-don".
* **John McCall** (IDs 59, 685): Designer. Pronounce as "John Muh-call".
* **Bakes & Kropp** (IDs 60, 724): Cabinetry. Pronounce as "Bakes and Kropp".
* **JennAir** (IDs 60, 724): Brand. Pronounce as "Jen-Air".
* **Schindler** (IDs 60, 712): Elevator brand. Pronounce as "Shind-ler".
* **Andrea Miranda** (IDs 62, 762): Architect. Pronounce as "And-ray-uh Mih-ran-duh".
* **Randy Kemper** (IDs 62, 762): Designer. Pronounce as "Randy Kem-per".
* **Anthony Ingrao** (IDs 62, 762): Designer. Pronounce as "Anthony In-gray-o".
* **Nero Marquina** (IDs 62, 764): Marble. Pronounce as "Nee-ro Mar-kee-nuh".
* **Calacatta** (IDs 62, 764): Marble. Pronounce as "Kah-lah-kah-tah".
* **Gabellini Sheppard** (IDs 63, 773): Design firm. Pronounce as "Gah-bel-lee-nee Shep-ard".
* **Gilles et Boissier** (IDs 63, 773): French firm. Pronounce as "Jeel ay Bwah-see-ay".
* **Faena** (IDs 63, 773): Hotel brand. Pronounce as "Fah-ay-nuh".
* **Taj Mahal** (IDs 63, 777): Quartzite. Pronounce as "Tahj Muh-hal".
* **Hydrosystems** (IDs 63, 777): Brand. Pronounce as "Hydro-systems".
* **Grigio Onyx** (IDs 63, 781): Onyx. Pronounce as "Gree-jo Onyx".
* **Kraus Hi-Tech** (IDs 63, 781): Tech company. Pronounce as "Krow-ss High-Tech".

### 5. Directional Lists & Hyphens
* **south east-facing** (ID 45, 597): Replace with "south-east facing".

### 6. Raw Data Typos
* **Empire Estate Building** (IDs 24, 378): The description mistakenly says "Empire Estate Building" instead of "Empire State Building". We should keep this as it is or let the TTS say "Empire Estate Building".

---

## Chunk 2: Lines 801 to 1600 (Property IDs 66 to 121)

### 1. Acronyms & ALL-CAPS Abbreviations
* **MPFP** (IDs 65, 66, 101): Spelled out letter-by-letter "M-P-F-P".
* **NYS** (IDs 65, 66, 101): Expanded to "New York State".
* **OP** (ID 65): Expanded to "Offering Plan" (or letter-by-letter "O-P").
* **SO-IL** (ID 69): Design firm. Pronounced as a word/name "So-Ill".
* **134VAP LLC** (ID 69): Spelled out as "One thirty-four V-A-P L-L-C".
* **BAM** (ID 72): Spelled out letter-by-letter "B-A-M".
* **LES** (ID 95): Spelled out letter-by-letter "L-E-S".
* **UAP** (ID 96): Spelled out letter-by-letter "U-A-P" (Universal Affordability Preference).
* **LED** (IDs 98, 112): Spelled out letter-by-letter "L-E-D".
* **NJ Caine Architecture** (ID 104): Spelled out letter-by-letter "N-J Caine Architecture".
* **LEED Gold** (ID 109): Pronounced as "Leed Gold" (word, not letter-by-letter).
* **ABC Kitchen** (ID 111): Spelled out letter-by-letter "A-B-C Kitchen".
* **Apartment NGA** (ID 119): Spelled out letter-by-letter "Apartment N-G-A".
* **AUM NY** (ID 120): Spelled out letter-by-letter "A-U-M N-Y".
* **HOK** (ID 121): Spelled out letter-by-letter "H-O-K".

### 2. Slashes & Conjunctions
* **living/dining** (IDs 65, 66, 69): Replace with "living and dining".
* **den/fourth** (ID 65): Replace with "den or fourth".
* **indoor & outdoor** / **indoor/outdoor** (IDs 65, 66, 112, 120): Replace with "indoor and outdoor".
* **recreation & relaxation** (IDs 65, 66): Replace with "recreation and relaxation".
* **two- to four-bedroom** (ID 69): Splay hyphens to "two to four bedroom".
* **recreation/play** (ID 73): Replace with "recreation and play".
* **refrigerator/freezer** (IDs 78, 102, 112): Replace with "refrigerator and freezer".
* **3-4 bedroom/4 bathroom** (ID 86): Expand to "three to four bedroom, four bathroom".
* **live/work** (ID 95): Replace with "live and work".
* **double-tiered** (ID 111): Replace with "double tiered".
* **studio+** (ID 112): Replace with "studio plus".
* **staff/guest** (ID 113): Replace with "staff or guest".

### 3. Alphanumeric & Digit-Unit Combinations
* **10E** / **20B** / **2B** / **3C** / **9F** / **2F** / **3F** / **8A** (IDs 66, 65, 106, 112, 110, 114, 115, 116): Convert unit numbers/letters (e.g., "ten E", "twenty B", "two B", "three C", "nine F").
* **255 SF** / **38,000 SF** / **1,167 SF** / **88 SF** / **1,290 SF** / **11,000 SF** / **713 square feet** (IDs 66, 69, 72): Convert to written numbers (e.g. "two hundred fifty-five square feet").
* **18'** / **60'** / **58'** (IDs 66, 101): Convert to feet (e.g. "eighteen feet", "sixty feet").
* **17th floor** / **10th floor** (IDs 68, 66): Convert ordinals to words.
* **$9,075.07** (ID 68): Convert to "nine thousand seventy-five dollars and seven cents".
* **September 2027** (ID 68): Convert year to "September twenty twenty-seven".
* **2%** (IDs 68, 113): Convert to "two percent".
* **10'4"** (ID 71): Convert to "ten feet four inches".
* **2/3/4/5** (ID 72): Convert to "two, three, four, or five".
* **9’6”** / **9’-3"** (IDs 73, 112): Convert to "nine feet six inches" / "nine feet three inches".
* **17.5%** (IDs 73, 106): Convert to "seventeen point five percent".
* **3rd Quarter 2026** (ID 73): Convert to "third quarter of twenty twenty-six".
* **7,310 sq. ft.** / **1,925 sq. ft.** (ID 77): Convert to written numbers (e.g. "seven thousand three hundred ten square feet").
* **7'-6"** (ID 78): Convert to "seven feet six inches".
* **12mm** (ID 112): Convert to "twelve millimeter".
* **1100SF** (ID 118): Convert to "eleven hundred square feet".
* **200 volts** (ID 118): Convert to "two hundred volts".
* **1930 / 1986** (ID 118): Convert years to "nineteen thirty" and "nineteen eighty-six".

### 4. Luxury Brand Names & Material Phonetics
* **Fior di Bosco** (IDs 65, 66, 72, 101): Italian marble. Pronounce as "Fee-or dee Boss-co".
* **Agglo Ceppo** (IDs 65, 66, 101): Honed stone. Pronounce as "Ahg-lo Chep-o".
* **St. Laurent** (IDs 65, 66): Stone. Pronounce as "Saint Laurent".
* **Olympia** (IDs 65, 66, 101): Building name. Pronounce as "Oh-lim-pee-uh".
* **Workstead** (IDs 65, 66, 101): Design studio. Pronounce as "Work-sted".
* **Jacob Hashimoto** (IDs 65, 66, 82, 101): Artist. Pronounce as "Jacob Hah-shee-mo-to".
* **Harry Cipriani** / **Cipriani's** (ID 68): Italian brand. Pronounce as "Harry Chee-pree-ah-nee".
* **SO-IL** (ID 69): Design firm. Pronounce as "So-Ill".
* **Lineadecor** (ID 69): Brand. Pronounce as "Lin-ee-uh-decor".
* **J'adore stone** (ID 69): French-inspired stone. Pronounce as "Jah-dor stone".
* **Caesarstone** (IDs 72, 73, 77): Brand. Pronounce as "See-zer-stone".
* **Santa Marina** (ID 72): Stone. Pronounce as "Santa Muh-ree-nuh".
* **Duravit** (IDs 73, 93): German brand. Pronounce as "Doo-ruh-vit".
* **Buster & Punch** (ID 77): Brand. Pronounce as "Buster and Punch".
* **Arabescato Antico** (ID 77): Italian marble. Pronounce as "Ah-ruh-beh-skah-to Ahn-tee-co".
* **Amuneal** (ID 77): Shelving brand. Pronounce as "Am-u-neel".
* **Gucci** (ID 77): Italian brand. Pronounce as "Goo-chee".
* **Christopher Peacock** (ID 78): Luxury cabinetry. Pronounce as "Christopher Pea-cock".
* **Lambourne-style** (ID 78): Design style. Pronounce as "Lamb-born style".
* **Kallista** (ID 78): Plumbing brand. Pronounce as "Kuh-lis-tuh".
* **MasterCool** (ID 78): Miele product. Pronounce as "Master Cool".
* **Blanco Dolomiti** (ID 78): Marble. Pronounce as "Blahn-ko Do-lo-mee-tee".
* **Wright Fit** (ID 78): Brand. Pronounce as "Wright Fit".
* **Herzog & de Meuron** (ID 79): Swiss architects. Pronounce as "Hert-sog and de Moy-ron".
* **Ubiquiti** (ID 82): Tech brand. Pronounce as "You-bik-wit-ee".
* **McIntosh** (ID 82): Audio brand. Pronounce as "Mak-in-tosh".
* **Bowers & Wilkins** (ID 82): Audio brand. Pronounce as "Bowers and Wilkins".
* **Nolita** (ID 83): Neighborhood. Pronounce as "No-lee-tuh".
* **Veselka** (ID 85): Ukrainian restaurant. Pronounce as "Veh-sel-kuh".
* **McSorley's** (ID 85): Tavern. Pronounce as "Mak-sor-lees".
* **Richard Ciccarelli** (ID 88): Architect. Pronounce as "Richard Chi-cuh-rel-lee".
* **Eucalyptus** (ID 89): Wood type. Pronounce as "You-cuh-lip-tus".
* **Neuvellano** (ID 89): Stone. Pronounce as "New-vel-lah-no".
* **ROTTET Studio** (ID 89): Design firm. Pronounce as "Rot-tet Studio".
* **Grigio Orobico** (ID 89): Marble. Pronounce as "Gree-jo O-ro-bee-co".
* **Officine Gullo** (ID 90): Italian brand. Pronounce as "Oh-fee-chee-nay Gool-lo".
* **Jean Nouvel** (ID 91): Architect. Pronounce as "Zhahn Noo-vel".
* **Schwinghammer** (ID 91): Lighting brand. Pronounce as "Shwing-ham-er".
* **Altamarea Group** (ID 91): Brand. Pronounce as "Al-tuh-mah-ray-uh Group".
* **Melamed Architect** (IDs 93, 120): Architecture firm. Pronounce as "Mel-ah-med Architect".
* **Diller Scofidio + Renfro** (ID 94): Architects. Pronounce as "Diller Sko-fee-dee-o and Ren-fro".
* **Studio Zuchowicki** (ID 94): Design firm. Pronounce as "Studio Zoo-cho-wick-ee".
* **Maryam Nassir Zadeh** (ID 95): Designer. Pronounce as "Mah-ree-um Nah-seer Zay-deh".
* **Henrybuilt** (ID 97): Cabinetry brand. Pronounce as "Henry-built".
* **Struxure** (ID 98): Pergola brand. Pronounce as "Struk-chur".
* **Bromic** (ID 98): Heater brand. Pronounce as "Bro-mik".
* **Thermory Ash** (ID 98): Wood type. Pronounce as "Ther-muh-ree Ash".
* **Renu Therapy** (ID 98): Brand. Pronounce as "Ree-new Therapy".
* **RiFRA** / **Rifra** (IDs 98, 108, 109): Italian brand. Pronounce as "Ree-frah".
* **Kamp Studios** (ID 98): Design studio. Pronounce as "Kamp Studios".
* **Sow Haus** (ID 98): Design studio. Pronounce as "So House".
* **Sonance** (ID 98): Speaker brand. Pronounce as "So-nans".
* **Calacatta Paonazzo** (ID 98): Marble. Pronounce as "Kah-lah-kah-tah Pah-o-naht-so".
* **La Palestra** (IDs 98, 108, 109): Brand. Pronounce as "Lah Pah-les-tra".
* **Michael Aiduss** (ID 99): Designer. Pronounce as "Michael Ay-duss".
* **Schumacher** (ID 99): Brand. Pronounce as "Shoo-mah-ker".
* **Chango & Co.** (ID 100): Design firm. Pronounce as "Chang-go and Company".
* **Mike Ingui** (ID 102): Architect. Pronounce as "Mike In-gwee".
* **AGA Elise** (ID 102): Cooker brand. Pronounce as "Ah-guh Eh-leez".
* **Ipe** (ID 102): Hardwood. Pronounce as "Ee-pay".
* **Beyer Blinder Belle** (ID 105): Architects. Pronounce as "By-er Blinder Bell".
* **Alexandra Champalimaud** (ID 105): Designer. Pronounce as "Alexandra Sham-pah-lee-moh".
* **Montclair Danby** (ID 105): Marble. Pronounce as "Mont-clair Dan-bee".
* **Allmilmo** (ID 106): Kitchen brand. Pronounce as "All-mil-moh".
* **Celador Oyster** (ID 106): Stone. Pronounce as "Sel-uh-dor Oyster".
* **Pianeta Legno Aformosia** (ID 110): Hardwood brand. Pronounce as "Pee-uh-neh-tah Leg-no Ah-for-mo-zee-uh".
* **Grohe** (ID 112): Brand. Pronounce as "Gro-he".
* **Lutron Caseta** (ID 111): Brand. Pronounce as "Loo-tron Kuh-see-tah".
* **Pieds-a-terre** / **pieds-à-terre** (IDs 113, 114): French. Pronounce as "pee-ay-dah-tair".
* **Salvatori** (ID 118): Italian brand. Pronounce as "Sal-vuh-tor-ee".
* **Ephoca** (ID 118): HVAC brand. Pronounce as "Eh-fo-kuh".
* **Vitsoe** (ID 118): Shelving brand. Pronounce as "Vit-soo".
* **Cosentino-Dekton** (ID 120): Brand. Pronounce as "Co-sen-tee-no Dek-ton".
* **SheltonMindel** (ID 121): Design firm. Pronounce as "Shelton Min-del".

### 5. Directional Lists & Hyphens
* **South- and East-facing** (ID 69): Replace with "South- and East-facing".
* **northeast-facing** / **southwestern** (ID 97): Splay hyphens or pronounce as "northeast facing" / "southwestern".

### 6. Raw Data Typos
* **porte coche`re** (ID 65): Backtick inside the word `coche`re`. Normalize to "porte cochere".
* **libarary** (ID 93): Typo for "library".
* **townnhouse** (ID 117): Typo for "townhouse".
* **23 X 93** / **23 X 54** (ID 84): Uses capital "X" instead of "x" or "by".

---

## Chunk 3: Lines 1601 to 2400 (Property IDs 122 to 195)

### 1. Acronyms & ALL-CAPS Abbreviations
* **AD 100** (ID 122): Pronounce as "A-D one hundred".
* **1BR** (ID 125): Splay as "one bedroom".
* **PATH** / **PATH train** (IDs 124, 155): Pronounce as a word "Path" / "Path train".
* **HOA Fee** (ID 153): Spelled out letter-by-letter "H-O-A Fee".
* **FiDi** (ID 161): Financial District. Pronounce as a word "Fye-Dye".
* **LIRR** (ID 139): Spelled out letter-by-letter "L-I-R-R".
* **GB** (ID 176): Spelled out letter-by-letter "G-B" (stands for Garden B).
* **RET** (ID 192): Spelled out letter-by-letter "R-E-T" (stands for Real Estate Taxes).
* **FAR** (ID 192): Spelled out letter-by-letter "F-A-R" (stands for Floor Area Ratio).
* **PHE** (ID 195): "Penthouse E" (in context: "Presenting Penthouse E").

### 2. Slashes & Conjunctions
* **study/Zoom** (ID 122): Replace with "study or Zoom".
* **condo/elevator** (ID 128): Replace with "condo and elevator".
* **co/op** (ID 125): Normalize to "co-op".
* **living/dining** (IDs 131, 166, 176): Replace with "living and dining".
* **on-suite** (IDs 131, 132): Normalize to "en-suite".
* **1 bedroom/ 1.5 bath** (ID 188): Expand to "one bedroom, one and a half bath".
* **three-and-one-half-bathroom** (ID 195): Replace with "three and a half bathroom".

### 3. Alphanumeric & Digit-Unit Combinations
* **17B** / **4B** / **6C** / **14D** / **2B** / **5R** / **2FG** / **2B** / **4D** / **5B** / **1RSE** / **2B** / **6A** / **2C** (IDs 122, 126, 137, 140, 142, 146, 162, 165, 175, 174, 178, 177, 180, 181): Splay unit characters (e.g. "seventeen B", "four B", "six C").
* **10.5 ft** (ID 125): Convert to "ten and a half feet" or "ten point five feet".
* **140 W69** (ID 125): Convert to "One forty West sixty-ninth".
* **1420 York Avenue** / **155 East 49th Street** / **165 Perry Street** / **167 Sands Street** / **170 East End Avenue** / **170 South 1st Street** / **172 East 4th Street** / **173-175 Bleecker Street** / **176 East 71st Street** / **176 East 77th Street** / **179 East 78th Street** / **201 East 79th Street** / **211 East 3rd Street** / **212 Fifth Avenue** / **220 East 5th street** / **246 East 51st Street** / **25 West 64th Street** / **250 West 96th Street** / **28 West 69th Street** / **263 West End Ave** / **296 West 10th** / **3 Hanover Square** / **3 Sheridan Square** / **300 West 30th Street** / **308 North 7th Street** / **310 West End Avenue** / **32 East 2nd Street** / **321 East 89th Street** / **333 East 79th Street** / **350–354 West 12th Street** / **357 West 29th Street** / **407 East 12th Street** / **435 West 19th Street** / **456 West 19th Street** / **5 Charles Street** / **52 East 4th Street** / **55 Park Avenue** / **555 West 23rd Street** / **622 Greenwich Street** (IDs 126, 131, 133, 134, 135, 136, 137, 138, 140, 141, 142, 145, 146, 147, 148, 153, 154, 156, 157, 158, 160, 161, 162, 164, 165, 169, 170, 171, 173, 174, 176, 178, 181, 184, 186, 189, 190, 191, 193): Convert address numbers (e.g. "fourteen twenty York Avenue", "one fifty-five East forty-ninth Street").
* **2nd Avenue** / **18th Street** / **72nd St** / **14th floor** / **25th-floor** / **27th floor** / **3rd Bedroom** (IDs 126, 123, 152, 140, 144, 145): Convert ordinals to words.
* **13'10"" 11'0"** (ID 142): Missing separator. Splay to "thirteen feet ten inches by eleven feet".
* **7'9"" 7'11"** (ID 142): Splay to "seven feet nine inches by seven feet eleven inches".
* **9ft.1""** (ID 152): Splay to "nine feet one inch".
* **1135”** / **6163’** (ID 192): Normalize curly quotes/apostrophes.
* **2300sf** (ID 193): Convert to "twenty-three hundred square feet".

### 4. Luxury Brand Names & Material Phonetics
* **Lee Mindel** (ID 122): Pronounce as "Lee Min-del".
* **Silver Hill Atelier** (ID 122): Pronounce as "Silver Hill Ah-tell-yay".
* **Nanz hardware** (ID 129): Pronounce as "Nanz hardware".
* **LeFroy Brooks** / **Lefroy Brooks** (IDs 129, 135): Pronounce as "Lefroy Brooks".
* **Richard Meier & Partners** (ID 132): Pronounce as "Richard My-er and Partners".
* **Alexico Group** (ID 132): Pronounce as "Alex-ee-co Group".
* **Peter Marino** (ID 135): Pronounce as "Peter Muh-ree-no".
* **Phillip Jeffries** (ID 135): Pronounce as "Phillip Jeffries".
* **Toto Neorest** (IDs 135, 156): Pronounce as "To-to Nee-o-rest".
* **Modulightor** (ID 135): Pronounce as "Mod-u-light-er".
* **Misi** (ID 136): Pronounce as "Mee-see".
* **L'Industrie** (ID 136): Pronounce as "Lan-doo-stree".
* **Four Horsemen** (ID 136): Pronounce as "Four Horsemen".
* **Equinox** (ID 136): Pronounce as "Ee-kwi-noks".
* **Emtek hardware** (ID 141): Pronounce as "Emtek hardware".
* **Fios** (IDs 141, 175): Pronounce as "Fye-os".
* **Robert A. M. Stern** (ID 143): Pronounce as "Robert A M Stern".
* **Zeckendorf Development** (ID 143): Pronounce as "Zek-in-dorf Development".
* **Armani/Casa** (ID 144): Pronounce as "Ar-mah-nee Kah-sah".
* **Fisher & Paykel** (IDs 144, 169): Pronounce as "Fisher and Paykel".
* **Pembrooke & Ives** (ID 147): Pronounce as "Pembrooke and Ives".
* **David Helpern** (ID 147): Pronounce as "David Hel-pern".
* **Lacava** (ID 147): Pronounce as "Luh-kah-vuh".
* **Il Buco** / **IL Buco** (ID 148): Pronounce as "Eel Boo-co".
* **Alta** (ID 148): Pronounce as "Al-tuh".
* **Emery Roth** (ID 152): Pronounce as "Emery Roth".
* **Bertazzoni** (IDs 155, 169, 187): Pronounce as "Bear-tah-tso-nee".
* **Thomas Juul-Hansen** (ID 156): Pronounce as "Thomas Yool-Han-sen".
* **Asko** (ID 156): Pronounce as "Ah-sko".
* **Paris Forino** (ID 165): Pronounce as "Paris Fo-ree-no" or "Pah-ree Fo-ree-no".
* **Via Carota** (ID 166): Pronounce as "Vee-uh Kuh-ro-tuh".
* **Dante** (ID 166): Pronounce as "Dahn-tay".
* **Bonsignour** (ID 166): Pronounce as "Bahn-seen-yor".
* **Aux Merveilleux de Fred** (ID 166): Pronounce as "Oh Mair-vay-yuh de Fred".
* **Gemma** (ID 170): Pronounce as "Jem-muh".
* **PellOverton Architects** (ID 180): Pronounce as "Pell Overton Architects".
* **Morris Adjmi** (ID 182): Pronounce as "Morris Ahj-mee".
* **Cary Tamarkin** (IDs 184, 185): Pronounce as "Cary Tuh-mar-kin".
* **Studio Mellone** (ID 185): Pronounce as "Studio Meh-lone".
* **Robert Scarano** / **Andre Escobar** (ID 189): Pronounce as "Robert Skah-rah-no" and "Andre Es-co-bar".
* **Hotel Gansevoort** (ID 191): Pronounce as "Hotel Gan-se-vort".

### 5. Directional Lists & Hyphens
* **South- and East-facing** (ID 69): Replace with "South and East-facing".

### 6. Raw Data Typos
* **IL Buco,, Alta** (ID 148): Contains duplicate comma. Normalize to single comma.
* **co/op** (ID 125): Slashed co-op abbreviation. Normalize to "co-op".

---

## Chunk 4: Lines 2401 to 3200 (Property IDs 196 to 244)

### 1. Acronyms & ALL-CAPS Abbreviations
* **DUMBO** / **Dumbo** (IDs 196, 205, 225, 237): Neighborhood. Pronounce as a word "Dumbo".
* **LG** (IDs 204, 224): Spelled out letter-by-letter "L-G".
* **STAR** / **STAR abatement** (ID 233): School Tax Relief. Pronounce as a word "Star".
* **PILOT** (ID 235): Payment In Lieu Of Taxes. Pronounce as a word "Pilot".
* **RAMSA** (ID 220): Robert A.M. Stern Architects design. Pronounce as a word "Ram-suh".
* **FDR** (ID 207): Spelled out letter-by-letter "F-D-R".
* **TLC** (ID 207): Tender Loving Care. Spelled out letter-by-letter "T-L-C".
* **BKSK** (IDs 241, 242, 243, 244): Spelled out letter-by-letter "B-K-S-K".

### 2. Slashes & Conjunctions
* **1-bedroom plus office, 2-bath** (ID 196): Splay as "one bedroom plus office, two bath".
* **living/dining** (IDs 204, 205): Expand to "living and dining".
* **split 2 bedroom** (ID 205): Splay as "split two bedroom".
* **2BDs** / **2BD** (IDs 226, 227, 228, 229, 231, 232): Splay as "two bedrooms".
* **3 bedroom/2.5 bath** (ID 242): Expand to "three bedroom, two and a half bath".
* **4-bedroom/4.5-bathroom** (ID 243): Expand to "four bedroom, four and a half bathroom".

### 3. Alphanumeric & Digit-Unit Combinations
* **8B** / **3C** / **3E** / **5J** / **8K** / **9H** / **2R** / **7C** / **8E** / **B6H** / **21B** / **3A** / **D419** / **621** / **22E** / **32B** / **15B** / **16G-FRONT** / **10L-York** / **3A-FRONT** / **5G-FRONT** / **7C-YORK** / **20C-YORK** / **1014** / **28A** / **4L** / **7K** / **2C** / **8A** (IDs 196, 197, 198, 199, 200, 201, 202, 203, 205, 206, 207, 211, 216, 218, 220, 222, 223, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 238, 241, 242): Unit designations (e.g. "eight B", "three C", "three E").
* **70 Washington Street** / **720 West End Avenue** / **79 Perry Street** / **8 East 96th Street** / **87 Barrow Street** / **860 United Nations Plaza** / **87 St. Mark's Place** / **88 Horatio Street** / **141 East Third Street** / **341 East 3rd Street** / **184 Kent Avenue** / **90 William Street** / **56 West 22nd Street** / **200 Park Avenue** / **555 West 59th Street** / **15 West 96th Street** / **85 Jay Street** / **540 Madison Avenue** / **428 West 19th Street** (IDs 196, 197, 202, 203, 206, 207, 208, 209, 210, 211, 216, 217, 218, 220, 222, 224, 226, 241): Addresses (e.g. "seventy Washington Street", "seven twenty West End Avenue").
* **11.3-foot** / **5 1/4-inch** / **5.5-inch** (IDs 204, 224, 241): Dimensions.
* **1,306 SF** / **170 SF** / **~630 SF** / **735 square feet** / **1,291 square feet** / **1,212sf** / **1,217sf** / **1,636sf** / **1,232sf** / **828sf** / **754sf** / **1644sf** / **844sf** / **3,400 square foot** / **3,118 square feet** (IDs 212, 235, 233, 225, 226, 227, 228, 229, 230, 231, 232, 243, 244): Areas.
* **11th Floor** / **9th Floor** / **10th Floor** / **47th floor** / **28th floor** / **4th floor** / **3rd floor** / **2nd Avenue** / **18th Street** / **72nd St** / **14th floor** / **25th-floor** / **27th floor** / **3rd Bedroom** (IDs 208, 212, 220, 213, 234, 235): Ordinal conversions.
* **1970's** / **1929** (IDs 207, 210): Era/year conversions.
* **24/7** (IDs 207, 3167): Pronounce as "twenty-four seven".

### 4. Luxury Brand Names & Material Phonetics
* **Calacatta Vision** (ID 208): Marble. Pronounce as "Kah-lah-kah-tah Vision".
* **Corteccia** (ID 208): Marble. Pronounce as "Cor-tech-ee-uh".
* **S20M** (ID 208): Architecture firm. Pronounce as "S twenty M".
* **Paris Forino** (IDs 208, 165): Pronounce as "Paris Fo-ree-no".
* **Boffi** (IDs 197, 198, 199, 200, 201): Italian kitchen brand. Pronounce "Bo-fee".
* **Volakas** (IDs 197, 198, 199, 200, 201): Greek marble. Pronounce as "Voh-lah-kahs".
* **Estremoz** (IDs 198, 200, 201): Portuguese marble. Pronounce as "Eh-streh-moze".
* **Rosario Candela** (ID 203): Architect. Pronounce as "Row-zahr-ee-o Can-deh-luh".
* **Poggenpohl** (ID 203): German kitchen brand. "Poh-gen-pohl".
* **LIVunLtd** (ID 212): Concierge services brand. Pronounced "Live Unlimited".
* **Atelier** (IDs 213, 214, 215): Building name. Pronounce as "Ah-tell-yay".
* **Eric Ripert** (ID 219): Chef. Pronounce as "Eric Ree-pair".
* **NuHeat** (ID 219): Underfloor heating brand. Pronounced "New Heat".
* **Sakura Park** (IDs 220): Park. Pronounced "Sah-koo-ruh Park".
* **Calacatta Laza** (ID 220): Quartz. Pronounce "Kah-lah-kah-tah Lah-zuh".
* **Arabescato Cervaiole** (ID 220): Marble. Pronounce "Ah-ruh-beh-skah-to Chair-vah-yole".
* **Grigio Toscana** (ID 220): Marble. Pronounce "Gree-jo Toss-kah-nuh".
* **Hansgrohe** (ID 221): German plumbing brand. Pronounced "Hans-grow-he".
* **Zuma** (ID 223): Soaking tub brand. Pronounced "Zoo-muh".
* **Bilotta** (ID 224): Custom cabinetry. Pronounce "Bih-lot-tuh".
* **Rose Aurora** (ID 224): Marble. "Rose Aw-ror-uh".
* **Calacatta Caldia** / **Caldia** (IDs 226, 227, 228, 229, 230, 231, 232): Marble. "Kah-lah-kah-tah Cal-dee-uh".
* **Bianco Bello** (IDs 226, 227, 228, 229, 230, 231, 232): Marble. "Bee-ahn-co Bel-lo".
* **Strada** (IDs 226, 227, 228, 229, 232): Porcelain brand. Pronounced "Strah-duh".
* **Michael van Valkenburgh** (IDs 225, 226, 227, 228, 229, 232): Landscape designer. Pronounced "Michael van Val-ken-berg".
* **LifeTime Fitness** / **LifeTime** (IDs 225, 226, 227, 228, 229, 230, 231, 232): Gym brand. "Life Time Fitness".
* **Eataly** (ID 233): Italian marketplace. Pronounced "Ee-tuh-lee".
* **Halcyon** (ID 234): Building name. Pronounced "Hal-see-on".
* **Poliform** (ID 234): Italian brand. Pronounced "Pol-ee-form".
* **Listone Giordano Capreuva** (ID 239): Luxury flooring. Pronounced "Lis-tone-ay Jor-dah-no Kah-proo-vuh".
* **Antolini** (ID 239): Marble brand. Pronounced "An-toe-lee-nee".
* **La Vasca by Rapsel** (ID 239): Bath. Pronounced "Lah Vahs-cah by Rahp-sel".
* **Aquasol** (ID 239): Quartzite. Pronounced "Ah-kwah-sol".
* **Alessi** (ID 239): Design brand. Pronounced "Ah-les-see".
* **Frappucino** (ID 239): Marble. Pronounced "Frahp-poo-chee-no".
* **Kaleidescape** (ID 239): Media system brand. Pronounced "Kuh-ly-duh-scape".
* **Linea** (IDs 241, 242, 243, 244): Building name. Pronounced "Lin-ee-uh".
* **Krion** (IDs 241, 242, 243, 244): Solid surface brand. Pronounced "Kree-on".
* **Hafele** (IDs 241, 242, 243, 244): Hardware brand. Pronounced "Hay-feh-leh".
* **Haisa Light** (IDs 241, 242, 243): Marble. Pronounced "High-sah Light".

### 5. Directional Lists & Hyphens
* **N.S,E,W** (ID 239): Splay to "North, South, East, and West".
* **Northeast facing** / **Northwest facing** (IDs 241, 242): Splay directional descriptions.

### 6. Raw Data Typos / Unicode Anomalies
* **theateliercondo. com** (IDs 213, 214, 215): Normalize spacing.
* **W​elcome** / **Th​is** (ID 240): Contains hidden zero-width space characters (`\u200b`). Must be stripped.
* **turkey condition** (ID 203): Typo for "turnkey condition".
* **closest space** (ID 242): Typo for "closet space".
* **deep soaking tube** (ID 237): Typo for "deep soaking tub".
* **Residents"" Lounge** (ID 220): Duplicate quotes.
* **18"" wine cooler** (ID 242): Duplicate quotes for inches.
* **~630 SF** (ID 235): Expand tilde to "approximately".

---

## Chunk 5: Lines 3201 to 4000 (Property IDs 245 to 291)

### 1. Acronyms & ALL-CAPS Abbreviations
* **LLC** (IDs 244, 283, 284): Spelled out "L-L-C".
* **NY** (IDs 244, 283, 284): Spelled out "N-Y" or "New York".
* **MoMA** (IDs 249, 250): Museum of Modern Art. Pronounced "Moe-ma".
* **4K UHD** (ID 250): Spelled out "four K U-H-D".
* **1DSQ** / **DSQ** (IDs 255, 256, 257, 258, 259): "One Domino Square" / "Domino Square". Pronounced "one D-S-Q".
* **USB/USB-c** (IDs 255, 256, 257, 258): Spelled out "U-S-B and U-S-B-C".
* **PATH** / **PATH trains** (ID 262): Pronounce as a word "Path" / "Path trains".
* **NYU** (IDs 285, 287): Spelled out letter-by-letter "N-Y-U".
* **FDR** / **FDR Drive** (ID 282): Spelled out letter-by-letter "F-D-R Drive".

### 2. Slashes & Conjunctions
* **in-unit washer/dryer** (IDs 245, 282, 285): "in-unit washer and dryer".
* **recreation/play** (ID 245): "recreation and play".
* **refrigerator/freezer** (IDs 249, 250): "refrigerator and freezer".
* **2 bed/2bath** (ID 248): "two bedroom, two bath".
* **one-bedroom and one-and-a-half bathroom** (ID 260): "one bedroom and one and a half bathroom".
* **three-bedroom, three-and-a-half-bathroom** (ID 259): "three-bedroom, three and a half bathroom".
* **three-bedroom, two-and-a-half-bath** (ID 275): "three bedroom, two and a half bath".
* **four bedroom duplex, 4.5 bath** (ID 284): "four bedroom duplex, four and a half bath".
* **three-bedroom, two-and-a-half-bath duplex** (ID 286): "three bedroom, two and a half bath duplex".

### 3. Alphanumeric & Digit-Unit Combinations
* **1D** / **8th, 9th and 10th** / **314** / **316** / **34th** / **34D** / **PH3B** / **West 15A** / **1602** / **3601** / **P14B** / **4B** / **2B** / **4P** / **11C** / **8D** / **10A** (Units/Floors): Convert numbers and letters.
* **1,074 square feet** / **200 SF** / **1,600 square feet** / **11,000 square feet** / **45,000 Sq Ft** / **20,000+ square feet** / **1,300 square feet** / **878-square-foot** / **1,641-square-foot** / **2,053 square feet** / **525 feet** / **3,905 square foot** / **800 square foot** / **2,000 square feet** / **1,255sf** / **1,638 SF** / **656 square feet** / **880-square-foot** / **843 square feet** / **779 square feet** / **1,165 square feet** / **1,170 SF** (Areas/Length measurements): Convert digits to words and units.
* **13-foot** / **28-foot** / **14-foot** / **11-ft** / **10-foot** / **10’** / **176 Perry Street** / **910 Union Street** / **425 East 13th Street** / **428 West 19th Street** / **230 Fifth Avenue** / **207 Bowery** / **100 Riverside Boulevard** / **10th Street** / **7.5”** / **7”** / **7-inch-wide** / **75-foot** / **60-foot** / **60"** / **6-foot** (Addresses, dimensions): Convert numbers.
* **4/4 (Sat) 12 – 1:30 PM** (ID 245): "April fourth, Saturday, twelve to one-thirty p-m".
* **1% flip tax** / **1.5%** / **17.5%** (ID 246, 251, 285): "one percent flip tax", "one point five percent", "seventeen point five percent".
* **24-hour** / **24/7** / **24/7 hour** (IDs 245, 246, 252, 273, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290): "twenty-four hour" / "twenty-four seven".
* **$581.83** / **$6,208.33** / **$196.45** (ID 242, 251, 285): currency.
* **22-karat** (IDs 249, 250): "twenty-two karat".
* **65 designer homes** (IDs 249, 250): "sixty-five designer homes".
* **51' x 26'** (ID 251): "fifty-one feet by twenty-six feet".
* **1' HIGHER CEILINGS** / **1 foot** (ID 260): "one foot higher ceilings".
* **1865** / **1931** (Years): "eighteen sixty-five", "nineteen thirty-one".
* **15 feet 6 inches** (ID 281): "fifteen feet six inches".

### 4. Luxury Brand Names & Material Phonetics
* **Andres Escobar** (ID 245): Designer. Pronounce as "Andres Es-co-bar".
* **Jessie Lookfong** (ID 245): Broker name. Pronounce as "Jessie Look-fong".
* **London Towne House** (ID 246): Building name. "London Towne House".
* **Mandarin Oriental Residences** / **Mandarin Oriental** (IDs 249, 250): Hotel/residence brand. "Mandarin Oriental".
* **SHVO** (IDs 249, 250): Luxury developer. Pronounced as a word "Shvo".
* **Daniel Boulud** / **Boulud Privé** / **Boulud** (IDs 249, 250): Chef/restaurant. Pronounced "Daniel Boo-loo" and "Boo-loo Pree-vay".
* **Marin Architects** (IDs 249, 250): Firm. "Marin Architects".
* **Ellevi** (IDs 249, 250): Storage. Pronounced "El-eh-vee".
* **Graffiti** / **Graffiti marble** (IDs 249, 250): Marble. "Graffiti marble".
* **Duravit** (IDs 249, 250): German brand. "Doo-ruh-vit".
* **Salvatori** (IDs 249, 250): Italian brand. "Sal-vuh-tor-ee".
* **Crema d'Orcia** (IDs 249, 250): Limestone. Pronounced "Cray-muh Dor-chee-uh".
* **French Vanilla** (IDs 249, 250): Marble. "French Vanilla".
* **MOMA Design** (ID 250): Italian bath brand. Pronounced "Moe-ma Design".
* **Richard Meier** (ID 251): Architect. "Richard My-er".
* **Jean-Georges Vongerichten** / **Jean-Georges** (IDs 251, 253, 254): Chef. Pronounced "Zhahn Zhorzh Vohn-geh-rich-ten".
* **ODA** (ID 252): Architecture firm. Pronounced as a word "Oh-duh" or letter-by-letter "O-D-A". Usually "O-D-A".
* **Fischer + Makooi Architects** (ID 252): "Fischer and Muh-koo-ee Architects".
* **Alpi Wood** (ID 252): Italian brand. Pronounced "Al-pee Wood".
* **Basaltina** (ID 252): Quartz. Pronounced "Bah-sal-tee-nuh".
* **Matrix** (ID 252): Gym equipment brand. "Matrix".
* **St. Vartan Park** (ID 252): "Saint Vartan Park".
* **The Morgan Library & Museum** (ID 252): "The Morgan Library and Museum".
* **Domino Square** / **James Corner Field Operations** / **Two Trees** (IDs 255, 256, 257, 258, 259): "Domino Square", "James Corner Field Operations", "Two Trees".
* **Lava Stone** / **Lava-stone** (IDs 255, 256, 257, 258, 259): "Lava Stone".
* **Phylrich** (IDs 255, 256, 257, 258): Fixtures. "Fil-rich".
* **Robern** (IDs 255, 256, 257, 258, 259): "Row-burn".
* **Vica** (IDs 255, 256, 257, 258, 259): collection. "Vee-kuh".
* **Bjarke Ingels Group** (ID 260): Architecture firm. Pronounced "Byar-keh Ing-uls Group".
* **Gabellini Sheppard** (ID 260): Design firm. "Gah-bel-lee-nee Shep-ard".
* **Gilles & Boissier** (ID 260): "Jeel ay Bwah-see-ay".
* **One High Line** (ID 260): "One High Line".
* **One Wall Street** (IDs 261, 262): "One Wall Street".
* **Aran Cucine** (IDs 261, 262): Italian kitchen brand. Pronounced "Ah-rahn Coo-chee-nay".
* **Aran** (ID 261): "Ah-rahn".
* **B&B Italia** (ID 261): Italian furniture brand. "B and B Italia".
* **Sky Pool** / **The One Club** (IDs 261, 262): Amenities. "Sky Pool" and "The One Club".
* **Printemps New York** / **Printemps Paris** / **Printemps** (IDs 261, 262): Department store. Pronounced "Prahn-tahm New York" / "Prahn-tahm Paris" / "Prahn-tahm".
* **Maison Passerelle** / **The Red Room Bar** / **Salon Vert** / **Café Jalu** / **The Champagne Bar** (ID 261): Retail concepts. "Mayson Pah-seh-rel", "The Red Room Bar", "Sah-lohn Vair", "Kah-fay Zhah-loo", "The Champagne Bar".
* **Ralph Walker** (ID 261): Architect. "Ralph Walker".
* **Harry Macklowe** (ID 261): Developer. Pronounced "Harry Mack-low".
* **Irving Trust** (ID 261): "Irving Trust".
* **Hildreth Meière** (ID 262): Artisan. Pronounced "Hil-dreth Mee-air".
* **CUT by Wolfgang Puck** (ID 262): Restaurant. "Cut by Wolfgang Puck".
* **The Tin Building** (ID 262): "The Tin Building".
* **Manhatta** / **Crown Shy** / **Overstory** / **Nobu** / **Capital Grille** (ID 262): Restaurants. "Man-hat-tuh", "Crown Shy", "Over-story", "No-boo", "Capital Grille".
* **Naftali Group** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): Developer. Pronounced "Naf-tah-lee Group".
* **Brandon Haw Architecture** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): "Brandon Haw Architecture".
* **One Williamsburg Wharf** / **Williamsburg Wharf** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): "One Williamsburg Wharf".
* **InSinkerator** / **In-sinkerator** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): "In-sink-er-ator".
* **Calacatta Gold Quartz** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): "Kah-lah-kah-tah Gold Quartz".
* **Dolomite** / **Dolomite wainscoting** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): "Dolo-mite".
* **Ward & Gray** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): Designers. "Ward and Gray".
* **Williamsburg Wharf Resort and Recreation Club** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): "Williamsburg Wharf Resort and Recreation Club".
* **Meadowsweet** / **Pokito** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): "Meadow-sweet" and "Po-kee-to".
* **Park Avenue Court** (IDs 273, 274): "Park Avenue Court".
* **Museum Mile** (ID 273): "Museum Mile".
* **Park Union** (ID 275): "Park Union".
* **Vermont oak** (ID 275): "Vermont oak".
* **Grand Army Plaza** (ID 275): "Grand Army Plaza".
* **Speakman** (ID 276): Shower system brand. Pronounced "Speak-man".
* **Pickwick House** (ID 276): "Pickwick House".
* **River Front Condominium** (ID 277): "River Front Condominium".
* **Augsburg** / **Augsburg oak** (IDs 278, 279): Oak flooring. Pronounced "Awgs-berg".
* **Poliform-Varenna** / **Varenna** (IDs 278, 279): Italian kitchen brand. Pronounced "Pol-ee-form Vah-ren-nuh".
* **Bavarian Spessart oak** (IDs 278, 279): Wood. Pronounced "Bavarian Shpeh-sart oak".
* **Caesarstone Pietra Grey** / **Pietra Grey** (IDs 278, 279): Quartz. Pronounced "Pee-eh-truh Grey".
* **Perlado Beige** (IDs 278, 279): Marble. Pronounced "Pair-lah-do Beige".
* **Soori High Line** (IDs 278, 279): "Soori High Line".
* **Azul Grey** (ID 279): Limestone. Pronounced "Ah-zool Grey".
* **Tompkins Square Park** (IDs 281, 285): "Tompkins Square Park".
* **Sterling Plaza** (ID 282): "Sterling Plaza".
* **Terra 48** (ID 283): "Terra forty-eight".
* **Faber hood** / **Faber** (ID 283): Appliance brand. Pronounced "Fay-ber".
* **Ariston** / **Ariston marble** (ID 283): Marble. Pronounced "Ah-ris-ton".
* **Russel and Mary Wright** (ID 283): Designers. "Russel and Mary Wright".
* **CMCSSG 221E48** (ID 283): Pronounced "C-M-C-S-S-G two twenty-one E forty-eight".
* **Pelli Clarke & Partners** (ID 284): Architects. Pronounced "Pelly Clark and Partners".
* **Rafael de Cárdenas** / **de Cárdenas** (ID 284): Designer. Pronounced "Rah-fah-el de Car-deh-nahs".
* **Calacatta Vagli** / **Vagli** (ID 284): Marble. Pronounced "Kah-lah-kah-tah Val-yee".
* **Pro-Chef** (ID 284): Sink brand. "Pro Chef".
* **Didimon Light** / **Didimon** (ID 284): Marble. Pronounced "Did-ee-mon Light".
* **Pink Namibia** / **Namibia** (ID 284): Marble. "Pink Namibia".
* **Douglas Elliman** (ID 284): "Douglas Elliman".
* **El Ad East 74** / **El Ad** (ID 284): Developer. Pronounced "El Ad East seventy-four".
* **The Abbey** (ID 286): Building. "The Abbey".
* **St. George Church** / **St. George’s** (ID 286): "Saint George Church".
* **Siematic** (ID 286): Kitchen brand. Pronounced "See-matic".
* **Compaq** (ID 286): Stone/quartz brand. Pronounced "Kom-pak".
* **Stuyvesant Park** (ID 286): "Stuy-ve-sent Park".
* **The Albert** (ID 287): Building name. "The Albert".
* **The Beacon Tower** (IDs 289, 290): "The Beacon Tower".
* **Charlie or John** (ID 289): Brokers.
* **Brizo** (ID 290): Plumbing brand. Pronounced "Bree-zo".
* **CL-OTH Interiors** / **CL-OTH** (ID 291): Design firm. Pronounced "Cloth Interiors".
* **Boerum Hill** / **Cobble Hill** / **Carroll Gardens** / **Fort Greene** (ID 291): Brooklyn neighborhoods.

### 5. Directional Lists & Hyphens
* **southwest corner** / **south and east** / **south and west** / **north and east** / **west-facing** / **southern exposures** / **east, north, and south** / **eastern** / **northern** / **western** / **southwest and southeast** (various IDs): Expand/normalize directional terms.

### 6. Raw Data Typos / Unicode Anomalies
* **porte-cochère** (IDs 263, 264, 265, 266, 267, 268, 269, 270, 271, 272): Correct accent.
* **w/TONS OF SOUL & CHARACTER** (ID 277): "with tons of soul and character".
* **w/ROOF DECK, GYM** (ID 277): "with roof deck, gym".
* **condolicious** (ID 277): Real estate slang. Keep as is.
* **Russel and Mary Wright** (ID 283): Spelling "Russel" (usually Russell). Keep as is.
* **Mitsubishi split HVAC system** (ID 283): "Mitsubishi split h-vack system".
* **""it"" building** / **chic ""it"" building** (ID 284): Double double-quotes around "it".
* **duel-fuel** (ID 290): Typo for "dual-fuel".
* **cold filtrated water** (ID 290): Typo/alternate phrasing for "cold filtered water".
* **Japanese Umi Kyokai tile** (ID 291): "Japanese Oo-mee Kyo-kye tile".

---

## Chunk 6: Lines 4001 to 5500 (Property IDs 292 to 538)

### 1. Acronyms & ALL-CAPS Abbreviations
* **HVAC** (IDs 307, 362, 381, 481, 485, 493, 506): Pronounce as a word "h-vack".
* **W/D** or **W/D hookup** (IDs 318, 381, 483, 485, 486, 504, 505): Expand to "washer and dryer".
* **LIRR** (ID 349): Spelled out letter-by-letter "L-I-R-R".
* **BAM** (ID 379): Spelled out letter-by-letter "B-A-M".
* **MOMA** or **MoMA** (ID 414): Museum of Modern Art. Pronounced "Moe-ma".
* **ADA** (ID 441): Americans with Disabilities Act. Spelled out letter-by-letter "A-D-A".
* **NYC** (IDs 484, 508, 533): Spelled out letter-by-letter "N-Y-C" (or "New York City").
* **UWS** (IDs 485, 505): Upper West Side. Spelled out letter-by-letter "U-W-S".
* **HDWD** (ID 485): Hardwood floors. Expand to "hardwood".
* **DW** (ID 485): Dishwasher. Expand to "dishwasher".
* **GE** (IDs 485, 517): General Electric. Spelled out letter-by-letter "G-E".
* **AMNH** (ID 485): American Museum of Natural History. Spelled out letter-by-letter "A-M-N-H".
* **LEED** (IDs 486, 497): Leadership in Energy and Environmental Design. Pronounce as a word "Leed".
* **ODA** (ID 490): Architecture firm. Spelled out letter-by-letter "O-D-A".
* **LLC** (IDs 490, 494, 506, 518, 521, 531, 533): Spelled out letter-by-letter "L-L-C".
* **NYU** (IDs 499, 503, 513): Spelled out letter-by-letter "N-Y-U".
* **UN** (IDs 503, 517): United Nations. Spelled out letter-by-letter "U-N".
* **FDR** (IDs 503, 532): Franklin D. Roosevelt Drive. Spelled out letter-by-letter "F-D-R".
* **EV** (ID 508): Electric Vehicle. Spelled out letter-by-letter "E-V".
* **NOI** (ID 537): Net Operating Income. Spelled out letter-by-letter "N-O-I".

### 2. Slashes & Conjunctions
* **1BR/1BA** or **2BR/2BA** (IDs 483, 505): Expand to "one bedroom, one bath" or "two bedroom, two bath".
* **1bed/1 bath** (ID 492): Expand to "one bedroom, one bath".
* **threebedroom/ two-bathroom** (ID 499): Note irregular spacing. Expand to "three bedroom, two bathroom".
* **one bedroom/onebathroom** (ID 499): Note missing space. Expand to "one bedroom, one bathroom".
* **Btw Amst & Bway** (ID 500): Expand to "between Amsterdam and Broadway".
* **three-bedroom-plus-office** (ID 528): Expand to "three bedroom plus office".

### 3. Alphanumeric & Digit-Unit Combinations
* **120SF** / **1000SQFT** / **3,300 square feet** / **837 square feet** / **72-square-foot** / **1,072 square foot** / **3,280 SF** / **950 SF** / **952-square-foot** / **1,624 SF** / **4,000 interior square feet** / **1,536-square-foot** / **757 Sq Ft** / **721 square feet** / **8,000 SQFT** / **200 square feet** / **1,750 square feet** (Areas): Convert digits to words and units.
* **12-foot** / **14-foot** / **10-foot** / **10’3”** / **18’ Ceilings** / **26 feet wide** / **20 feet** / **48 feet by 32 feet** / **13'5** / **10 ½ foot** / **24-foot** (Dimensions): Convert numbers to words.
* **1 Irving Place** / **90 William Street** / **49 West 90** / **53 West 53** / **15 Madison Square North** / **311 Cherry Street** / **2072 Frederick Douglass Boulevard** / **435 East 77th Street** / **161 A West 129th Street** / **17 West 67th Street** / **230 Riverside Drive** / **205 East 85th Street** / **2 Tudor City Place** / **570 Broome Street** / **322 West 104th Street** / **305 First Ave** / **175 Bleecker Street** / **14 Wooster Street** / **77 Bleecker** / **351 West 47th Street** / **47 Vestry Street** / **221E48** (Addresses): Convert numbers to words.
* **467A tax abatement** (ID 486): "four sixty-seven A tax abatement".
* **Tax Class 2B** (ID 537): "Tax Class two B".
* **24/7** (IDs 500, 501, 511, 517, 531): "twenty-four seven".

### 4. Luxury Brand Names & Material Phonetics
* **Naftali Group** (IDs 484, 518): Developer. Pronounced "Naf-tah-lee Group".
* **Brandon Haw Architecture** (IDs 484, 518): Architecture firm. "Brandon Haw Architecture".
* **One Williamsburg Wharf** (ID 484): Condo name. "One Williamsburg Wharf".
* **InSinkerator** (ID 484): Garbage disposal brand. "In-sink-er-ator".
* **Calacatta Gold Quartz** / **Calacatta** (IDs 484, 497, 519): Marble/quartz. "Kah-lah-kah-tah".
* **Carrara marble** (ID 484): Marble. Pronounced "Kah-rah-rah marble".
* **Ward & Gray** (ID 484): Designers. "Ward and Gray".
* **Peter Luger** / **Aska** / **L’Industrie** / **Pokito** / **Meadowsweet** (ID 484): Restaurants. Pronounced "Peter Luger", "Ah-skah", "Lan-doo-stree", "Poe-kee-toe", "Meh-doe-sweet".
* **porte-cochère** (IDs 484, 487, 490, 494): "port-ko-share".
* **Hansgrohe** (IDs 485, 495, 521): Plumbing brand. Pronounced "Hans-grow-he".
* **Fulgor Milano** (ID 485): Italian appliance brand. Pronounced "Fool-gor Mee-lah-no".
* **Schiffini** (ID 486): Italian cabinetry brand. Pronounced "Shee-fee-nee".
* **Corian** (ID 486): Solid surface brand. Pronounced "Kory-an".
* **Neptune Zen** (ID 486): Soaking tub brand. "Neptune Zen".
* **Atrio** / **El Vez** / **Seamore's** / **Parm** (ID 486): Restaurants/shops. Pronounced "Ah-tree-oh", "El Vezz", "See-mores", "Parm".
* **Thierry Despont** (IDs 487, 488, 498, 515): Architect. Pronounced "Tee-eh-ree Day-pohn".
* **Jean Nouvel** (IDs 487, 488, 498, 515): Architect. Pronounced "Zhon Noo-vel".
* **Molteni** (IDs 487, 488, 498, 515): Italian kitchen brand. Pronounced "Mol-tay-nee".
* **Dornbracht** (IDs 487, 488, 498, 515): German fixtures brand. Pronounced "Dorn-brakt".
* **Noir St. Laurent** (IDs 487, 488, 498, 515): French marble. Pronounced "Nwahr San Law-rahn".
* **Verona limestone** (IDs 487, 488, 498, 515): Limestone. "Verona limestone".
* **Lefroy Brooks** (IDs 487, 488, 498, 515): Luxury plumbing brand. Pronounced "Leh-froy Brooks".
* **Schwinghammer** (IDs 487, 488, 498, 515): Lighting design firm. Pronounced "Shwing-ham-er".
* **Altamarea Group** (IDs 487, 488, 498, 515): Restaurant group. Pronounced "Al-tah-mah-ray-ah Group".
* **Arclinea** (ID 489): Italian kitchen brand. Pronounced "Ark-lin-ay-ah".
* **Waterworks** (IDs 489, 521, 533): Luxury bath brand. "Waterworks".
* **Ann Sacks** (ID 489): Luxury tile brand. "Ann Sacks".
* **Taj Mahal quartzite** (ID 490): Stone. "Taj Mahal quartzite".
* **JennAir** (IDs 490, 506, 518): Appliance brand. Pronounced "Jen-Air".
* **Brizo Luxe Gold** (ID 490): Fixtures brand. Pronounced "Bree-zoh Luxe Gold".
* **Arabescato Orobico** (ID 490): Italian marble. Pronounced "Ah-rah-beh-ska-toe Oh-ro-bee-koe".
* **Agata & Valentina** (ID 496): Specialty market. Pronounced "Ah-gah-tah and Val-en-tee-nah".
* **Rimadesio** (ID 497): Italian custom wardrobes. Pronounced "Ree-mah-day-zyoh".
* **Valcucine** (ID 497): Italian kitchen brand. Pronounced "Val-coo-chee-nay".
* **Thomas Juul-Hansen** (ID 497): Designer. Pronounced "Thomas Yool-Hansen".
* **Jean-Georges** (ID 497): Restaurant/chef. Pronounced "Zhon-Zhorzh".
* **Neil Denari** (ID 497): Architect. Pronounced "Neil Deh-nah-ree".
* **HL23** (ID 497): Building name. Pronounced "H-L twenty-three".
* **RIVAA Gallery** (ID 502): Roosevelt Island Visual Art Association. Pronounced "Ree-vah Gallery".
* **Juilliard** (ID 504): School. Pronounced "Joo-lee-ard".
* **Gronenberg and Leuchtag** (ID 504): Architects. Pronounced "Grow-nen-berg and Loyk-tag".
* **LaGuardia Design Group** (IDs 506, 518): Landscape design. Pronounced "Lah-gward-ee-ah Design Group".
* **Ceppo Bianco** (ID 506): Italian terrazzo-like stone. Pronounced "Cheh-poe Bee-ahn-koe".
* **Dormakaba** (IDs 506, 518): Smart lock brand. Pronounced "Dor-mah-kah-bah".
* **Humanscale** (IDs 506, 518): Office design brand. "Humanscale".
* **Birley Bakery** (ID 507): Café. Pronounced "Bur-lee Bakery".
* **Le Charlot** (ID 507): Restaurant. Pronounced "Luh Shar-low".
* **Marcel’s** (ID 507): Café. Pronounced "Mar-sellz".
* **Nero Marquina** (ID 514): Marble. Pronounced "Neh-roe Mar-kee-nah".
* **Bianco Dolomiti** (ID 514): Marble. Pronounced "Bee-ahn-koe Doe-low-mee-tee".
* **SieMatic** (IDs 514, 519, 521): Kitchen brand. Pronounced "See-matic".
* **Volaka marble** (IDs 515, 526): Greek marble. Pronounced "Voe-lah-kah marble".
* **Grigio Niccola** (IDs 515, 526): Italian marble border. Pronounced "Gree-joh Nee-koe-lah".
* **Robert A.M. Stern** (ID 516): Architect. "Robert A M Stern".
* **Daino Reale** (ID 518): Italian marble. Pronounced "Dye-noe Ray-ah-lay".
* **Cosentino Dekton** (ID 521): Countertop brand. Pronounced "Koe-sen-tee-noe Dek-ton".
* **Nilo Brazilian quartzite** (ID 521): Quartzite. Pronounced "Nee-loh Brazilian quartzite".
* **The Morleigh** (ID 522): Co-op name. Pronounced "The Mor-lee".
* **Mojo Stumer** (ID 523): Architecture/interior firm. Pronounced "Moe-joe Stoo-mer".
* **Pabade Cafe** (ID 523): Cafe. Pronounced "Pah-bah-day Cafe".
* **Barawine** (ID 523): Wine bar. Pronounced "Bah-rah-wine".
* **Emery Roth** (ID 525): Architect. Pronounced "Em-er-ee Roth".
* **Ingrao Inc.** (ID 526): Design firm. Pronounced "In-gray-oh Incorporated".
* **Ornare** (ID 528): Custom closet brand. Pronounced "Or-nah-ray".
* **Schwartz & Gross** (ID 531): Architects. Pronounced "Shwartz and Grose".
* **Lazza** (ID 533): Crystallized glass. Pronounced "Laht-sah".
* **Reuveni LLC** / **LCOR Incorporated** (ID 533): Real estate companies. Pronounced "Reh-oo-ven-ee L-L-C", "L-C-O-R Incorporated".
* **Fisher & Paykel** (ID 538): Appliance brand. Pronounced "Fisher and Pay-kel".

### 5. Directional Lists & Hyphens
* **north- and east-facing** (IDs 487, 497, 512): "north and east facing".
* **south-, north-, east-, and west-facing** (ID 488): "south, north, east, and west facing".
* **south- and east-facing** (IDs 498, 515): "south and east facing".
* **north-, south-, east-, and west-facing** (IDs 515): "north, south, east, and west facing".

### 6. Raw Data Typos & Formatting Anomalies
* **double panned windows** (ID 486): Typo for "double-paned windows".
* **Calcutta Gold Vein** (ID 489): Typo for "Calacatta Gold Vein".
* **Dorn Bracht** (ID 489): Spaced brand name. Normalize to "Dornbracht".
* **MRR 1326 LLC (""Sponsor"")** (ID 490): Escaped quotes around Sponsor.
* **BEAUFULLY REVONATED STUIDIO** (ID 513): Multiple typos. Normalize to "Beautifully renovated studio".
* **10'3""** (IDs 4918, 5142): Double double-quotes for inches.

