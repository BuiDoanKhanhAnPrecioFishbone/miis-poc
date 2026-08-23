# De tre bedömda rollscenarierna — svensk svarstext

*Svensk återgivning av `18-role-scenarios.md`, framtagen 2026-08-22. **Detta är
den text som lämnas in.** Den engelska versionen är arbetsunderlag för teamet och
för granskare som inte läser svenska; vid skillnad gäller den svenska.*

Detta är texten till anbudssvarets tyngst viktade avsnitt,
*Rollbaserade användarscenarier och användargränssnitt* (**1 000 000 kr av
2 500 000**). Bilaga 2 §3.5 efterfrågar fyra saker om var och en av tre roller:

1. *en kort beskrivning av användarens* **uppgift och mål**
2. *en beskrivning av* **arbetsflödet** *för det aktuella scenariot*
3. **visualiseringar** *som illustrerar användargränssnittet*
4. *hur lösningen stödjer* **användbarhet, effektivitet och tillgänglighet**

**§3.5 anger också stegen** — fem för systemadministratören, fyra vardera för de
båda andra — och avsnitten nedan följer dem i Medlingsinstitutets egen ordning,
så att den som läser med bilagan uppslagen kan följa med punkt för punkt.

Medlingsinstitutet anger vad som bedöms: *"Hur väl lösningen stödjer de olika
användarrollernas behov. Gränssnittets tydlighet, struktur och användbarhet. Hur
intuitivt arbetsflödena är utformade. Leverantörens förståelse för verksamhetens
krav och arbetsprocesser. Hur väl visualiseringarna bidrar till förståelsen av
den föreslagna lösningen. I vilken utsträckning lösningen bedöms skapa mervärde
för användarna och verksamheten."*

Kravet på visualiseringarna är lågt satt: *"Visualiseringarna behöver inte utgöra
färdiga systembilder utan ska ses som illustrativa exempel."* **Våra är inte
skisser.** Varje skärmbild nedan är tagen ur ett körande, WCAG-granskat system i
två fullständiga språkversioner, som går att klicka igenom på
**miis-poc.vercel.app/genomgang** — en guidad genomgång som byter roll och öppnar
varje vy, i den ordning §3.5 bedömer dem.

Allt nedan är skrivet mot vad prototypen faktiskt gör. Där något är beskrivet i
stället för byggt står det i texten — ett anbud som påstår att allt redan är sant
inbjuder till den enda fråga det inte kan besvara.

**Skärmbilderna** genereras ur det körande bygget med `npm run screenshots` —
aldrig omritade, aldrig retuscherade — i två omgångar: `--produkt` (systemet som
Medlingsinstitutet skulle använda det) och `--kravid` (samma vy med kravnummer
synliga, för spårning krav → gränssnitt). Filnamnen nedan avser `produkt`.

---

## Scenario 1 — Systemadministratör

*I prototypen: Lars Lund, IT och förvaltning, samt Karin Karlsson,
behörighetsadministratör. Båda — och det är själva poängen, se nedan.*

### Uppgift och mål

Systemadministratören ansvarar för systemet, inte för handläggningen i det:
**vem som har åtkomst, som vad, och vad systemet har gjort.** Målet är att
Medlingsinstitutet ska kunna lägga upp en ny medarbetare, tilldela, ändra och
återkalla behörighet samt kunna svara för en ifrågasatt siffra i en publicerad
rapport — allt utan att kontakta leverantören.

> **Scenariot spänner över två roller, och det är en läsning av
> Medlingsinstitutets egna dokument snarare än en lucka i vår.** Bilaga 2 §3.5
> ber *systemadministratören* att skapa användare och tilldela roller. Bilaga 1
> §3.1 ger den rollen *"full åtkomst inkl. systemkonfiguration **(exkl.
> behörigheter)**"* och placerar *"läsa, skriva, redigera användare"* hos
> **behörighetsadministratören**. Parentesen är avsiktlig: den uttrycker en
> åtskillnad mellan den som konfigurerar systemet och den som ger åtkomst till
> det, och det är en säkerhetsegenskap värd att behålla. Den erbjudna lösningen
> demonstrerar därför alla fem stegen i §3.5 och **byter roll där §3.1 kräver
> det**, i stället för att vidga en behörighet som Medlingsinstitutet skrivit en
> parentes för att begränsa. Genomgången anger bytet på den kontroll som utför
> det.

