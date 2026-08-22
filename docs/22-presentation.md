# Muntlig presentation — manus och körschema

*Framtaget 2026-08-23, mot Bilaga 2 §3.6 och Avropsförfrågan §16.*

## Vad detta är, och varför det finns

Den muntliga presentationen är **ett bedömt tilldelningskriterium med max
500 000 kr i mervärde** (§16), på samma femgradiga skala och med samma
bedömningsgrunder som de skrivna: *relevans, tydlighet, konkretionsgrad,
genomförbarhet* samt i vilken utsträckning redovisningen visar *förståelse för
uppdragets förutsättningar och behov*.

Bilaga 2 §3.6 sätter formen: **15 minuter, i Medlingsinstitutets lokaler.**
Presentationen ska ge Medlingsinstitutet möjlighet att ställa klargörande frågor,
men i huvudsak är den vår möjlighet att visa hur systemet kommer att utformas
utifrån avropsförfrågans krav och önskemål.

Och den sätter den enda regel som kan kosta oss poäng utan att någon säger emot
oss i rummet:

> *"Leverantören får ej tillföra nya åtaganden, det är inte en möjlighet till en
> andra anbudsomgång."*

**Allt som sägs måste gå att peka på i det inlämnade svaret.** Ett åtagande som
inte står i `18-role-scenarios-SV.md`, `19-arbetsprocesser-SV.md` eller Bilaga 4
är ett nytt åtagande, även om det är litet och även om det är sant. Se listan
*Vad som inte får sägas* sist i detta dokument — den är den viktigaste sidan här.

---

## Grundvalet: vi visar systemet, inte bilder på systemet

Presentationen körs i **prototypen**, inte i en bildpresentation. Det är hela
argumentet: varje annan leverantör kommer att visa skisser, och Bilaga 2 §3.5
säger uttryckligen att *"visualiseringarna behöver inte utgöra färdiga
systembilder"*. Att våra gör det är den enskilt tydligaste skillnaden, och den
går inte att beskriva — den måste ses.

Vägen genom systemet är **`/genomgang`**, den guidade genomgången. Den är byggd
för detta: den byter roll åt presentatören, öppnar rätt vy i rätt ordning, och
bär nästa steg i demoraden så att ingen behöver leta. **Sex scenarier,
22 steg.** De tre första är §3.5:s tre bedömda roller och ligger först.

| Scenario | Steg | Roll |
|---|---|---|
| Avtalsadministratör / Handläggare | 7 | `agreement-admin` |
| Systemadministratör | 6 | `permission-admin` → `system-admin` |
| Allmänhetens dator | 5 | `public` |
| Medlingsadministratör | 2 | `mediation-admin` |
| Statistikanvändare | 1 | `statistics-user` |
| Medlaradministratör | 1 | `mediator-admin` |

De tre sista visas inte i löpande text — de nämns i en mening som belägg för att
systemet är komplett i alla åtta roller. Att klicka igenom dem kostar minuter vi
inte har.

---

## Körschema, 15 minuter

Tiderna är kumulativa. **Innehållet är 12 minuter och frågorna 3.** Om
Medlingsinstitutet lägger frågestunden utanför de 15 har vi tre minuters
reserv — använd den på Scenario 2, aldrig på inledningen.

### 0:00–1:15 · Ramen

*Ingen inloggning, ingen titelbild. Öppna direkt på `/genomgang`.*

Säg, ungefär:

> "Det ni ser är inte en skiss. Det är ett körande system i två fullständiga
> språkversioner, granskat mot WCAG 2.1 AA, och ni kan klicka i det själva efteråt
> på den här adressen. Vi har byggt de tre roller ni bedömer, och de fem andra som
> §3.1 kräver.
>
> Vi går igenom de tre rollerna i den ordning bilagan bedömer dem, och vi följer
> era egna steg. Femton minuter räcker till tre scenarier och en kort del om hur
> vi arbetar — resten finns i svaret."

**Peka på demoraden en gång och bli av med frågan:** *"Den grå raden överst är
inte en del av MIIS. Det är våra granskningsverktyg — roll, datamängd, språk och
kravnummer — och de ligger utanför systemets egen ram just för att ingen ska ta
dem för föreslagen funktionalitet."*

### 1:15–5:45 · Scenario 2 — Avtalsadministratör *(4,5 min, den tyngsta)*

Detta är rollen med störst volym i det dagliga arbetet, och den där
AI-stödet syns. Kör genomgångens sju steg, men **stanna på tre av dem**:

1. **`/registrera` — protokollet bredvid formuläret.** Era fem steg i §4.4, inga
   påhittade. Visa att protokollet stannar kvar medan handläggaren bläddrar.
