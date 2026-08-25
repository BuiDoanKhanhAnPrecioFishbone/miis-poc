# §3.4 Arbetsprocesser och metoder — svensk svarstext

*Svensk återgivning av `19-arbetsprocesser.md`, framtagen 2026-08-22. **Detta är
den text som lämnas in.** Den engelska versionen är arbetsunderlag; vid skillnad
gäller den svenska.*

Medlingsinstitutets krav, i sin helhet:

> *"Ramavtalsleverantören ska ha relevanta arbetsprocesser och metoder för att
> utföra uppdraget och dess olika delar. Ramavtalsleverantören ska beskriva hur
> uppdraget avses utföras; **vilken arbetsprocess/metod** som kommer att
> användas, **hur ni avser samarbeta med Medlingsinstitutet** samt en
> **övergripande tidplan** för uppdragets olika delar."*

Tre saker, alltså tre avsnitt. Detta är ett **ska-krav**, inte ett bedömt
kriterium — §16 poängsätter enbart de rollbaserade scenarierna — så ribban är
*trovärdigt och fullständigt* snarare än *imponerande*. Det som gör det
trovärdigt är att den metod som beskrivs här är den metod detta svar tagits fram
med, och att underlaget går att kontrollera: `docs/16-verification.md` kopplar
varje påstående till ett kommando som körs.

> **Två platshållare återstår**, båda markerade `[…]`: de namngivna konsulterna
> med CV hör till §3.1, och timuppskattningarna hör till Bilaga 4.

---

## 1. Arbetsprocess och metod

### Iterativ leverans i tvåveckorsetapper

Uppdraget levereras i **tvåveckorsetapper**, där var och en avslutas med
programvara Medlingsinstitutet kan öppna och använda — inte med en statusrapport.
Steg 1 är knappt sex månader från avtal till slutdatumet 1 april 2027, och en
plan som visar Medlingsinstitutet systemet en enda gång, nära slutet, ger dem
ingen möjlighet att korrigera kursen medan det fortfarande är billigt att göra
det.

Varje etapp avslutas med:

- ett **körande bygge på en adress** Medlingsinstitutet kan klicka igenom, med
  etappens kravnummer synliga på de vyer som uppfyller dem;
- en **genomgång** med Medlingsinstitutet på Drottninggatan 89 (se §2), där
  etappen demonstreras och nästa planeras;
- en uppdaterad **kravstatus** — vilka ska-krav som är uppfyllda, vilka som pågår
  och vilka som inte påbörjats.

Backloggen är Bilaga 1:s egna kravtabeller. Vi formulerar inte om
Medlingsinstitutets krav med egna ord och bygger sedan mot omformuleringen:
kravnumret är arbetsenheten, så att *FA-002 är klart* betyder samma sak för
Medlingsinstitutet som för oss.

### Kravspårbarhet, inbyggd i produkten

Varje vy bär numren på de krav den uppfyller, bakom en växlingsknapp som är
avstängd som standard. T-006 kräver att *"samtliga ska-krav ska verifieras och
godkännas av Medlingsinstitutet innan slutleverans"*, och ett sådant godkännande
kräver en vandring från kravet till gränssnittet. Det lager som gör vandringen
möjlig är en del av systemet i stället för ett dokument som underhålls vid sidan
av, och kan därför inte bli inaktuellt.

**Prototypen som medföljer detta svar arbetar redan så**, och skärmbilderna i
avsnittet om rollscenarier genereras ur det körande bygget — aldrig omritade,
aldrig retuscherade.

### Kvalitetsgrindar som körs vid varje ändring

Ingen testfas på slutet. Var och en av dessa körs vid varje ändring och stoppar
en sammanslagning om den fallerar:

| Grind | Vad den skyddar |
|---|---|
| **Enhetstester över domänlagret** | Reglerna — behörighet, status, rapporturval, publicering, sökbyggarens egen sammansättning, AI-stödets gränser. För närvarande **362 tester** |
| **Arkitekturregler i lint** | Datasömmen. En import av datalagret från en vy stoppar bygget, så att bytet från exempeldata till databas förblir osynligt för gränssnittet |
| **Typkontrollerade översättningar** | Det andra språket kan inte tyst förfalla: en saknad eller felstavad nyckel stoppar kompileringen |
| **Referensintegritet vid bygge** | En hängande referens i data stoppar bygget i stället för att visa en tom vy |
| **WCAG 2.1 AA-svep** | NFUI-003, som grind snarare än granskning. `npm run audit` kör axe-core över varje vy som varje roll och avslutas med felkod vid minsta fynd. För närvarande **0 avvikelser**, och ingen horisontell rullning mellan 375 px och 1920 px |
| **Ingen kravtext i produktvyn** | Samma kommando genomsöker varje vy med kravmärkningen avstängd efter kravnummer, §-hänvisningar och bilagenamn. Ett system Medlingsinstitutet ska använda argumenterar inte med sin användare om kravspecifikationen. För närvarande **0** |
| **Namngivna scenarier, körda mot bygget** | `docs/21-definition-of-done.md` innehåller tolv, skrivna så att ett fel är entydigt — att varje åtgärd avslutas på det den skapade, att varje härledd räknare rör sig, att en utskrift är ett dokument, att sekretessmarkerad information inte levereras alls |
| **Skärmbildsomgång** | Anbudsdokumentet och det körande systemet kan inte glida isär |

`docs/16-verification.md` kopplar Medlingsinstitutets kapitel 9 — T-001 till
T-008 — till vad som är verifierat i dag och vad som är leveransarbete, krav för
krav, och är tydlig med vilket som är vilket.

### Arkitektur som gör Medlingsinstitutets ägande verkligt

§3.7 ger Medlingsinstitutet systemet fullt ut — källkod, dokumentation,
databasstruktur, integrationer och konfigurationer — *"med rätt att fritt använda
och vidareutveckla det utan beroende av en enskild leverantör"*. Det är ett
arkitektoniskt åtagande, inte ett licensrättsligt, och tre beslut bär det:

- **Ett rent domänlager som inte importerar något.** Medlingsinstitutets regler —
  de åtta rollerna och deras behörigheter, de sju avtalskonstruktionerna,
  FR-012:s statusar, rapporternas urvalskriterier — ligger i kod som inte beror på
  något ramverk och ingen leverantör. Den överlever ett byte av båda.
- **En enda datasöm.** Varje läsning går genom ett lager, så att lagringen under
  kan bytas ut utan att en enda vy berörs.
- **Inga externa molnberoenden.** NFA-001 namnger Google Cloud särskilt;
  prototypen hostar sitt typsnitt själv och har inget CDN, ingen extern
  typsnittstjänst och ingen tredjepartsanalys. Ingenting lämnar
  Medlingsinstitutets miljö vare sig vid bygge eller vid körning.

### Definition av klart

En etapp är klar när kravets acceptans går att demonstrera i det körande
systemet, testerna för dess regler finns och passerar, tillgänglighetssvepet är
rent, ändringsloggen registrerar det, och Medlingsinstitutet har sett det.
"Kodklart" är inte ett läge vi rapporterar.

---

## 2. Samarbete med Medlingsinstitutet

### Arbetsgruppen

En dedikerad arbetsgrupp enligt §3.1, namngiven i svaret med bifogade CV:
`[namngivna konsulter och CV — §3.1]`. Samma personer under hela uppdraget; ett
projekt på sex månader med fast slutdatum tål inte personalomsättning.

Medlingsinstitutets projektledare och vår **leder projektmötena gemensamt**
(§2.2), och vår är nåbar mellan dem som bollplank för frågor som inte kan vänta
(§2.3).

### Mötesstruktur

| När | Vad | Var |
|---|---|---|
| Projektstart | **Uppstartsmöte** — arbetsgruppen presenteras, miljöer överenskomna med Försäkringskassan, backloggen gås igenom mot Bilaga 1 | Drottninggatan 89 (§2.1) |
| Varannan vecka | **Demonstration och planering** — etappen visas i det körande systemet, nästa etapp överenskoms, kravstatus uppdateras | Drottninggatan 89 (§3.3) |
| Varje vecka | **Kort avstämning** — framdrift, hinder, beslut som behövs | Digitalt (§3.3) |
| Vid behov | **Bollplank** för Medlingsinstitutets projektledare | Digitalt eller per telefon (§2.3) |

Samtliga projektmöten är fysiska och i Medlingsinstitutets lokaler, enligt §2.1
och §3.3. Kortare avstämningar och frågor sker digitalt, vilket är vad §3.3
medger och vad som gör en tvåveckorstakt praktiskt möjlig.

