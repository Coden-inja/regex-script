# Real Estate Description Cleaning & TTS Voiceover — Master Rules Reference

> **Single consolidated reference** merged from:
> - `manual_observations.md` (raw human observations from `all_overviews.csv`, chunks 1–6)
> - `regex_rules_plan.md` (implementation plan, brand phonetics, rule collisions, pipeline order)
> - `human_manual_listening.md` (manual listening review + decisions)
>
> Purpose: clean real estate listing descriptions into simple, unambiguous spoken text for a text-to-speech (TTS) engine, because the TTS model reads text literally and hallucinates numbers/abbreviations unless pre-processed.

---

## 1. At a Glance: What the Pipeline Does

The sanitizer (`text_sanitizer.js`) runs a **staged, ordered regex pipeline**. Order matters — a rule executed too early or too late corrupts another rule.

```
Raw text
  -> 1. Unicode & quote normalization (+ strip parentheticals)
  -> 2. Boilerplate / Title-case / ALL-CAPS heading stripping
  -> 3. Transit & compass expansion (subway slashes, A/C, W/D, E/W/N/S)
  -> 4. Address & house-number spoken conversion
  -> 5. Dimensions, feet-inches, fractions & square footage
  -> 6. Acronym / abbreviation / brand pronunciation rules
  -> 7. Number / currency / year / ordinal / decimal conversion + spacing cleanup
  -> Truncate to ~150 words at nearest sentence boundary
  -> Write tts_clean_overview (plain) + tts_clean_overview_html (highlighted)
```

**Golden rules (from human review):**
1. Every number must become words — the model is "dumb" and cannot be trusted (`1420` -> `fourteen twenty`, NOT `one thousand twenty`).
2. Abbreviations must be expanded to full spoken forms (`E. 70th St.` -> `East seventieth Street`).
3. Hyphens that are native to a word (eat-in, turn-key) are **kept** — removing them makes speech no better.
4. Acronyms are kept in raw ALL-CAPS so the engine spells them letter-by-letter naturally (`F-D-R`, `B-B-L`, `L-I-R-R`).
5. Foreign/proper brand names are mostly **left as-is** — the model already pronounces most of them correctly; only a known-problem list needs dictionary overrides.

---

## 2. Rule Collisions & Execution Order (Critical)

These pairs of rules collide. They MUST run in the order shown:

| Collision | The problem | Resolution & order |
| :--- | :--- | :--- |
| **FDR vs FDR Drive** | Standalone `FDR` means "formal dining room"; `FDR Drive` is the Manhattan highway and must stay "F D R". | Protect `FDR Drive` first (do not expand). Then map standalone `FDR` -> `formal dining room`. |
| **A/C vs Subway lines** | `A/C` in "A/C subway lines" = transit line (`A and C`); `A/C` alone = air conditioning. | Splat transit lists first (`A/C/E` -> `A, C, and E`; `A/C subway` -> `A and C subway`). THEN expand remaining `A/C` -> `air conditioning`. |
| **St. vs Street vs Saint** | `49th St.` = Street; `St. Moritz` = Saint. | `St.` preceded by a digit/ordinal -> `Street`. `St.` followed by a capitalized name (and not preceded by a number) -> `Saint`. |
| **2/5 subway vs 2bed/2bath** | Generic slash rule turns `2bed/2bath` into clunky "two bedroom and two bath". | Run specific bedroom/bath slash regexes FIRST (`2BR/2BA` -> `two bedroom, two bath`), then the generic slash rule. |
| **" (inches) double quotes** | CSV exports escape inches as `10'3""`. | Normalize quotes/escaped quotes at the very start: `""` -> `"`, smart quotes/prime/double-prime -> straight `'`/`"`, `×` -> `x`, `°` -> ` degree`. |

---

## 3. Heading & Boilerplate Stripping

Remove marketing/legal filler that should not be spoken:

- Parenthetical content, including the parentheses: `(…)` is deleted entirely.
- Boilerplate openers: `Available for immediate occupancy`, `Now available`, `New Price`, `Open House …`, `SHOWINGS BY APPOINTMENT`, `HUGE REDUCTION`, `JUST LISTED`, `PRICE REDUCED`, `Exclusive Offering`.
- Short "Welcome to / Introducing / Presenting" first sentences (<= 6 words).
- Title-case heading line (own line, all words capitalized, no sentence-ending punctuation) — EXCEPT if the line contains real specs like `3 Beds` / `2 Baths` / `500 sq ft` (that is content, keep it).
- ALL-CAPS heading line that is its own line or contains a pipe `|` (e.g. `PANORAMIC VIEWS | DESIRED LOCATION`). The pipe is removed.
- Virtual-staging disclaimers: `Photos are virtually staged.`, `Some images have been virtually staged.`, `Digitally altered/enhanced.` etc.
- Zero-width-space chars `\u200b` (hidden characters hiding inside words like `W​elcome`) are stripped.