2. **Källkopplingen.** Markera ett AI-förslag och visa att avsnittet det lästs ur
   markeras i protokollet. Säg: *"Varje förslag är källkopplat och varje förslag
   kräver ett godkännande. Ett av förslagen i demonstrationen är avsiktligt fel —
   vi visar den avvisande vägen, för ett flöde som bara visar den lyckade vägen
   påstår granskningen i stället för att demonstrera den."* **Avvisa det.**
3. **`/avtal/A-001` — Huvudrapporten i tre flikar**, med status, publicering och
   Märket i kolumnen bredvid. Säg: *"Det här är er Rapport 4. Flikarna är tre
   olika arbetsuppgifter; det de utförs mot står kvar bredvid."*

Avsluta med **publiceringen** på `/avtal/A-010`: *"Publicering är en åtgärd med
datum och person, inte en egenskap. Ett halvregistrerat avtal kan inte
publiceras, och kontrollen säger varför."*

### 5:45–8:45 · Scenario 1 — Systemadministratör *(3 min)*

Kör genomgångens sex steg. **Rollbytet är poängen, och det ska sägas högt** —
det är ett av de tydligaste beläggen för *förståelse för verksamhetens krav*:

> "Här byter vi roll, och jag vill säga varför. Bilaga 2 §3.5 ber
> systemadministratören att lägga upp användare. Bilaga 1 §3.1 ger den rollen
> *full åtkomst inkl. systemkonfiguration, exklusive behörigheter*, och lägger
> användaradministrationen hos behörighetsadministratören. Vi läser parentesen som
> avsiktlig — den som konfigurerar systemet är inte den som ger åtkomst till det —
> så vi demonstrerar alla fem stegen och byter roll där ert eget dokument kräver
> det, i stället för att vidga en behörighet ni skrivit en parentes för att
> begränsa."

Stanna sedan på två saker:

1. **Den siste behörighetsadministratören.** Försök inaktivera. Kontrollen vägrar
   och säger varför. *"Det är den enda utelåsning som bara vi som leverantör
   skulle kunna reparera, och NFÅ-005 finns för att hålla oss utanför."*
2. **Inställningarna, där två av fyra är låsta.** *"Sessionstiden går att ändra
   hela vägen — startsidan och varningen följer med. Loggarnas lagringstid går
   inte, för NFL-003 namnger systemadministratören i förbudet. Fyra redigerbara
   rutor hade sagt att vi byggt ett formulär. Det här säger att vi läst
   meningarna."*

Om tiden räcker: **ändringsloggen med gammalt och nytt värde.** Det är svaret på
*"vem ändrade siffran i rapporten"*.

### 8:45–11:15 · Scenario 3 — Allmänhetens dator *(2,5 min)*

Byt roll till `public`. Den här delen ska gå fort, för det är hela argumentet:
uppgiften är fyra handlingar.

1. Skriv i sökfältet — listan avgränsas medan man skriver. *"Ingen inloggning.
   NFÅ-006 gör maskinen i rummet till behörigheten."*
2. Avgränsa på bransch. *"Bransch först, för besökaren tänker i branscher långt
   innan de tänker i arbetsgivarorganisationer."*
3. Öppna avtalet — er Rapport 1. *"Inga lönesiffror. Det är arbetsmaterial."*
4. **Tryck Skriv ut.** Visa förhandsgranskningen: märket, utskriftsdatum, ingen
   navigation, inga knappar. *"Det blir ett dokument, inte en skärmbild. Och
   nedladdningen skriver en riktig CSV — båda fungerar."*

Nämn sekretessen i en mening: *"Ett sekretessmarkerat avtal listas och räknas,
men har ingen sida. Att ta bort det ur listan vore att svara besökaren att det
inte finns."*

### 11:15–12:00 · Metoden och ägandet *(45 sek — kort, det står i svaret)*

Ingen ny information. Tre meningar:

> "Vi levererar i tvåveckorsetapper där varje etapp slutar i något ni kan öppna,
> med era kravnummer synliga på de vyer som uppfyller dem. Kvalitetsgrindarna
> körs vid varje ändring — enhetstester, tillgänglighetssvep, kravspårning — och
> de finns beskrivna med kommandon i svaret.
>
> Och §3.7 ger er systemet fullt ut. Det är ett arkitekturbeslut hos oss, inte ett
> licensbeslut: regelverket ligger i ett lager som inte importerar något ramverk,
> all dataåtkomst går genom en enda söm, och det finns inga externa molnberoenden
> — NFA-001."

### 12:00–15:00 · Frågor

