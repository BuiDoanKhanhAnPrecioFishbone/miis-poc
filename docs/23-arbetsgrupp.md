# §3.1 Arbetsgrupp — svensk svarstext

*Framtaget 2026-08-24, mot Bilaga 2 §3.1. **Detta är den text som lämnas in.***

Medlingsinstitutets krav, i sin helhet:

> *"Ramavtalsleverantören ska tillsätta en dedikerad arbetsgrupp för uppdragets
> genomförande. Leverantören ska beskriva hur denna arbetsgrupp kommer att se ut
> och vilka olika kompetenser som respektive medlem tillför projektet.
> Konsulterna i arbetsgruppen ska namnges och deras CV bifogas. Timkostnaden per
> konsult/kompetens ska anges i bilaga 4, Prisformulär. I bilaga 4 ska även den
> procentuella fördelningen av respektive konsulttyp anges."*

Detta är ett bedömt tilldelningskriterium med **max 500 000 kr i mervärde**
(Avropsförfrågan §16), på samma femgradiga skala och med samma bedömningsgrunder
som övriga: *relevans, tydlighet, konkretionsgrad, genomförbarhet* samt
förståelse för uppdragets förutsättningar och behov.

> **Två platshållare, och de är inte våra att fylla i:** konsulternas namn med
> bifogade CV (nedan markerade `[Namn]` och `[Bil nr]`), samt timpriser och
> procentuell fördelning, som enligt §3.1 anges i Bilaga 4.

---

## 1. Så ser arbetsgruppen ut

**Sex personer, varav fyra på heltid genom hela Steg 1.** Gruppen är dimensionerad
efter uppdraget snarare än efter vad som ser imponerande ut: Steg 1 är ungefär sex
månader från avtal till 2027-04-01, det är tretton tvåveckorsetapper, och ett
projekt med fast slutdatum tål varken en underbemannad kärna eller ett team som
lägger mer tid på samordning än på leverans.

**Samma personer under hela uppdraget.** Ett projekt på sex månader med ett
slutdatum som styrs av avtalsrörelsen har ingen upplärningstid att ge bort. Byte
av person i gruppen sker bara vid frånvaro vi inte råder över, och då med
överlämning och med Medlingsinstitutets kännedom.

| Roll | Omfattning i Steg 1 | Namn | CV |
|---|---|---|---|
| Uppdragsledare | Heltid | `[Namn]` | `[Bil nr]` |
| Lösningsarkitekt | Heltid | `[Namn]` | `[Bil nr]` |
| Systemutvecklare, senior | Heltid | `[Namn]` | `[Bil nr]` |
| UX-designer | Heltid t.o.m. februari, därefter deltid | `[Namn]` | `[Bil nr]` |
| Datamigrationsspecialist | Deltid, tyngdpunkt december–mars | `[Namn]` | `[Bil nr]` |
| Testledare | Deltid, tyngdpunkt februari–mars | `[Namn]` | `[Bil nr]` |

Den procentuella fördelningen per konsulttyp anges i Bilaga 4, enligt §3.1.

---

## 2. Vad varje medlem tillför

### Uppdragsledare

Leder projektmötena gemensamt med Medlingsinstitutets projektledare (§2.2) och är
nåbar mellan dem som bollplank för frågor som inte kan vänta (§2.3). Håller
etapplaneringen mot kravprioriteringen, så att det som eventuellt glider är ett
Steg 2-moment och inte registreringen av ett löneavtal.

**Kompetensen som krävs:** ledning av tidsstyrda utvecklingsuppdrag i offentlig
sektor, där slutdatumet inte är förhandlingsbart och leveransen ska
acceptanstestas av beställarens egna användare (§9.2). Erfarenhet av avrop under
ramavtal och av att arbeta mot en beställare som själv äger kravspecifikationen.