### Vem beslutar vad

Uttryckt tydligt, eftersom ett oklart svar här kostar veckor senare:

- **Medlingsinstitutet beslutar** om kravprioritering, vad en etapp ska innehålla,
  vad som räknas som godkänt, och varje sakfråga om kollektivavtal och medling. Vi
  frågar i stället för att anta — domänen är Medlingsinstitutets, och en
  leverantör som gissar sig till vad *avtalskonstruktion* eller
  *informationsbegränsning* betyder bygger ett system som måste rättas efter
  leverans.
- **Vi beslutar** om teknisk utformning, och vi skriver ned varför, i koden. Varje
  icke-uppenbart beslut i den medföljande prototypen bär sitt skäl där nästa
  utvecklare hittar det — vilket är det som gör §3.7:s *vidareutveckla* möjligt
  för någon som inte var med.

### Samverkan med Försäkringskassans IT

§2.5 kräver det, och fyra krav är beroende av det, så det inleds under de första
veckorna i stället för vid integrationstillfället:

- **NFÅ-001** — autentisering över SAML 2.0 mot Försäkringskassans EFOS-IdP.
  Prototypen har avsiktligt **ingen inloggningsvy**, eftersom en sådan skulle
  påstå att vi byggt identitetsleverantören.
- **NFÅ-006** — IP-begränsningen för allmänhetens dator, som ligger i driftmiljön
  och inte i MIIS.
- **NFL-003** — loggarnas lagringstid, som systemet inte får kunna korta.
- **L-001** — kontinuitetsplan samt rutiner för säkerhetskopiering och
  återläsning.

Vi föreslår ett gemensamt tekniskt möte med Försäkringskassans IT-avdelning under
de första två veckorna, och en stående kanal därefter.

### Den tillfälliga utvecklingsmiljön

§2.6: om Försäkringskassans miljö inte är tillgänglig vid projektstart sätter vi
upp och driver en tillfällig utvecklingsmiljö så att starten inte fördröjs. Så
snart Försäkringskassans miljö är tillgänglig **flyttas all utveckling dit och
alla uppgifter som kan härledas till Medlingsinstitutet raderas** från den
tillfälliga. Kostnaden prissätts separat i Bilaga 4 och ingår inte i det fasta
priset, enligt §2.6.

### Acceptanstest

Enligt §9.2 sker acceptanstest med **Medlingsinstitutets egna användare och
omfattar samtliga användarroller** — inte som en demonstration för en
projektgrupp. Vi tillhandahåller UAT-miljön (T-005), Medlingsinstitutet
verifierar och godkänner varje ska-krav före slutleverans (T-006), och migreringen
verifieras avseende datakvalitet och fullständighet (T-007) före
produktionsverifiering efter driftsättning (T-008).

---

## 3. Övergripande tidplan

De datum som ligger fast, och allt annat följer av dem: tilldelningsbeslut
**2026-09-08**, sista dag för överprövning **2026-09-22**, avtal efter
avtalsspärren, och **Steg 1 färdigt före 2027-04-01** (§3.2).

Det är ungefär **sex månader**, eller tretton tvåveckorsetapper. Planen nedan
utgår från en start i början av oktober 2026.

### Steg 1 — fram till 2027-04-01

| Period | Del av uppdraget | Avslutas med |
|---|---|---|
| **Okt 2026, vecka 1–2** | **Uppstart.** Uppstartsmöte, arbetsgrupp på plats, miljöer överenskomna med Försäkringskassan, backlogg mot Bilaga 1:s kravtabeller, **migreringsanalys av W3D3 inleds** | Överenskommen etappplan; beslut om miljö enligt §2.6 |
| **Okt–dec 2026** | **Kärnregistrering.** Avtals- och partsmodellen, registrering av löneavtal och allmänna villkor, partsregistret med namnhistorik och fusioner, dokumentuppladdning och koppling, ändrings- och händelseloggarna | Registreringsflödet som §4.4 beskriver det, hela vägen, på verkliga datastrukturer |
| **Nov 2026–feb 2027** | **AI-stöd**, parallellt. §4.1:s fyra funktioner mot Försäkringskassans modelltjänst | Varje funktion demonstrerad med godkännande och avslag, enligt FAI-002 |
| **Jan–feb 2027** | **Sökning, rapporter och medling.** Sammansatt sökning med historisk återskapning, Bilaga F:s rapporter med sina egna urvalsbilder, medlingsärenden och partsmöten | Rapporter som producerar Medlingsinstitutets egna utskrifter |
| **Dec 2026–mar 2027** | **Migrering** från W3D3, i upprepade provkörningar i stället för en gång på slutet (NFM-001, NFM-003) | Migrering verifierad avseende kvalitet och fullständighet (T-007) |
| **Mar 2027** | **Acceptanstest och driftsättning.** UAT med Medlingsinstitutets egna användare i samtliga roller, rättningar, driftsättning, produktionsverifiering | Skriftligt leveransgodkännande (§14) |