---

## 4. Abbreviation & Expansion Rules

| Raw | Spoken / Replacement |
| :--- | :--- |
| `A/C`, `a/c`, `AC` | `air conditioning` |
| `W/D`, `w/d`, `washer/dryer` | `washer and dryer` |
| `apt`, `apts`, `ste`, `stes`, `blvd`, `ave`, `aves` | `apartment`, `apartments`, `suite`, `suites`, `boulevard`, `avenue`, `avenues` |
| `CPW` | `Central Park West` |
| `RSD` | `Riverside Drive` |
| `E.` / `W.` / `N.` / `S.` + street number | `East` / `West` / `North` / `South` |
| `c.1901`, `ca.` + year | `circa 1901` |
| `St.` after a number | `Street` |
| `St.` before a name (e.g. St. Moritz) | `Saint` |
| `PH6A` | `Penthouse six A` |
| `BR`, `BRs` | `bedroom`, `bedrooms` |
| `FDR` (standalone) | `formal dining room`; `FDR Drive` protected |
| `NYC` | `New York City` |
| `AV` | `audio visual` |
| `AM/PM`, `a.m.`, `p.m.` | `AM or PM`, `AM`, `PM` |
| `sq. ft.`, `sf`, `sqft`, `Squareft`, `sq` | `square feet` (all variations, consistently) |
| `ft` / `FT` | `foot` / `feet` (unit-aware) |
| `N.S,E,W` | `North, South, East, and West` |
| `~` (before a number) | `approximately` |
| `24/7` | `twenty-four seven` |
| `24-hour` | `twenty-four hour` |
| `Btw Amst & Bway` | `between Amsterdam and Broadway` |
| `HDWD` | `hardwood` |
| `DW` | `dishwasher` |
| `EV` | `electric vehicle` (or spelled E-V) |

---

## 5. Acronyms (kept ALL-CAPS so the engine spells them)

Keep these uppercase so the TTS reads them letter-by-letter. (Manual hyphenation `B-B-L` is NOT needed — the engine spells ALL-CAPS natively.)

`BBL`, `BAM`, `ADA`, `NOI`, `LIRR`, `FAR`, `NYC`, `NYU`, `UN`, `UWS`, `LES`, `LLC`, `HVAC` (word-ified "h-vack"), `GE`, `AMNH`, `LED`, `MPFP`, `TLC`, `BKSK`, `UAP`, `NYS` (-> New York State), `OP` (-> Offering Plan), `FDR` (-> F-D-R), `UAP`, `DCS`, `ODA`, `GB`, `RET`, `HOA`, `MOA`.

Word-style acronyms (pronounced as words): `PATH` -> `Path`, `FiDi` -> `Fye-Dye`, `DUMBO` -> `Dumbo`, `MoMA` -> `Moe-ma`, `STAR` -> `Star` (tax abatement), `PILOT` -> `Pilot` (Payment In Lieu Of Taxes), `LEED` -> `Leed`, `ZIP` -> `zip`, `RAMSA` -> `Ram-suh`, `SHVO` -> `Shvo`, `SHoP` -> `Shop`, `LES` -> spelled.

---

## 6. Slashes & Conjunctions

| Raw | Replacement |
| :--- | :--- |
| `2BR/2BA`, `1BR/1BA`, `2 bed/2bath`, `3 bedroom/2.5 bath` | `two bedroom, two bath`, etc. (comma between, not "and") |
| `living/dining`, `recreation/play`, `refrigerator/freezer`, `closet/dressing`, `indoor/outdoor`, `live/work`, `recreation & relaxation`, `study/Zoom`, `staff/guest` | `living and dining`, `recreation and play`, `refrigerator and freezer`, `closet and dressing`, `indoor and outdoor`, `live and work`, `recreation and relaxation`, `study or Zoom`, `staff or guest` |
| `den/fourth`, `2/5`, `condo/elevator` | `den or fourth`, `two or five`, `condo and elevator` |
| `A/C/E` (subway) | `A, C, and E` |
| `2/3/4/5` (subway) | `two, three, four, or five` |
| `washer/dryer`, `W/D` | `washer and dryer` |
| `wet-over-dry`, `double-tiered`, `co/op` | `wet over dry`, `double tiered`, `co-op` |
| `w/ROOF DECK` | `with roof deck` |
| `&` | `and` |