### Arbetsflöde

Medlingsinstitutets fem steg, i Medlingsinstitutets ordning.

**1 · Översikt över användare, roller och behörigheter.** Användarregistret
besvarar de fyra frågor ett sådant register finns till för, i den ordning de
ställs: **vem** som har åtkomst, **som vad**, **sedan när och av vem**, och **om
personen fortfarande finns kvar**. Var och en är en kolumn. Registret filtreras
på roll och status, och urvalsmarkeringarna anger vad som har avgränsats.

Behörighetsadministrationen är **tre flikar**, eftersom den är tre olika saker:
registret där arbetet görs, och två uppslagsverk som arbetet görs mot. Under
fliken **Roller och behörigheter** ligger **behörighetsmatrisen** — var och en av
§3.1:s åtta roller mot
varje modul, med läs, skriv eller ingen åtkomst. Den är **läsbar men inte
redigerbar**, och det är ett designbeslut snarare än en utelämning: NFÅ-003
definierar åtkomst utifrån de roller §3.1 skriver fram, så en matris som en
administratör kunde möblera om skulle beskriva en lokal konfiguration i stället
för Medlingsinstitutets eget dokument — och varje behörighetspåstående i detta
svar skulle handla om en inställning. Rollerna är avtalet; tilldelningen är
administrationen.

**2 · Skapa en ny användare.** Namn, EFOS-identitet, e-post, roll. Det finns
**inget lösenordsfält och ingen kontoskapning**, eftersom NFÅ-001 lägger
autentiseringen i Försäkringskassans IdP över SAML med EFOS-kort — en användare i
MIIS är en *koppling* till en identitet som redan finns, och ett kontoformulär
här skulle påstå att vi byggt en identitetsleverantör.

**3 · Tilldela roll och behörighet.** Rollen *är* behörigheten: §3.1 ger varje
roll ett verb, och rollen avgör vad personen ser och får göra. Tilldelningen
stämplas med datum och den som gjorde den, vilket är FH-001-halvan av NFÅ-005.

**4 · Ändra eller återkalla behörighet.** Rollen ändras **på raden**, så att
administratören har personen, den nuvarande rollen och vem som tilldelade den
framför sig medan ändringen görs; den nya tilldelningen stämplas om med datum och
utförare. Att återkalla är att inaktivera, inte att radera — NFL-001 loggar
inloggningar och NFL-003 sätter en lagringstid, så en medarbetare som slutat
måste fortsätta gå att härleda ur loggen.

Båda åtgärderna vägrar ett fall och säger varför på kontrollen: **den siste
aktive behörighetsadministratören kan varken flyttas till en annan roll eller
inaktiveras.** Det är den enda utelåsning som bara leverantören skulle kunna
reparera, och NFÅ-005 finns just för att hålla leverantören utanför
Medlingsinstitutets behörighetsadministration.

**5 · Systeminställningar och annan administration.** §3.1 ger rollen
*"systemkonfiguration (exkl. behörigheter)"*. Fyra inställningar, och det
intressanta är att **två av dem avsiktligt inte går att ändra**:

- **Sessionens tidsgräns** (NFÅ-002) är konfigurerbar hela vägen: sätt den till
  tio minuter och startsidan säger tio, och inaktivitetsvarningen kommer efter
  åtta. Den vägrar ett värde över trettio — NFÅ-002:s eget tal — eftersom en
  längre gräns försvagar kravet i stället för att konfigurera det, och den säger
  det när den vägrar.