**Steg 1 levererar det avtalsrörelsen behöver**: registrering, sökning och
rapportering för löneavtal och allmänna villkor, samt medling. Det är
Medlingsinstitutets egen indelning i §1.3, inte vår.

### Steg 2 — från hösten 2027

Planeras gemensamt med Medlingsinstitutet, enligt §3.2. Pensionsavtal,
försäkringar och övriga avtalstyper; migrering av Access-databasen (NFM-002);
extern åtkomst för medlare via Bank-ID. Prissätts som en uppskattning av timmar
och timpriser i Bilaga 4.

### Steg 3 — optionen

Support, förvaltning och vidareutveckling, 2 år med förlängning 2 + 2 år, enligt
§15 i avropsförfrågan. Fast pris för support och förvaltning; utveckling till
samma timpriser som i projektet.

### De risker som kan rubba 1 april 2027, och hur metoden hanterar dem

Namngivna, eftersom en plan som inte namnger dem är en plan ingen har prövat.

**Slutdatumet är inte förhandlingsbart — avtalsrörelsen kommer inte att flytta
sig.** Skyddet är Medlingsinstitutets egen tvåstegsindelning, använd som den var
avsedd: vi levererar i kravprioriteringens ordning, så att det som eventuellt
glider är ett Steg 2-moment och inte registreringen av ett löneavtal. Varje etapp
är driftsättningsbar, så att det vid varje tidpunkt finns ett fungerande system
snarare än ett halvintegrerat.

**Beroendet av Försäkringskassans miljö.** §2.6:s tillfälliga miljö finns just
för detta, och det gemensamma tekniska mötet under de första två veckorna syftar
till att hitta problemet medan det ännu finns tid att gå runt det.

**Datakvaliteten i migreringen från W3D3.** Analysen inleds i den första etappen
och migreringen körs upprepat från december, inte en gång i mars. En migrering
som prövas först i slutet av ett projekt med fast slutdatum är det vanligaste
sättet ett sådant projekt missar sitt datum.

**Tillgången till AI-modelltjänsten.** AI-stödet ligger avsiktligt **inte på den
kritiska linjen**. §4.1 kräver att varje förslag granskas och godkänns av en
handläggare innan något sparas, så den manuella vägen måste finnas för var och en
av de fyra funktionerna oavsett — AI-stödet förkortar arbetet snarare än
möjliggör det. Om modelltjänsten dröjer fungerar registreringen ändå.

---

## Vad detta avsnitt inte ska påstå

**Den medföljande prototypen är inte det levererade systemet.** Den har ingen
databas, ingen identitetsleverantör och ingen AI-modell. Det den demonstrerar är
gränssnittet, reglerna och metoden — och metoden är det §3.4 frågar efter.

**Siffrorna ovan är aktuella och kommer att röra sig.** 362 tester och 0
tillgänglighetsavvikelser är sant om det bygge detta svar togs fram ur; de är
belägg för att grindarna finns och körs, inte ett löfte om ett slutligt antal.
Grindarna har förtjänat sin plats: det senaste de fångade var en sökbyggare vars
villkor sattes samman korrekt och därefter returnerade samtliga avtal oavsett —
funnet genom att köra scenarierna, inte genom att titta på skärmen.

**Tidplanen är en översikt, inte en projektplan.** §3.4 efterfrågar *en
övergripande tidplan*. Den detaljerade planen kommer överens med
Medlingsinstitutet på uppstartsmötet, vilket är där §2.1 placerar den.
