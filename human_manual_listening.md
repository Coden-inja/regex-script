# Human Manual Listening Logs & Review Findings

## 1. Master Test Text Used
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

Now testing Miele pronunciations. First is Miele, second is Mee-luh, third is Meeluh, and fourth is Meile.

Now testing Gaggenau pronunciations. First is Gaggenau, second is Gah-guh-now, and third is Gahguhnow.

Now testing CetraRuddy pronunciations. First is CetraRuddy, second is Cetra Ruddy, third is Set-ruh-rud-ee, and fourth is Setruhrudee.

Now testing Thierry Despont pronunciations. First is Thierry Despont, second is Tee-air-ee Day-pohn, and third is Teeehree Daypohn.

Now testing Peter Pennoyer pronunciations. First is Peter Pennoyer, second is Peter Pen-noy-er, and third is Peter Pennoyer.

Now testing typo spacing. It sits near atelephone building steps awayfrom here, andpermit-ready.

Now testing run-on sentences and breathing spaces. First, the run-on sentence without commas. This extraordinary duplex features custom bedroom layouts and stunning views and premium appliances and a wine fridge and custom fixtures and a refrigerator and smart home automation and central air conditioning steps from the subway. Second, the same sentence with commas. This extraordinary duplex features custom bedroom layouts, and stunning views, and premium appliances, and a wine fridge, and custom fixtures, and a refrigerator, and smart home automation, and central air conditioning, steps from the subway. Third, pipe symbol replacement. Panoramic Views | Desired Location | Luxury Living.
```

## 2. User's Exact Raw Review Comments
```text
1 - correct
2 - it read 155 E 49th St.  as five five saint enter and walk towards hotel saint moritx

It did not read the number correctly -  so number to word is a must and saint and street conversion is a must, as model is dumb .
my question where is the text that contains our cleaned saint and street text too? you wating my time agian and again


3 - third it read as it is written, i myself dont understand what you are trying with the FDR

4 - it is pronouncing A A C    - so i am thinking the model needs as simple input as required, but you have not given the cleaned text so i will have to generate again you idiot

5. - it pronounced all abbreviations correctly , F A R instead of far ,  so i think capitals for abbreviation that need to be kept abbreaviatted is fine, and for others we have the dictionary to make them full forms right?    mainting a simple file like i am talking about my observations only

6 - it read 1420 as one thousand twenty , so number to word is a must again proved

7 - it read nineteen twenties and east sixites correctly , but you did not give text condtition without the s so i dont know, what the hell man i asked you for it contatingin all kinds of conditions didnt i?

8 - it read four bedroom , four point five bathroom , you decide if point five is correct or it should say four and a half and what we are doing in the regex cleaning?

9 - it said now testing circa years, built c nine o one by janes and leo , again proved cleaning needed for number to word

10 - it does not handle dimentions correclty so inches and feet like the regex is doing is correct. we need to give it as simple processed text as possible so it does not hallicunate

11 - it said twenty three fives wide

12 - it said eight plus passenger elevator and a five hundred s q f t plus terrace

12 - both were same with or without hyphen. eat-in was quicker than eat in
13 - all variable where sqaure feet is not explicitly written are wrong pronounced we need to be very careful about changing all cases
14 - it said three hundred and sixty thousand thousand, so again number to word is importatn
15 - it said first is mee lee second is mee loo third is mee loo and fourth is mee lee , i myself dont know the correct pronunciation so how can i tell, but the hyphen and non hyphen one is same so remove hyphen keep meeluh 
16 - it isaid first is gagenow second is gaa guh now with pauses which looked awkward and third is gaga, so i think we shoudl leave that word as it is?
17 - first is setrarudy , second is setraruddy with a quick ruddy third is set ra rud ee which was so bad with pauses and fourht is setruhradee correclty
18 - it prnounced thierry despont correclty i dont think we even need many dictionary for all those foreign words
19 - all three variations were correct
20 - what is typo spacing i did feel anything wrong
21 - in the no comma one it took pauses naturally before each and , so we dont have to keep commas before and as it amkes double pase , other commasa re good i guess, and the pipe caused no problem
```

## 3. Our Key Observations & Actions Needed

Based on your manual review, here are the actionable updates we must implement in the text sanitizer pipeline:

1. **Saint / Street Expansion**:
   * **Issue:** `155 E 49th St.` read as "five five saint..."
   * **Action:** Streets/Saints are currently cleaned by our Stage 3 regex, but it only runs when we process the text. We must convert these numbers and abbreviations properly.
2. **FDR & Subway A/C**:
   * **Issue:** Subway line `A/C` was pronounced as "A A C".
   * **Action:** Convert slash patterns for subway lines like `A/C` to "A and C". Keep FDR Drive as "FDR Drive" but map standalone FDR to "formal dining room".
3. **Number to Word Conversion**:
   * **Issue:** `1420` read as "one thousand twenty", `$360,000,000` read as "three hundred and sixty thousand thousand".
   * **Action:** We must run the clean number conversion to produce word strings like "fourteen twenty" and "three hundred sixty million".
4. **Metric Pluralization & Decimals**:
   * **Issue:** `4.5 bathroom` was read as "four point five bathroom".
   * **Action:** Convert `.5` bathrooms/baths to "and a half baths / bathrooms" to make it natural.
5. **Circa Year**:
   * **Issue:** `c.1901` read as "c nine o one".
   * **Action:** Must expand to "circa nineteen hundred and one" or "circa nineteen oh one".
6. **Dimension Suffix & Prime**:
   * **Issue:** `23.5'` read as "twenty three fives wide".
   * **Action:** Expand decimals followed by `'` to feet (e.g. "twenty-three point five feet").