---

## 7. Numbers, Years, Ordinals, Currency

**Big / round numbers**
- Numbers >= 1,000,000 ending in zeros -> "X million" (`3,600,000` -> `three point six million`; `$1.275M` -> `one point two seven five million dollars`; `$360,000,000` -> `three hundred sixty million dollars`).
- `$1.2M`, `$1.1M` -> `one point one million dollars`.
- Commas removed (`7,750` -> `seven thousand seven hundred fifty`).
- `4400` -> `forty-four hundred`; `1100SF` -> `eleven hundred square feet`; `2300sf` -> `twenty-three hundred square feet`.

**Years & decades**
- `1932` -> `nineteen thirty two`; `2026` -> `twenty twenty six`; `2000` -> `two thousand`; `2004` -> `two thousand and four`.
- `1920s` -> `twenties`; `1980s` -> `eighties` (etc. for 60s/70s/80s/90s/20s/30s/40s/50s); years ending in 0 -> `nineteen twenties`.
- `September 2027` -> `September twenty twenty seven`.

**Ordinals**
- `2nd` -> `second`; `49th` -> `forty-ninth`; `127th` -> `one hundred twenty seventh`; special spellings: first, second, third, fifth, eighth, ninth, twelfth, -tieth.
- Unit/floor letters: `10E` -> `ten E`; `17B` -> `seventeen B`; `PH3B` -> `Penthouse three B`; `1C` -> `one C`.
- Alphanumeric codes: `111W57` -> `One eleven West fifty-seven`; `336W23` -> `three hundred three-six West twenty-third`; `51E` -> `fifty-one E`; `221E48` -> `two twenty-one E forty-eight`; `421-a` -> `four twenty-one a`; `S20M` -> `S twenty M`.

**Currency**
- `$9,075.07` -> `nine thousand seventy-five dollars and seven cents`.
- `$581.83` -> `five hundred eighty-one dollars and eighty-three cents`.
- Percent: `50%` -> `fifty percent`; `17.5%` -> `seventeen point five percent`; `1%` -> `one percent`.

**Decimals & fractions**
- `4.5 bathroom` -> `four and a half bath`; `2.5 baths` -> `two and a half baths`; `6.5 Bathrooms` -> `six and a half bathrooms`.
- `3 1/2` -> `three and a half`; `1/2` -> `a half`; `1/4` -> `a quarter`.
- `24.25'` -> `twenty-four point two-five feet`.
- `1.1` -> `one point one`.

**Alphanumeric units**
- `2-bedroom` -> `two bedroom`; `7-story` -> `seven story`; `36-inch` -> `thirty-six inch`; `22-karat` -> `twenty-two karat`; `5-burner` -> `five burner`; `18-room` -> `eighteen room`; `One4` -> `one four`.

---

## 8. Dimensions, Area & Units

- Feet-inches: `14'-6"`, `12'6"`, `9'6"` -> `fourteen feet six inches` (units pluralized unless the value is `1`; the word is `foot` in ceiling contexts).
- `16'1"` -> `sixteen feet one inch`; `48""`/`18"" ` (double quote) -> `forty-eight inch` / `eighteen inch`.
- Decimal feet: `23.5'` -> `twenty-three and a half feet`; `10.5 ft` -> `ten and a half feet`.
- Dimension pairs use "by": `20'x30'` -> `twenty feet by thirty feet`; `22'10"x15'10"` -> `twenty-two feet ten inches by fifteen feet ten inches`; `17 x 24` -> `seventeen by twenty-four`; `51' x 26'` -> `fifty-one feet by twenty-six feet`.
- Hyphenated pairs: `11-6 x 10-0` -> `eleven feet six inches by ten feet zero inches` (feet-inches meaning).
- `48 feet by 32 feet`, `15' x 105'` -> `fifteen feet by one hundred five feet`.
- Square feet: `2,443-square-foot` -> `two thousand four hundred forty-three square feet`; `776 sq ft` -> `seven hundred seventy-six square feet`; `/ft²`, `$741/ft²` -> `per square foot`.
- `12mm` -> `twelve millimeter`; `200 volts` -> `two hundred volts`; `50%` -> `fifty percent`.