**CV:t ska visa:** minst ett genomfört uppdrag med fast slutdatum hos svensk
myndighet, och rollen som gemensam mötesledare tillsammans med beställarens
projektledare.

### Lösningsarkitekt

Ansvarar för den arkitektur som gör §3.7:s ägande verkligt. Medlingsinstitutet
får systemet fullt ut — källkod, dokumentation, databasstruktur, integrationer
och konfigurationer — *"med rätt att fritt använda och vidareutveckla det utan
beroende av en enskild leverantör"*. Det är ett arkitektoniskt åtagande, och tre
beslut bär det: ett rent domänlager som inte importerar något ramverk, en enda
datasöm, och inga externa molnberoenden (NFA-001 namnger Google Cloud särskilt).

Äger också gränssnittet mot Försäkringskassans IT (§2.5): autentisering över SAML
2.0 mot EFOS-IdP:n (NFÅ-001), IP-begränsningen för allmänhetens dator (NFÅ-006),
loggarnas lagringstid som systemet inte får kunna korta (NFL-003) och
kontinuitetsplanen (L-001).

**Kompetensen som krävs:** systemarkitektur med tydlig lagerindelning, SAML 2.0
och federerad inloggning, samt erfarenhet av att lämna över ett system till en
beställare som ska förvalta det själv.

**CV:t ska visa:** en integration mot federerad inloggning i offentlig sektor, och
ett system överlämnat till beställarens egen förvaltning.

### Systemutvecklare, senior

Bygger kärnan: avtals- och partsmodellen, registrering av löneavtal och allmänna
villkor, partsregistret med namnhistorik och fusioner (FA-006, FP-001),
dokumentuppladdning och koppling, sammansatt sökning med historisk återskapning
(FR-002, FH-003), Bilaga F:s rapporter med sina egna urvalsbilder, och medling.

Ansvarar också för de kvalitetsgrindar som körs vid varje ändring och som
beskrivs i avsnittet *Arbetsprocesser och metoder*: enhetstester över domänlagret,
arkitekturregler i lint, typkontrollerade översättningar och referensintegritet
vid bygge.

**Kompetensen som krävs:** senior fullstackutveckling i den föreslagna stacken,
med vana att skriva regler som testkod snarare än som dokumentation.

**CV:t ska visa:** verksamhetssystem med regeltyngd domänlogik, och arbete i team
där tester och statisk analys stoppar en leverans.

### UX-designer

Äger det som detta avrop väger tyngst: de rollbaserade användarscenarierna och
gränssnittet. Ansvarar för att WCAG 2.1 AA är ett verifierat krav (NFUI-003) och
inte en ambition — svepet körs över varje vy som varje roll vid varje ändring.

Arbetar mot alla åtta roller i §3.1, med tyngdpunkt på de tre som avropet bedömer:
systemadministratören, avtalsadministratören och allmänhetens dator. Den sista är
den svåraste och den som skiljer lösningarna åt: en besökare utan konto, utan
utbildning och utan andra försök.

**Kompetensen som krävs:** interaktionsdesign för myndighetssystem, praktisk
tillgänglighet enligt WCAG 2.1 AA, och förmåga att skilja handläggarens gränssnitt
från allmänhetens när underlaget är detsamma.

**CV:t ska visa:** ett publikt myndighetsgränssnitt granskat mot WCAG 2.1 AA, och
arbete med flera användarroller i samma system.

### Datamigrationsspecialist

Ansvarar för migreringen från W3D3 (NFM-001, NFM-003) och, i Steg 2, av
Access-databasen (NFM-002). Analysen inleds i den första etappen och migreringen
körs upprepat från december — inte en gång i mars. En migrering som prövas först i
slutet av ett projekt med fast slutdatum är det vanligaste sättet ett sådant
projekt missar sitt datum.

Verifierar datakvalitet och fullständighet enligt T-007 innan
produktionsverifieringen efter driftsättning.