7. **Mathematical Symbols (+ and +/-)**:
   * **Issue:** `8+` -> "eight plus", `500 sqft+/-` -> "five hundred s q f t plus".
   * **Action:** Replace `+/-` with "plus or minus" and `+` with "plus".
8. **Hyphens (turn-key, eat-in)**:
   * **Issue:** Splay vs Hyphen did not change pause, but hyphenated "eat-in" was actually quicker.
   * **Action:** Do NOT remove hyphens from words that are natively hyphenated (like `eat-in` or `turn-key`).
9. **Square Feet Variations**:
   * **Issue:** `sf`, `sqft`, `sq.ft.`, `Squareft` are mispronounced unless fully expanded to "square feet".
   * **Action:** Consistently convert all variations to "square feet".
10. **Brand Pronunciation adjustments**:
    * **Miele:** Convert Miele to `Meeluh` (continuous, no hyphen).
    * **Gaggenau:** Leave as original `Gaggenau` (no phonetic replacement).
    * **CetraRuddy:** Leave as original `CetraRuddy` (or standard `Cetra Ruddy` space).
    * **Thierry Despont & Peter Pennoyer:** Leave as original (remove phonetic entries since model pronounces them fine).
11. **Oxford Comma / Comma before "and"**:
    * **Issue:** Commas immediately preceding "and" caused the voice to take double-pauses (one from the punctuation and one naturally before the conjunction).
    * **Action:** Strip commas directly preceding the word "and" (e.g., `, and` -> ` and`) in Stage 7.
12. **Native All-Caps Acronyms & Hyphenation**:
    * **Issue:** Manually inserting hyphens for spelled-out acronyms like `L-E-D`, `F-D-R`, `B-B-L` is redundant since the TTS engine natively spells out any all-caps words letter-by-letter.
    * **Action:** Kept acronyms in raw all-caps format (preserving them in Stage 2) and dropped manual hyphenation rules. Standalone `FDR` is protected from replacement when followed by `Drive` via a negative lookahead, keeping it cleanly as `FDR Drive`.
13. **Narrowing CamelCase splitting regex**:
    * **Issue:** The over-greedy CamelCase splitting rule parsed `SHoP` into `S HoP` because of the uppercase-lowercase transition (`S` + `Ho`).
    * **Action:** Narrowed the CamelCase split pattern to standard CamelCase words (`\b([A-Z]?[a-z]+)([A-Z][a-z]+)\b`) to protect `SHoP`, and added an early normalization from `SHoP` to `Shop` for flawless pronunciation.
14. **Dimensional `.5` measurements**:
    * **Issue:** Measurements like `23.5'` were parsed as "twenty three point five feet", which sounds robotic in real estate contexts.
    * **Action:** Integrated a parser check in Stage 5 so that any `.5` feet/inches dimension translates to "and a half feet/inches" (e.g., "twenty three and a half feet").
15. **Mathematical Plus (`+`)**:
    * **Issue:** Plus sign `+` (e.g. `8+`) left raw as `eight+` instead of natural English.
    * **Action:** Convert `+` to ` plus` in Stage 1 so it resolves to `eight plus`.