- **Bevakningsordstabellen** (FAI-004) underhålls inför en avtalsrörelse, och vad
  som står i den avgör vad AI-analysen markerar i varje protokoll som kommer in
  därefter. Det är systemets tydligaste fall av en administratörsinställning med
  synlig effekt på en handläggares dag — och den *underhålls*, inte bara visas:
  §4.1 kallar tabellen *"fördefinierad **och** anpassningsbar"*, och båda
  adjektiven är besvarade. Administratören lägger till och tar bort termer på
  fliken **Bevakningsord**, och Medlingsinstitutets egna fyra fördefinierade går
  inte att ta bort där, med skälet angivet på raden. En term som läggs till före
  avtalsrörelsen börjar markera text i varje protokoll som kommer in efter den.
- **Loggarnas lagringstid** visas med hänglås och sitt skäl. NFL-003 namnger
  denna roll i förbudet — *"ska inte kunna ändras eller raderas av vanliga
  användare **eller systemadministratörer**"* — så ett fält som en administratör
  kunde korta ned skulle motsäga den mening som skapade det.
- **IP-begränsningen för allmänhetens dator** (NFÅ-006) likaså: den ligger i
  Försäkringskassans drift av miljön, och ett fält här skulle antyda att MIIS
  kunde öppna sig självt.

Att visa de två fasta bredvid de två ändringsbara är hela poängen med panelen.
Fyra redigerbara rutor hade sagt att vi byggt ett inställningsformulär; detta
säger att vi läst meningarna.

Under inställningarna ligger **gallringsreglerna för personuppgifter**. D-004 är
ett ska-krav med två halvor — gallring *"i enlighet med Medlingsinstitutets
gallringsrutiner"* och *"möjlighet att definiera automatiska gallringsregler"* —
och det är den andra halvan som kräver en skärm. Varje regel anger vad som
gallras, vad som startar tiden och om det sker automatiskt. Tre går att ställa
in; den fjärde är loggarna och den är fast, med NFL-003:s egen mening på raden.
Ett inaktiverat användarkonto **anonymiseras i stället för att gallras**, eftersom
NFL-001 loggade inloggningarna och de posterna måste finnas kvar — det som
försvinner är namnet bakom dem, inte händelsen.

Administration är **fyra flikar, inte en sida** — inställningar, ändringsloggen,
händelseloggen och bevakningsordstabellen. Det är fyra olika arbetsuppgifter som
råkar tillhöra samma roll, och staplade fick de en administratör som kom för att
göra en av dem att bläddra förbi de tre andra. Var och en skrivs ändå ut: en flik
är ett visningsläge och papper har inget sådant.

Medlingsinstitutets femte punkt inbjuder till *"annan administration som
leverantören bedömer vara central för systemets förvaltning"*, och vårt svar är
**loggarna**. **Ändringsloggen** (FH-001) visar tidpunkt, användare, objekt, fält
**och både det gamla och det nya värdet** — skillnaden mellan en logg som
registrerar att något ändrats och en som kan återskapa vad det var, och det som
gör FAI-002:s garanti kontrollerbar i efterhand i stället för bara påstådd i
stunden. **Händelseloggen** (FH-002) bär övergripande händelser och de
notifieringar systemet skickat. NFL-004 efterfrågar åtkomst *"via ett
administrativt gränssnitt eller exportfunktion utan att behöva kontakta
leverantören"* — gränssnittet är denna vy, och den export som faktiskt fungerar
är utskriften, som bär Medlingsinstitutets märke och ett *Utskriftsdatum* på
samma sätt som institutets egna utskrifter.

### Visualiseringar

| Fil | Visar |
|---|---|
| `anvandare-behorigheter` | Användarregistret och den läsbara behörighetsmatrisen — steg 1–4 |
| `administration-loggar` | Systeminställningar, ändringslogg med gammalt och nytt värde, händelselogg, bevakningsord, gallring — steg 5 |
| `start-systemadministrator` | Rollens startsida och dess fullständiga meny |

### Användbarhet, effektivitet och tillgänglighet