---

## 9. Address & House Number Pronunciation

House numbers are spoken in **grouped** form, not as plain cardinals:

| Address | Spoken |
| :--- | :--- |
| `1420 York Avenue` | `fourteen twenty York Avenue` |
| `155 East 49th Street` | `one fifty-five East forty-ninth Street` |
| `870 United Nations Plaza` | `eight seventy United Nations Plaza` |
| `2099 Fifth Avenue` | `twenty ninety-nine Fifth Avenue` |
| `113 North 9th Street` | `one thirteen North ninth Street` |
| `44-46 Barrow Street` | `forty-four to forty-six Barrow Street` |
| `730 Park` | `seven thirty Park` |
| `701 Prospect` | `seven hundred one Prospect` |
| `1122 Madison Avenue` | `eleven twenty-two Madison Avenue` |

Rules:
- 3-digit: `one hundred` for X00; `X oh Y` when the middle digit is zero; `X Y` otherwise (e.g. `one fifty-five`).
- 4-digit: grouped as **first two digits + last two digits** (`fourteen twenty`, `seven twenty`); `2000` -> `two thousand`.
- Street numbers >= 110 with a non-zero tens digit drop "hundred" (`110` -> `one tenth`, `49th` -> `forty-ninth`).
- Street ranges: `159-161 Bleecker Street` -> `one fifty-nine to one sixty-one Bleecker Street`.

---

## 10. Brand Names & Proper Noun Pronunciation Dictionary

> Status note: staged **1–4 below are active**. Brand phonetics (5) were **largely disabled** after manual listening showed the model pronounces most brands correctly — the dictionary below remains the reference of *desired* pronunciations for any brand the engine gets wrong. The **overridden decisions** are marked in section 12.

### 10.1 Buildings, neighborhoods, parks
| Term | Spoken |
| :--- | :--- |
| One High Line / One Wall Street / The Tin Building / The Abbey / The Albert / The Beacon Tower / Sterling Plaza / Park Avenue Court / Park Union / London Towne House | as written |
| Olympia | Oh-lim-pee-uh |
| Atelier | Ah-tell-yay |
| Linea | Lin-ee-uh |
| Halcyon | Hal-see-on |
| Nolita | No-lee-tuh |
| DUMBO / Dumbo | Dum-bo |
| Sakura Park | Sah-koo-ruh Park |
| Grand Army Plaza / Tompkins Square Park / Stuyvesant Park / St. George Church | as written (St. -> Saint) |
| Boerum Hill, Cobble Hill, Carroll Gardens, Fort Greene, Museum Mile, Williamsburg Wharf | as written |
| Tremont / River Front Condominium / Pickwick House / Park Union | as written |

### 10.2 Architects, designers, developers
| Term | Spoken |
| :--- | :--- |
| Rafael Viñoly | Rah-fah-el Vin-yoh-lee |
| Jean Nouvel | Zhahn Noo-vel |
| Thierry Despont | Tee-air-ee Day-pohn *(override: keep raw)* |
| Rosario Candela | Row-zahr-ee-o Can-deh-luh |
| Peter Pennoyer | Peter Pen-noy-er *(override: keep raw)* |
| Robert A. M. Stern | Robert A M Stern |
| Richard Meier & Partners | Richard My-er and Partners |
| Herzog & de Meuron | Hert-sog and de Moy-ron |
| Diller Scofidio + Renfro | Diller Sko-fee-dee-o and Ren-fro |
| Bjarke Ingels Group | Byar-keh Ing-uls Group |
| Olson Kundig | Ohl-son Kun-dig |
| Emery Roth | Em-er-ee Roth |
| Morris Adjmi | Morris Ahj-mee |
| Cary Tamarkin | Cary Tuh-mar-kin |
| Deborah Berke | De-buh-ruh Burk |
| Annabelle Selldorf | An-nuh-bel Sel-dorf |
| Alexandra Champalimaud | Alexandra Sham-pah-lee-moh |
| Michael van Valkenburgh | Michael van Val-ken-berg |
| James Corner Field Operations | as written |
| Beyer Blinder Belle | By-er Blinder Bell |
| Harry Macklowe | Harry Mack-low |
| Zeckendorf Development | Zek-in-dorf Development |
| Naftali Group | Naf-tah-lee Group |
| Brandon Haw Architecture | as written |
| Pelli Clarke & Partners | Pelly Clark and Partners |
| Adjmi, Selldorf, ODA (O-D-A), RAMSA, CetraRuddy, Gabellini Sheppard, Studio Sofield, Studio Mellone, PellOverton, Robert Scarano, David Helpern, Neil Denari, Thomas Juul-Hansen, Shelton Mindel, Morris Adjmi | canonical spellings above |
| Andre Escobar / Andres Escobar | An-des Es-co-bar |
| Richard Ciccarelli | Richard Chi-cuh-rel-lee |
| Mike Ingui | Mike In-gwee |
| Melamed Architect | Mel-ah-med Architect |
| Melamed, ROTTEt Studio (Rot-tet), Studio Zuchowicki (Zoo-cho-wick-ee), Mojo Stumer (Moe-joe Stoo-mer) | as written |
| Inès Lamunière | Ee-nez Lah-mun-yair |
| Peter Marino | Peter Muh-ree-no |
| David Helpern | David Hel-pern |