**Svara på det som frågas.** Om svaret inte finns i det inlämnade svaret är rätt
svar *"det är inte något vi åtagit oss i avropssvaret, och §3.6 tillåter oss inte
att lägga till det här — men jag svarar gärna på hur vi tänker"* och sedan en
beskrivning som inte är ett löfte.

---

## Sannolika klargörande frågor, med svar som redan står i svaret

| Fråga | Svar, och var det står |
|---|---|
| *Är AI-stödet med i Steg 1?* | Ja, §4.1:s fyra funktioner, planerade nov 2026–feb 2027. Men det ligger **inte på kritiska linjen** — varje förslag ska godkännas manuellt ändå, så den manuella vägen finns oavsett. `19-SV`, tidplan och risker |
| *Vad händer om Försäkringskassans miljö dröjer?* | §2.6:s tillfälliga utvecklingsmiljö, och gemensamt tekniskt möte de första två veckorna. Kostnaden prissätts separat i Bilaga 4 | 
| *Hur vet vi att migreringen håller?* | Analys från etapp ett, upprepade provkörningar från december, verifiering av kvalitet och fullständighet enligt T-007 — inte en enda körning i mars |
| *Ni visar en prototyp — hur mycket är byggt?* | Gränssnittet, reglerna och metoden. Ingen databas, ingen identitetsleverantör, ingen AI-modell. Det står i svaret, i avsnittet *Vad detta avsnitt inte ska påstå* |
| *Varför byter ni roll mitt i systemadministratörens scenario?* | §3.1:s parentes. Se manuset ovan — svara med bilagan, inte med en åsikt |
| *Kan behörighetsmatrisen konfigureras?* | Nej, avsiktligt. NFÅ-003 definierar åtkomst utifrån §3.1:s roller; en matris vi kunde möblera om vore en inställning i stället för ert dokument |
| *Vad kostar Steg 2?* | Bilaga 4. Hänvisa dit och lägg inte till något |
| *Kan ni börja tidigare?* | Tidplanen i svaret utgår från avtal efter avtalsspärren. Att utlova en tidigare start är ett nytt åtagande |

---

## Vad som inte får sägas

§3.6 igen: *"Leverantören får ej tillföra nya åtaganden."* Det gäller även när
frågan bjuder in till det, och även när svaret vore ja.

- **Ingen funktion som inte står i svaret.** Inte "det kan vi lägga till", inte
  "det är enkelt att bygga", inte "vi kan nog få med det i Steg 1".
- **Inga nya datum.** Tidplanen är den i `19-arbetsprocesser-SV.md`.
- **Inga priser, rabatter eller timmar** utanför Bilaga 4.
- **Inga nya personer.** Arbetsgruppen är den som namngivits enligt §3.1.
- **Inga garantier om prestanda, drift eller tillgänglighet** utöver de krav vi
  accepterat.
- **Säg inte att prototypen är systemet.** Den har ingen databas, ingen IdP och
  ingen AI-modell, och det ska sägas rakt om någon frågar — det kostar ingenting
  och att undvika det kostar trovärdighet.

Om något går fel i demonstrationen: **säg vad som hände och gå vidare.** En
presentatör som felsöker inför utvärderarna bränner minuter som inte finns.

---

## Praktiskt

- **Kör lokalt, inte mot Vercel.** `npm run dev` på presentationsmaskinen.
  NFA-001 innebär att systemet inte har några externa beroenden, så det fungerar
  utan nät — vilket också är värt att nämna i en mening.
- **Ha den publicerade adressen framme** att lämna efter sig:
  `miis-poc.vercel.app/genomgang`.
- **Svenska, kravnummer av.** Demoraden ska stå på svenska och `miis_reqtags`
  ska vara **av** i löpande demonstration. Slå på den *en gång*, i Scenario 2, i
  fem sekunder, och säg: *"Varje vy bär numren på de krav den uppfyller. Vi
  lämnar den avstängd, för ett system ni ska använda argumenterar inte med sin
  användare om kravspecifikationen."* Slå av den igen.
- **Datamängd `normal`.** `peak` är för att visa att systemet håller volym och
  `quiet` för tomma lägen; ingen av dem är vad man demonstrerar i.
- **Öva med klocka.** Det enda som gör 15 minuter till 15 minuter är att ha kört
  det. Scenario 2 är den del som svämmar över — korta där, inte i inledningen.

---

## Vad detta dokument inte är

Det är **inte en bildpresentation**, och det ska inte bli en. Bilder om ett
system vi kan visa är en sämre version av att visa det.

Det är **inte en fullständig redovisning av svaret**. Femton minuter räcker till
tre scenarier och en kort metoddel. Det som inte hinns med finns i
`18-role-scenarios-SV.md` och `19-arbetsprocesser-SV.md`, och
Medlingsinstitutet har läst dem innan vi kommer.