**Användbarhet.** Registret besvarar rollens fyra frågor i den ordning de ställs,
och var och en är en kolumn i stället för en detaljvy att öppna. Rollbytet sker på
raden, så ingenting behöver hållas i minnet över en skärmgräns. En vägrad åtgärd
förklarar sig på kontrollen i stället för att misslyckas när den trycks — den
siste behörighetsadministratören är det fall en utvärderare kommer att pröva, och
det är det fall som är omhändertaget. Ingenting som inte bör vara redigerbart är
det: loggen anger med egna ord att den skrivs av systemet och inte kan redigeras
härifrån.

**Effektivitet.** Sortering på tid, användare eller objekt gör en tabell till de
flera frågor en administratör faktiskt ställer. Filtrering på roll och status
besvarar "vem kan fortfarande nå Administration" på två klick. En inställning som
vägras säger åt vilket håll den är fel och var gränsen går, så att administratören
inte behöver gissa sig till ett tillåtet värde. Utskriften får ut svaret ur
systemet utan supportärende.

**Tillgänglighet.** WCAG 2.1 AA är verifierat snarare än påstått: axe-core körs
över varje vy som varje roll vid varje ändring, för närvarande **0 avvikelser**,
utan horisontell rullning mellan 375 px och 1920 px. Två saker väger särskilt
tungt här: tabellerna är breda och rullar inuti en fokuserbar, namngiven region så
att en tangentbordsanvändare når dem alls (WCAG 2.1.1), och siffrorna är
tabellsiffror, så att en kolumn med tidsstämplar läses som en kolumn. Varje
interaktiv kontroll har synlig fokusmarkering och en träffyta på minst
44 × 44 px.

---

## Scenario 2 — Avtalsadministratör / Handläggare

*I prototypen: Anna Andersson, Analysenheten.*

### Uppgift och mål

Ett kollektivavtal ska **in i registret, hållas aktuellt och till sist
publiceras**. Det kommer in på två sätt: som ett helt nytt avtal utan tidigare
motsvarighet i MIIS, eller som ett undertecknat avtalsprotokoll — normalt en
inskannad PDF från någon av parterna — om ett avtal systemet redan har.

Målet är en korrekt, fullständig och spårbar registrering. Allt nedströms läser
det handläggaren skriver in: Konjunkturlönerapporten, Medlingsinstitutets
årsrapport, rapporten om avtalskonstruktioner och allmänhetens dator i
institutets egen entré.

### Arbetsflöde

Medlingsinstitutets fyra steg, i Medlingsinstitutets ordning.

**1 · Registrera ett nytt kollektivavtal.** Två vägar, eftersom det är två olika
uppgifter:

- **Ett helt nytt avtal registreras manuellt**, och vyn anger själv varför. §4.1
  drar gränsen: *"Helt nya avtal – som inte tidigare tecknats – ska alltid
  registreras manuellt."* AI-stödet läser ett inkommet
  protokoll *mot ett avtal MIIS redan har*; för ett förstagångsavtal finns
  ingenting att matcha mot, alltså ingenting att föreslå och inget källavsnitt
  att koppla ett förslag till. Formuläret är Bilaga 3:s Basfakta reducerat till
  det som måste vara sant för att ett avtal ska kunna existera alls — parterna,
  namnet, typen, sektorn, löptiden — plus sekretessmarkering och rapporturval.
  Det sparas som **ofullständigt och opublicerat** och listar vad som återstår
  före publicering, eftersom ett nytt avtal utan löneavtal under sig inte är en
  färdig registrering.
- **Ett inkommet protokoll** följer Medlingsinstitutets egna fem steg (§4.4):
  uppladdning, AI-analys, matchat avtal, löneavtal och allmänna villkor samt
  koppling av dokumentet. Flödet **avslutas på det avtal det registrerade**, inte
  på registret: efter fem steg med en enda registrering är det att tappa bort
  handläggaren att lämna ifrån sig en lista på sjutton och be dem leta rätt på
  den igen. OCR, bevakningsordsmarkering och matchning sker automatiskt. Varje
  AI-förslag är **källkopplat** — markera det och det avsnitt det lästs ur
  markeras i protokollet bredvid formuläret (FAI-001, FAI-004) — och vart och ett
  kräver ett uttryckligt godkännande eller avslag (FAI-002). Ett förslag i
  demonstrationen är avsiktligt felaktigt, så att den avvisande vägen *visas* i
  stället för att påstås.