### 10.3 Kitchens, appliances, hardware
| Term | Spoken |
| :--- | :--- |
| Miele | Mee-luh *(override: keep as "Meeluh", no hyphen)* |
| Gaggenau | Gah-guh-now *(override: keep raw)* |
| Sub-Zero / SubZero | Sub Zero |
| Bulthaup | Boolt-howp |
| Poggenpohl | Poh-gen-pohl |
| Boffi | Bo-fee |
| Molteni (+ Molteni&C) | Mol-tay-nee (… and C) |
| Arclinea | Ark-li-nay-uh |
| Valcucine | Val-coo-chee-nay |
| Scavolini | Skah-vo-lee-nee |
| Aran Cucine | Ah-rahn Coo-chee-nay |
| Poliform / Poliform-Varenna | Pol-ee-form / Vah-ren-nuh |
| Varenna | Vah-ren-nuh |
| SieMatic / Siematic | See-matic |
| Allmilmo | All-mil-moh |
| Schiffini | Shee-fee-nee |
| Rimadesio | Ree-mah-day-zyoh |
| Lineadecor | Lin-ee-uh-decor |
| Ornare | Or-nah-ray |
| Smallbone of Devizes | Small-bone of De-vye-ziz |
| Christopher Peacock | Christopher Pea-cock |
| JennAir | Jen-Air |
| Thermador | Ther-muh-dor |
| Electrolux | Ee-lek-tro-lux |
| Daikin | Dye-kin |
| Liebherr | Leeb-hehr |
| Fisher & Paykel | Fisher and Pay-kel |
| Bertazzoni | Bear-tah-tso-nee |
| Asko | Ah-sko |
| Fulgor Milano | Fool-gor Mee-lah-no |
| AGA Elise | Ah-guh Eh-leez |
| La Cornue | Lah Cor-noo |
| MasterCool | Master Cool |
| Dornbracht / Dorn Bracht | Dorn-brakt |
| Hansgrohe | Hans-grow-he |
| Grohe | Gro-he |
| Lefroy Brooks / LeFroy Brooks | Lefroy Brooks |
| Duravit | Doo-ruh-vit |
| Kallista | Kuh-lis-tuh |
| Brizo Luxe Gold | Bree-zoh Luxe Gold |
| Phylrich | Fil-rich |
| Robern | Row-burn |
| Buster & Punch | Buster and Punch |
| Emtek hardware | Emtek hardware |
| Nanz hardware | Nanz hardware |
| Speakman | Speak-man |
| Schindler (elevators) | Shind-ler |
| InSinkerator | In-sink-er-ator |
| Kraus Hi-Tech | Krow-ss High-Tech |
| Bowers & Wilkins | Bowers and Wilkins |
| McIntosh | Mak-in-tosh |
| Sonance | So-nans |
| Ubiquiti | You-bik-wit-ee |
| Control4 | Control Four |
| Lutron / Lutron Caseta | Loo-tron / Loo-tron Kuh-see-tah |
| Crestron | Kres-tron |
| Savant | Sah-vahnt |
| Somfy | Sahm-fee |
| Renu Therapy | Ree-new Therapy |
| Struxure | Struk-chur |
| Bromic | Bro-mik |
| Kaleidescape | Kuh-ly-duh-scape |
| Vitsoe | Vit-soo |
| NuHeat | New Heat |
| Zuma (tub) | Zoo-muh |
| Neptune Zen | Neptune Zen |
| Toto Neorest | To-to Nee-o-rest |
| Blanco | Blahn-ko |
| Zuma, Aquasol, Hydrosystems, Waterworks, Ann Sacks, Bakes & Kropp, Henrybuilt | canonical as written |