**Kompetensen som krävs:** migrering av verksamhetsdata mellan system med olika
informationsmodeller, och arbete med data som innehåller personuppgifter under
gallringsregler (D-004).

**CV:t ska visa:** minst en genomförd migrering med verifierad datakvalitet, och
hantering av sekretessklassad eller personuppgiftsbärande data.

### Testledare

Ansvarar för Bilaga 1 kapitel 9 — T-001 till T-008 — och för att acceptanstestet
enligt §9.2 sker med **Medlingsinstitutets egna användare och omfattar samtliga
användarroller**, inte som en demonstration för en projektgrupp. Håller
kravstatusen som visas vid varje etappgenomgång: vilka ska-krav som är uppfyllda,
vilka som pågår och vilka som inte påbörjats.

Ansvarar för att varje ska-krav verifieras och godkänns av Medlingsinstitutet före
slutleverans (T-006), vilket kräver en vandring från kravet till gränssnittet —
och för att den vandringen går att göra, eftersom kravspårningen är inbyggd i
produkten i stället för att underhållas vid sidan av.

**Kompetensen som krävs:** testledning i offentlig upphandling där beställaren
formellt godkänner varje ska-krav, och praktisk erfarenhet av acceptanstest med
verksamhetens egna användare.

**CV:t ska visa:** ett uppdrag där beställaren själv genomfört acceptanstest per
användarroll, och kravverifiering som underlag för leveransgodkännande.

---

## 3. AI-stödet, och varför det inte är en egen roll

§4.1:s fyra AI-funktioner byggs av lösningsarkitekten och systemutvecklaren
gemensamt, mot Försäkringskassans modelltjänst. Vi föreslår ingen särskild
AI-konsult, och det är ett medvetet val snarare än en besparing.

AI-stödet ligger **inte på den kritiska linjen**. §4.1 kräver att varje förslag
granskas och godkänns av en handläggare innan något sparas, så den manuella vägen
måste finnas för var och en av de fyra funktionerna oavsett — AI-stödet förkortar
arbetet i stället för att möjliggöra det. Arbetet är därför integration mot en
tjänst någon annan driver, plus det gränssnitt som gör granskningen möjlig, och
båda ligger inom gruppens kompetens.

En separat AI-roll hade signalerat att funktionen är ett eget spår som kan glida
utan att resten påverkas. Den läsningen vore fel: AI-stödet är integrerat i
registreringsflödet, och det är där det ska byggas.

---

## 4. Hur gruppen arbetar med Medlingsinstitutet

Beskrivs i sin helhet i avsnittet *Arbetsprocesser och metoder* (§3.4). I korthet:
uppstartsmöte och tvåveckovisa genomgångar i Medlingsinstitutets lokaler på
Drottninggatan 89 (§2.1, §3.3), veckovisa korta avstämningar digitalt, och
uppdragsledaren nåbar däremellan.

**Medlingsinstitutet beslutar** om kravprioritering, vad en etapp ska innehålla,
vad som räknas som godkänt, och varje sakfråga om kollektivavtal och medling. Vi
frågar i stället för att anta — domänen är Medlingsinstitutets, och en leverantör
som gissar sig till vad *avtalskonstruktion* eller *informationsbegränsning*
betyder bygger ett system som måste rättas efter leverans.

**Vi beslutar** om teknisk utformning, och vi skriver ned varför, i koden.

---

## Vad detta avsnitt inte ska påstå

**Gruppen är dimensionerad för Steg 1.** Steg 2 planeras gemensamt med
Medlingsinstitutet enligt §3.2, och bemanningen för det avtalas då. Att här utlova
en bemanning för ett steg vars innehåll ännu inte är överenskommet vore ett
åtagande utan innehåll.

**Timpriser och procentuell fördelning anges i Bilaga 4**, enligt §3.1:s egen
hänvisning. De står inte här, och de två uppgifterna hör ihop: en fördelning utan
pris säger ingenting om vad uppdraget kostar.