**2 · Lägga till eller uppdatera information på avtalet.** FA-001 är att
registrera *och redigera* avtalsinformation, och **varje avsnitt som kan rättas
bär sin egen redigeringskontroll**. Ändringen sker på värdena själva i stället för
på en andra skärm: handläggaren tittar på den registrering som rättas, och ett
formulär någon annanstans hade tvingat dem att minnas vad den sade. Ändringen
skrivs till ändringsloggen med tidpunkt och användare (FH-001).

Två saker om *vad* som är redigerbart är design snarare än omfattning. Två fält
är avsiktligt låsta **och anger skälet på sin egen rad** — avtalstypen följer av
vilka löneavtal som finns under avtalet, och parterna är en relation in i
partsregistret där FA-006:s namnhistorik ligger, så att skriva om en part här
skulle bryta fusionshistoriken tyst. Och *Organisationsgrad* är aldrig ett
inmatningsfält: den räknas om medan de två siffrorna ovanför skrivs in, vilket är
demonstrationen av att den är härledd och inte lagrad.

Avtalsvyn är Bilaga F:s **Rapport 4, Huvudrapporten** — hela den, i **tre flikar**
i stället för en kolumn. *Avtalet* är vad avtalet är (identitet och de fyra
omfattningssiffror Medlingsinstitutet registrerar: *Anställda*, *Årsarbetare*,
*Fackmedlemmar*, *Medellön*, var och en daterad). *Löneavtal* är vad
avtalsrörelsen gav — raden per avtalsrörelse och lägstalönerna under den. *Frågor
och grupper* är vad den lämnade öppet: arbetsgrupper och *Särskilda frågor* i
§3.11:s tre numrerade platser. Det som varje sådan uppgift utförs *mot* ligger
utanför flikarna, i kolumnen bredvid: FR-012:s status, publiceringsläget,
Basfakta, märkesflaggorna och livscykeln. En flik som dolt dem hade fått
handläggaren att växla tillbaka för att se vad de redigerade. På papper är det ett
dokument igen — varje panel skrivs ut, flikraden gör det inte.

**3 · Hantera versioner eller ändringar.** Ett avtal i Medlingsinstitutets modell
har ingen versionslista — det har **en rad per avtalsrörelse**. FA-002 ger varje
omförhandling sitt eget löneavtal med egen konstruktion, eget löneutrymme och egen
kostnadsram, så jämförelsen mot förra avtalsrörelsen *är* tabellen, vilket är
skälet till att det är en tabell och inte en stapel paneler.

**Raden går att rätta.** Bilaga 1 §3.1 ger rollen verbet i egna ord —
*"Registrerar och redigerar avtalsinformation"*, med behörigheten *"Läsa,
skriva, redigera"* — och ett löneavtals konstruktion och löneutrymme är
avtalsinformation — dessutom de siffror som oftast blir fel, eftersom de läses ur
ett inskannat protokoll under tidspress. Konstruktion, löneutrymme, kostnadsram
och individgaranti ändras per avtalsrörelse, från ett formulär som namnger den
period det gäller. Löptiden ändras däremot på avtalet och inte där: en
avtalsrörelse kan inte gälla längre än avtalet den tillhör, och fältet säger det i
stället för att bara saknas. Vad som ändrats *inom* en period står i
ändringsloggen, med gammalt och nytt värde.

**4 · Publicera avtalet.** Publicering är en **åtgärd, med datum och person** —
inte en egenskap som följer av att registreringen är fullständig. Den ligger
bredvid den status den ändrar i stället för inuti redigeringen, eftersom att rätta
en uppgift och att släppa ett avtal är två olika handlingar med två olika följder,
och en rubrik över båda fick den första att se ut som om den kunde göra den andra.
Medlingsinstitutet avgör när ett avtal släpps, och till dess finns det i registret
men inte i det publika gränssnittet. Kontrollen erbjuds bara på en registrering
som är markerad fullständig och vars avtal är undertecknat; på en halvregistrerad
vägras den med angivet skäl, eftersom ett halvregistrerat avtal på allmänhetens
dator vore myndigheten som publicerar ett utkast. När avtalet väl är publicerat
kan handläggaren öppna det **som allmänheten ser det** — en publicering ingen kan
gå och titta på är ett påstående snarare än ett resultat.