### 10.4 Marbles, stones, wood
| Term | Spoken |
| :--- | :--- |
| Calacatta | Kah-lah-kah-tah |
| Calacatta Paonazzo | Kah-lah-kah-tah Pah-o-naht-so |
| Calacatta Caldia | Kah-lah-kah-tah Cal-dee-uh |
| Calacatta Vision / Calacatta Gold Quartz / Calacatta Laza (Lah-zuh) / Calacatta Vagli (Val-yee) | Kah-lah-kah-tah + name |
| Covelano | Koe-veh-lah-noe |
| Celeste Grigio | Che-les-tay Gree-jo |
| Pelle Grigio | Pell-ay Gree-jo |
| Nero Marquina | Nee-ro Mar-kee-nuh |
| Grigio Orobico / Grigio Niccola / Grigio Toscana / Grigio Onyx | Gree-jo + name |
| Arabescato Antico | Ah-ruh-beh-skah-to Ahn-tee-co |
| Arabescato Cervaiole | Ah-ruh-beh-skah-to Chair-vah-yole |
| Arabescato Orobico | Ah-rah-beh-ska-toe Oh-ro-bee-koe |
| Volakas / Volaka | Voh-lah-kahs |
| Estremoz | Eh-streh-moze |
| Fior di Bosco | Fee-or dee Boss-co |
| Agglo Ceppo | Ahg-lo Chep-o |
| Thasos | Tah-sose |
| Basaltina | Bah-sal-tee-nuh |
| Ceppo Bianco | Cheh-poe Bee-ahn-koe |
| Bianco Bello | Bee-ahn-co Bel-lo |
| Bianco Dolomiti / Blanco Dolomiti | Bee-ahn-koe Doe-low-mee-tee / Blahn-ko Do-lo-mee-tee |
| Azul Grey | Ah-zool Grey |
| Perlado Beige | Pair-lah-do Beige |
| Noir St. Laurent | Nwahr San Law-rahn |
| Crema d'Orcia | Cray-muh Dor-chee-uh |
| Santa Marina | Santa Muh-ree-nuh |
| Taj Mahal (quartzite) | Tahj Muh-hal |
| Caesarstone | See-zer-stone |
| Caesarstone Pietra Grey | See-zer-stone Pee-eh-truh Grey |
| Cosentino-Dekton | Co-sen-tee-no Dek-ton |
| Silestone, Corian (Kory-an), Krion (Kree-on), Compaq (Kom-pak) | as written |
| White Macauba | White Mah-cow-bah |
| Daino Reale | Dye-noe Ray-ah-lay |
| Rose Aurora | Rose Aw-ror-uh |
| Frappucino (marble) | Frahp-poo-chee-no |
| Haisa Light | High-sah Light |
| Neuvellano | New-vel-lah-no |
| Celador Oyster | Sel-uh-dor Oyster |
| Eucalyptus (wood) | You-cuh-lip-tus |
| Augsburg oak | Awgs-berg oak |
| Bavarian Spessart oak | Bavarian Shpeh-sart oak |
| Vermillan / Vermont oak | as written |
| Ipe | Ee-pay |
| Thermory Ash | Ther-muh-ree Ash |
| Alpi Wood | Al-pee Wood |
| Pianeta Legno Aformosia | Pee-uh-neh-tah Leg-no Ah-for-mo-zee-uh |
| Listone Giordano Capreuva | Lis-tone-ay Jor-dah-no Kah-proo-vuh |
| Strada | Strah-duh |
| Amuneal | Am-u-neel |
| Laszlo / Lazza | Laht-sah |