### Visualiseringar

| Fil | Visar |
|---|---|
| `avtalsregister` | Avtalsregistret, med FR-012-status och fungerande filter, och båda vägarna att registrera |
| `registrera-uppladdning` | Steg 1 — uppladdningen och de fyra automatiska momenten |
| `registrera-protokoll` | Steg 2–5 — protokollet fastnålat bredvid formuläret |
| `registrera-protokoll-kallkoppling` | Ett AI-förslag källkopplat till sitt avsnitt |
| `ai-assistenten` | AI-stödet: att fråga registret, vad som körs på sidan, och vad som väntar på godkännande |
| `avtal-huvudrapport` | Ett avtal — Bilaga F:s Rapport 4, med flikar, och de fakta det läses mot bredvid |
| `rapporter-urvalsbild` | Rapporternas urvalsbild, i Medlingsinstitutets egen form — kriterierna avgränsar, och varje rapport ger ett dokument med urvalskriterierna överst |
| `start-avtalsadministrator` | Rollens startsida |

### Användbarhet, effektivitet och tillgänglighet

**Användbarhet.** Protokollet stannar bredvid formuläret medan handläggaren
bläddrar, så att kontrollera ett värde är en blick i stället för en rullning upp
och tillbaka — den enskilt största tidsåtgången i dagens arbetssätt. Ett fälts
bredd säger vad som hör hemma i det: ett datum eller en procentsats är kort, ett
namn bredare, fritext hela raden. Enheten står i etiketten och rutan innehåller
ett rent tal (*Löneutrymme (%)* med `3,4`), så ingenting behöver avgöras om
tecknet och ingenting lagras som en rapport inte kan summera. Kontroller som inte
är tillgängliga anger varför på sig själva i stället för att misslyckas tyst.

**Effektivitet.** Fem steg, Medlingsinstitutets egna, utan påhittade tillägg.
AI-stödet förifyller det som går att läsa och markerar de bevakningsord
Medlingsinstitutet satt före avtalsrörelsen, så att handläggarens uppmärksamhet
går till de skrivningar som betyder något i stället för till avskrift. En
ofullständig registrering går att spara och ger en påminnelse, så att ett protokoll
som kommer in med en lucka inte blockerar kön. Konjunkturlönerapporten skrivs ut
från en vy som redan vet vilka avtal som exporterats tidigare, så att ingenting
levereras två gånger.

**Tillgänglighet.** WCAG 2.1 AA är ett krav (NFUI-003) och är verifierat snarare
än påstått: axe-core körs över varje vy som varje roll på båda språken vid varje
ändring, för närvarande **0 avvikelser**, utan horisontell rullning någonstans
mellan 375 px och 1920 px. Varje interaktiv kontroll har synlig fokusmarkering och
en träffyta på minst 44 × 44 px. FR-012:s färgkodning bär alltid en form och ett
ord utöver färgen, så att ett avtals status överlever gråskala, projektor och
färgblindhet. Varje ikon är dekorativ i tillgänglighetsmening, med betydelsen i
etiketten bredvid. Typsnittet är Public Sans, ritat för myndighetsformulär och
egenhostat så att NFA-001:s förbud mot externa molnberoenden håller, med
tabellsiffror som håller kolumner av datum och procenttal i linje.

---

## Scenario 3 — Allmänhetens dator

*I prototypen: en namnlös besökare, utan konto.*

### Uppgift och mål

En besökare kommer till Medlingsinstitutets lokaler — en journalist som
kontrollerar ett påstående, en student, en anställd som vill veta vilket avtal som
gäller för hen. De vill veta **vilket avtal som gäller för en viss bransch eller
ett visst avtalsområde, vilken period det löper på och om det har omförhandlats**,
och kunna ta med sig svaret.

De har inget konto, ingen utbildning och inget andra försök. Detta är den roll där
gränssnittet måste vara rätt första gången, och den roll vars behov minst liknar
handläggarens.

### Arbetsflöde

Medlingsinstitutets fyra steg, i Medlingsinstitutets ordning.

**1 · Söka fram ett avtal.** Allmänhetens dator öppnar direkt i den publika vyn.
Det finns ingen inloggning och ska inte finnas: NFÅ-001 lägger personalens
autentisering i Försäkringskassans IdP med EFOS-kort, och NFÅ-006 begränsar publik
åtkomst till Medlingsinstitutets egen IP-adress — maskinen i rummet *är*
behörigheten. Vyn är visuellt märkt som publik, så att ingen tar den för det
interna systemet.

Den första kontrollen är ett enda sökfält. Besökaren skriver det de kom in med —
en bransch, ett avtalsområde, ett förbund, en arbetsgivare — och listan avgränsas
medan de skriver (FR-001, FR-003). Ingenting måste väljas ur en lista först, och
ingenting måste tryckas.

Under det kommer **branschen först**, eftersom Medlingsinstitutet nämner den först
och eftersom en besökare tänker i branscher långt innan de tänker i
arbetsgivarorganisationer. Därefter **Medlingsinstitutets egna tre kriterier** —
arbetsgivarorganisation, arbetstagarorganisation, avtal — avlästa ur urvalsbilden
för *Avtal – Allmänheten* i Bilaga F, för den besökare som vet exakt vilket avtal
de vill ha. Ett femte avgränsar till de avtal som gällde vid en viss tidpunkt
(FA-020), vilket är den fråga en besökare som kontrollerar ett tidigare år
ställer.

**2 · Avgränsa resultatet.** Varje valt kriterium blir en borttagbar markering med
antal, och tabellen avgränsas på riktigt — ett filter som ändrar markeringarna och
låter raderna stå kvar är en kontroll som ser levande ut och inte är det. Varje
fält som lämnats som *Alla* betyder att det inte avgränsats, vilket resultatet
anger i en mening i stället för att lämna läsaren att sluta sig till populationen.
Ett tomt resultat är en mening, aldrig en tom tabell med rubrikrad.

Två regler avgör vad som alls finns i listan. Bara **publicerade** avtal finns här
— publicering är Medlingsinstitutets egen åtgärd, och en opublicerad registrering
finns i registret men inte i entrén. Och ett **sekretessmarkerat** avtal listas
fortfarande och räknas fortfarande (D-002): att ta bort det skulle säga besökaren
att det inte finns, vilket är ett annat och felaktigt svar. Det som hålls inne är
detaljerna.

**3 · Läsa avtalet.** Avtalsnamnet är en länk, och bakom den ligger Bilaga F:s
**Rapport 1** i sin helhet: parter, avtalsområde, bransch, teckningsdatum,
löptiden, en rad per avtalsrörelse, uppsägning och prolongering (FA-015, FA-016)
samt kopplade protokoll och avtalstryck.

Inga lönesiffror. Kostnadsramen och löneutrymmet är Medlingsinstitutets
arbetsmaterial; detta är publiceringen, och Rapport 1:s egen uppräkning är där den
slutar. Ett sekretessmarkerat avtal har **ingen sida alls** i stället för en sida
med värdena borttagna: FR-011 handlar om vad som får lämna huset, och ett värde
som döljs med CSS finns fortfarande i dokumentet.

**4 · Öppna och ladda ned.** Två exporter, och **båda fungerar**:

- **Utskriften** ger ett dokument snarare än en skärmbild — Medlingsinstitutets
  märke och ett *Utskriftsdatum* på samma sätt som Bilaga F:s utskrifter, med
  navigation, sidhuvud och varje anmärkning borttagen. Varje webbläsare kan spara
  det som PDF.
- **Nedladdningen** skriver en verklig CSV-fil ur registreringen på skärmen, i
  webbläsaren, så att den fungerar utan server bakom sig (FR-013 i den skala ett
  enskilt avtal kräver). Semikolonseparerad och med BOM, eftersom besökaren
  kommer att öppna den i Excel med svenska språkinställningar.