### 10.5 Restaurants, shops, brands, misc proper nouns
| Term | Spoken |
| :--- | :--- |
| Printemps | Prahn-tahm |
| Eataly | Ee-tuh-lee |
| Via Carota | Vee-uh Kuh-ro-tuh |
| Dante | Dahn-tay |
| Veselka | Veh-sel-kuh |
| McSorley's | Mak-sor-lees |
| Peter Luger / Aska / L'Industrie / Pokito / Meadowsweet | Peter Luger / Ah-skah / Lan-doo-stree / Poe-kee-toe / Meh-doe-sweet |
| Jean-Georges Vongerichten | Zhahn Zhorzh Vohn-geh-rich-ten |
| Daniel Boulud / Boulud Privé | Daniel Boo-loo / Boo-loo Pree-vay |
| Eric Ripert | Eric Ree-pair |
| CUT by Wolfgang Puck | Cut by Wolfgang Puck |
| Harry Cipriani | Harry Chee-pree-ah-nee |
| Misi | Mee-see |
| Il Buco | Eel Boo-co |
| Four Horsemen / Bonsignour (Bahn-seen-yor) / Equinox (Ee-kwi-noks) / Gemma (Jem-muh) | as written |
| Aux Merveilleux de Fred | Oh Mair-vay-yuh de Fred |
| Barawine | Bah-rah-wine |
| Pabade Cafe | Pah-bah-day Cafe |
| Birley Bakery | Bur-lee Bakery |
| Le Charlot | Luh Shar-low |
| Marcel's | Mar-sellz |
| Fios | Fye-os |
| La Palestra | Lah Pah-les-tra |
| Sakura Park | Sah-koo-ruh Park |
| Salon Vert | Sah-lohn Vair |
| Café Jalu | Kah-fay Zhah-loo |
| Maison Passerelle | Mayson Pah-seh-rel |
| Manhatta | Man-hat-tuh |
| Crown Shy / Overstory / Nobu / Capital Grille | as written |
| Jackbox | Jack-box |
| Wright Fit | Wright Fit |
| LifeTime Fitness | Life Time Fitness |
| LIVunLtd | Live Unlimited |
| Agata & Valentina | Ah-gah-tah and Val-en-tee-nah |
| Gucci | Goo-chee |
| Alessi | Ah-les-see |
| Scholten, Schumacher | Shoo-mah-ker |
| Chango & Co. | Chang-go and Company |
| Bakes & Kropp | Bakes and Kropp |
| Ward & Gray | Ward and Gray |
| CL-OTH Interiors | Cloth Interiors |
| Dormakaba | Dor-mah-kah-bah |
| ButterflyMX | Butterfly M X |
| Reuveni LLC / LCOR | Reh-oo-ven-ee L-L-C / L-C-O-R |
| Douglas Elliman | as written |
| Fios, LIRR, PATH | as section 5 |

---

## 11. Directional & Hyphen Cleanup

- `south east-facing` -> `south-east facing` (fix missing hyphen).
- `South- and East-facing` / `north-, south-, east-, and west-facing` -> the direction words joined by commas/and: `south, north, east, and west facing` (trailing `-` cleaned off).
- `northeast-facing` / `southwestern` -> `northeast facing` / `southwestern`.
- Trailing hyphens on direction words are removed: `north-,` -> `north,`.
- Native hyphenated words (eat-in, turn-key) are kept. Do NOT remove.

---

## 12. Human Manual-Listening Decisions (Overrides)

From `human_manual_listening.md` — these trump earlier phonetic plans:

1. **Number-to-word is mandatory** for everything (addresses, currency, years, dimensions). The model reads `1420` as "one thousand twenty" and `$360,000,000` as "three hundred and sixty thousand thousand".
2. **`St.` handling is mandatory**: `155 E 49th St.` must become `one fifty-five East forty-ninth Street` (not "saint").
3. **FDR**: keep `FDR Drive` as is; standalone `FDR` = formal dining room.
4. **Subway A/C** -> `A and C` (model said "A A C" when raw).
5. **`4.5 bathroom`** -> `four and a half bath` (NOT "four point five").
6. **`c.1901`** -> `circa nineteen hundred and one` (or "nineteen oh one").
7. **`23.5'`** -> `twenty-three and a half feet` ("twenty three fives wide" is wrong).
8. **`8+` / `500 sqft+/-`** -> `eight plus` / `five hundred square feet plus or minus`.
9. **Hyphens**: `eat-in` was *quicker* than `eat in`; do NOT remove native hyphens.
10. **Square feet**: every variation (`sf`, `sqft`, `sq.ft.`, `Squareft`) -> `square feet`.
11. **Comma before "and"**: strip `, and` -> ` and` — the comma caused a double pause.
12. **Acronyms**: keep ALL-CAPS raw so the engine spells them (`F-A-R` instead of "far"); drop manual hyphenation (`L-E-D` etc.).
13. **CamelCase**: narrow splitting so `SHoP` -> `Shop` is not destroyed into `S HoP`.
14. **Brand overrides**:
    - Miele -> `Meeluh` (continuous; no hyphen).
    - Gaggenau -> leave raw.
    - CetraRuddy -> leave raw (or "Cetra Ruddy").
    - Thierry Despont, Peter Pennoyer -> leave raw (model handles them).
    - Overall: the model pronounces most foreign words well; **do not need a big brand-phonetics dictionary** — only fix what listening proves is wrong.