Det som avsiktligt *inte* erbjuds är nedladdning av själva protokoll-PDF:en: de
filerna ligger i ett dokumentarkiv prototypen inte har, och en knapp som gav en
tom eller påhittad PDF vore sämre än att namnge filen och ange varifrån den kommer.
Besökarens uppgift slutar med att svaret följer med hem, och en streckad knapp
hade avslutat det bedömda scenariot på en kontroll som inte gör något.

### Visualiseringar

| Fil | Visar |
|---|---|
| `allmanheten` | Den publika vyn: fritext, bransch och Medlingsinstitutets egna kriterier, markeringar och resultat — steg 1–2 |
| `allmanheten-avtal` | Ett avtal som det släpps till allmänheten — Bilaga F:s Rapport 1 — med utskrift och nedladdning |

### Användbarhet, effektivitet och tillgänglighet

**Användbarhet.** En fråga, ett fält, besvarat medan man skriver. De exakta
kriterierna ligger under för den besökare som har dem, och branschen kommer först
eftersom det är så frågan brukar komma. Vyn anger vad den är — en publik vy i
Medlingsinstitutets lokaler — så att den aldrig förväxlas med det interna
systemet. Där något hålls inne säger gränssnittet det i stället för att lämna en
lucka: ett tomt fält läses som saknad uppgift och ett markerat som undanhållen
uppgift, och det är två olika fakta om samma avtal.

**Effektivitet.** Ingen inloggning, ingen guide, inga omladdningar: maskinen är
behörigheten och listan avgränsas medan besökaren skriver. Hela uppgiften — hitta,
avgränsa, läsa, ta med — är fyra handlingar och lämnar aldrig två vyer. Svaret går
ut på ett tryck, i den av de två formerna besökaren behöver.

**Tillgänglighet.** Detta är rollen med den bredaste användarkretsen och det minsta
stödet, så AA-garantierna väger tyngst här: verifierade med verktyg vid varje
ändring, nåbara med tangentbord genomgående, synlig fokusmarkering, träffytor på
44 × 44 px, och ingen betydelse buren av enbart färg — FR-012:s status är en färg,
en form *och* ett ord. Datum skrivs enligt ISO på båda språken och siffror är
tabellsiffror, så att en kolumn med perioder läses som en kolumn. Sidan är läsbar
vid 375 px, vilket har betydelse eftersom maskinen i entrén inte nödvändigtvis är
en bred skärm.

---

## Vad detta avsnitt inte ska påstå

Tre saker, angivna här så att de inte påstås av misstag ovan.

**Prototypen har ingen databas, ingen identitetsleverantör och ingen AI-modell.**
Registreringsflödet, AI-förslagen och loggarna är verkliga gränssnitt över
exempeldata. Allt nedströms om en verklig backend — migrering, integrationstester,
produktionsverifiering — är leveransarbete och beskrivs i avsnittet
*Arbetsprocesser och metoder* i stället.

**De åtta rollerna är byggda; tre presenteras.** Bilaga 1 §3.1 definierar åtta,
NFÅ-003 kräver dem alla, och prototypen har dem alla med läs- och skrivbehörighet
per vy. Medlingsadministratören, medlaradministratören och statistikanvändaren är
värda att visa som bevis för att systemet är komplett — men de tre ovan är vad
detta kriterium bedöms på, och de går först. Behörighetsadministratören är inte en
fjärde uppvisning: §3.5 lägger det arbetet inuti Scenario 1, och där utförs det,
som den roll §3.1 ger det till.

**Det gamla systemet är inte förebild för det nya.** Avropsförfrågan §18.3 är
uttrycklig: *"Det gamla systemet ska leverantören inte utgå ifrån vid utvecklingen
av det nya systemet."* Där denna prototyp följer Medlingsinstitutets befintliga
material följer den **informationen** — rapporternas urvalskriterier, femstegsflödet,
fältdefinitionerna — och inte W3D3:s gränssnitt.