---

## 13. Truncation Rule (Voiceover length)

- Clean text is truncated to **150 words max**.
- Truncation snaps to the **last sentence-ending punctuation** (`.`/`!`/`?`) found within a **172-word window**.
- If no punctuation is found, it takes the first 150 words and appends a period.
- HTML highlight markup preserves each rewritten token so converted spans can be reviewed (`<span>` with original in braces).

---

## 14. Known Raw-Data Typos & Unicode Anomalies to Normalize

| Raw | Fix |
| :--- | :--- |
| `porte coche`re`, porte-cochère | `porte cochere` |
| `libarary` | `library` |
| `townnhouse` | `townhouse` |
| `turkey condition` | `turnkey condition` |
| `closest space` | `closet space` |
| `deep soaking tube` | `deep soaking tub` |
| `double panned windows` | `double-paned windows` |
| `BEAUFULLY REVONATED STUIDIO` | `Beautifully renovated studio` |
| `duel-fuel` | `dual-fuel` |
| `condolicious` | keep (slang) |
| `Empire Estate Building` | keep as written |
| `23 X 93` | `23 x 93` (lowercase x) |
| `IL Buco,, Alta`, duplicate commas | single comma |
| `Residents"" Lounge`, `18"" wine cooler`, `48""`, `10'3""` | normalize double double-quotes to `"` |
| `theateliercondo. com` | fix spacing |
| `W​elcome` / zero-width space `\u200b` | strip hidden chars |
| `~630 SF` | `approximately 630 SF` |
| `Dorn Bracht` | `Dornbracht` |
| `Calcutta Gold Vein` | `Calacatta Gold Vein` |
| `square fee` (typo) | `square feet` |
| `MRR 1326 LLC (""Sponsor"")` | unescape quotes |

---

## 15. Master QA Test Text (from human listening review)

Use this text to regression-test the sanitizer; every sentence exercises a rule:

```text
We begin the vocal test by auditing headings. MASTERPIECE BY TONY INGRAO.

Now testing Saint versus Street abbreviations. Welcome to 155 E 49th St. Enter and walk towards Hotel St. Moritz.

Now testing highway versus formal dining room contradictions. Sited near the FDR Drive, this residence offers a formal dining room FDR.

Now testing transit lines versus air conditioning. Steps from the A/C subway, this unit has central A/C.

Now testing acronyms. The building has a 12.0 FAR, LED lighting, a ZIP code of 10017, a BBL number, and a low NOI.

Now testing address house numbers. Located at 1420 York Avenue and 870 United Nations Plaza.

Now testing decades and plural numbers. Built in the 1920s near the East 60s.

Now testing decimal bathroom metrics. A truly exquisite 4-bedroom, 4.5 bathroom home.

Now testing circa years. Built c.1901 by Janes and Leo.

Now testing dimension marks. Enter the 40'x18' great room with soaring 16'1"" ceilings.

Now testing decimal dimensions. The gallery is 23.5' wide.

Now testing mathematical symbols. A modern 8+ passenger elevator and a 500 sqft+/- terrace.

Now testing hyphen pauses. First is a turn-key home featuring an eat-in kitchen. Second is a turnkey home featuring an eat in kitchen.

Now testing square feet variations. First is 6,700sf, second is 500 sqft, third is 2,443-square-foot, fourth is 776 sq.ft., and fifth is Squareft.

Now testing large round numbers and currency. Sited at an Asking Price of $360,000,000, representing $1,272/ft² on 282,925 buildable square feet.

Now testing Miele pronunciations. ... Now testing Gaggenau pronunciations. ... Now testing CetraRuddy pronunciations. ...

Now testing typo spacing. It sits near atelephone building steps awayfrom here, andpermit-ready.

Now testing run-on sentences and breathing spaces. Panoramic Views | Desired Location | Luxury Living.
```