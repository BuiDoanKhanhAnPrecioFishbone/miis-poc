# Presentationsmanus — orden som sägs, med tidsbudget

*Framtaget 2026-08-24. Komplement till `docs/22-presentation.md`, som är
körschemat. Det här är repliken.*

**Varför ord och inte punkter.** Femton minuter går inte att hålla genom att
vilja hålla dem. Det som håller tiden är att texten är avmätt i förväg: varje
avsnitt nedan har ett ordantal, och ordantalet är räknat mot **130 ord i
minuten**, vilket är presenterande svensk taltakt — långsammare än samtal,
eftersom man klickar, pekar och låter dem titta.

Räkna inte med att prata hela tiden. När man visar ett system går ungefär hälften
av tiden till klick, pekningar och tystnad — och budgeten nedan är mätt, inte
uppskattad.

| Avsnitt | Tid på klockan | Ord | Ren taltid |
|---|---|---|---|
| Ramen | 1:15 | 126 | 0:58 |
| Scenario 2 — Avtalsadministratör | 4:30 | 243 | 1:52 |
| Scenario 1 — Systemadministratör | 3:00 | 185 | 1:25 |
| Scenario 3 — Allmänhetens dator | 2:30 | 123 | 0:56 |
| Metoden och ägandet | 0:45 | 80 | 0:36 |
| **Summa innehåll** | **12:00** | **757** | **5:49** |
| Frågor | 3:00 | — | — |

**Ren taltid är knappt halva klocktiden, och det är avsikten.** 5:49 tal inom
12:00 betyder att drygt hälften av tiden är klick, pekningar och tystnad medan
de tittar. Den som fyller tystnaden med fler ord hinner inte igenom — det är så
en femtonminuterspresentation blir tjugo.

Siffrorna ovan är räknade ur det här dokumentets egna repliker, inte uppskattade:

```bash
python -c "import io,re;s=io.open('docs/27-presentationsmanus.md',encoding='utf-8').read();print(sum(len(q.split()) for q in re.findall(r'^> (.*)$',s,re.M) if not q.startswith('**')))"
```

**Öva med klocka en gång.** Om ramen tar mer än 1:15 är det ramen som ska kortas,
aldrig Scenario 2 — det är den enda delen där systemet gör något en konkurrent
inte kan visa.

---

## Ramen — 1:15

> Det ni ser är inte en skiss. Det är ett körande system i två fullständiga
> språkversioner, granskat mot WCAG 2.1 AA, och ni kan klicka i det själva
> efteråt på den här adressen.
>
> Vi har byggt alla åtta roller som kravspecifikationen definierar. Vi visar tre
> — de tre ni bedömer — och vi följer era egna steg för var och en.
>
> En sak innan vi börjar. Den grå raden överst är inte en del av MIIS. Det är
> våra granskningsverktyg: roll, datamängd, språk och kravnummer. De ligger
> utanför systemets egen ram just för att ingen ska ta dem för föreslagen
> funktionalitet.
>
> Femton minuter räcker till tre scenarier och en kort del om hur vi arbetar.
> Resten står i svaret, och jag svarar gärna på frågor efteråt.

*Öppna `/genomgang`. Peka på demoraden en gång. Gå vidare.*

---

## Scenario 2 — Avtalsadministratör — 4:30

*Den tyngsta delen. Tre stopp, inget mer.*

### Stopp 1 — protokollet bredvid formuläret

> Ett undertecknat protokoll kommer in, oftast som en inskannad PDF. Det här är
> era fem steg ur fyra punkt fyra — vi har inte lagt till några.
>
> Det viktiga är att protokollet står kvar bredvid formuläret medan handläggaren
> arbetar. Att kontrollera ett värde är en blick, inte en scroll fram och
> tillbaka. Det är den enskilt största tidsåtgången i dagens arbetssätt.

### Stopp 2 — källkopplingen, och det avvisade förslaget

> AI-stödet har läst protokollet och föreslår värden. Två saker om det.
>
> Varje förslag är källkopplat. Jag markerar det här — och stycket det lästes ur
> markeras i protokollet. Handläggaren behöver aldrig leta efter var siffran kom
> ifrån.
>
> Och varje förslag kräver ett godkännande. Ett av förslagen här är avsiktligt
> fel. Jag avvisar det. Vi visar den vägen, för ett flöde som bara visar den
> lyckade vägen påstår granskningen i stället för att demonstrera den.

*Avvisa förslaget. Låt dem se att det försvinner.*

### Stopp 3 — avtalet, och publiceringen

> Det här är er Rapport 4, Huvudrapporten. Tre flikar, för det är tre olika
> arbetsuppgifter: vad avtalet är, vad avtalsrörelsen gav, och vad den lämnade
> öppet. Det som varje uppgift utförs mot — status, löptid, Märket — står kvar i
> kolumnen bredvid oavsett flik.
>
> Löneavtalet går att rätta. En kostnadsram som lästs fel ur ett protokoll under
> tidspress rättas här, per avtalsrörelse, och ändringen hamnar i ändringsloggen
> med gammalt och nytt värde.
>
> Och så publiceringen. Den är en åtgärd med datum och person, inte en följd av
> att posten är komplett — ni avgör när ett avtal lämnas ut. På en halvregistrerad
> post vägras den, och säger varför.

*Publicera. Byt roll till Allmänhetens dator och visa att avtalet är där.*

---

## Scenario 1 — Systemadministratör — 3:00

### Rollbytet — säg det högt

> Här byter vi roll, och jag vill säga varför.
>
> Bilaga 2 ber systemadministratören lägga upp användare. Bilaga 1, tre punkt
> ett, ger den rollen full åtkomst *exklusive behörigheter*, och lägger
> användaradministrationen hos behörighetsadministratören.
>
> Vi läser parentesen som avsiktlig. Den som konfigurerar systemet är inte den
> som ger åtkomst till det. Så vi demonstrerar alla fem stegen och byter roll
> där ert eget dokument kräver det, i stället för att vidga en behörighet ni
> skrivit en parentes för att begränsa.

### De två stoppen

> Jag lägger upp en användare. Namn, EFOS-identitet, e-post, roll. Inget
> lösenordsfält — autentiseringen ligger i Försäkringskassans IdP, så en
> användare här är en länk till en identitet som redan finns.
>
> Och så det ni kommer att pröva. Jag försöker inaktivera den siste
> behörighetsadministratören. Kontrollen vägrar och säger varför. Det är den enda
> utelåsning som bara vi som leverantör skulle kunna reparera, och NFÅ-005 finns
> för att hålla oss utanför.
>
> Inställningarna: fyra, varav två inte går att ändra. Loggarnas lagringstid går
> inte, för ert eget krav namnger systemadministratören i förbudet. Fyra
> redigerbara rutor hade sagt att vi byggt ett formulär. Det här säger att vi
> läst meningarna.

---

## Scenario 3 — Allmänhetens dator — 2:30

*Fort. Poängen är att uppgiften är fyra handlingar.*

> Ingen inloggning, och det ska inte finnas någon. Er egen IP-begränsning gör
> maskinen i rummet till behörigheten.
>
> Besökaren skriver det de kom in med — en bransch, ett förbund. Listan smalnar
> av medan de skriver.
>
> Bransch först, för en besökare tänker i branscher långt innan de tänker i
> arbetsgivarorganisationer.
>
> Avtalet, som ni släpper det: parter, område, löptid, en rad per avtalsrörelse.
> Inga lönesiffror — kostnadsram och löneutrymme är ert arbetsmaterial, inte
> publiceringen.
>
> Och så tar de med sig svaret. Utskriften blir ett dokument med ert märke och
> ett utskriftsdatum, inte en skärmdump. Nedladdningen skriver en riktig fil.
> Båda fungerar.
>
> Ett sekretessmarkerat avtal listas och räknas, men har ingen sida. Att ta bort
> det ur listan vore att svara besökaren att det inte finns.

*Tryck Skriv ut. Visa förhandsgranskningen. Det är den enda bilden som säljer
utskriften.*

---

## Metoden och ägandet — 0:45

> Två saker, kort.
>
> Vi levererar i tvåveckorsetapper där varje etapp slutar i något ni kan öppna,
> med era kravnummer synliga på de vyer som uppfyller dem. Kvalitetsgrindarna
> körs vid varje ändring, och de står i svaret med kommandon.
>
> Och paragraf tre punkt sju ger er systemet fullt ut. Det är ett arkitekturbeslut
> hos oss, inte ett licensbeslut: regelverket ligger i ett lager som inte
> importerar något ramverk, all dataåtkomst går genom en enda söm, och det finns
> inga externa molnberoenden.

---

## Frågor — 3:00

Svaren står i `docs/22-presentation.md`. Den enda regel som gäller genom hela
frågestunden:

> **Om svaret inte finns i det inlämnade svaret, säg det.**
>
> *"Det är inte något vi åtagit oss i avropssvaret, och paragraf tre punkt sex
> tillåter oss inte att lägga till det här — men jag beskriver gärna hur vi
> tänker."*

Och sedan en beskrivning som inte är ett löfte.

---

## Om något går sönder

Säg vad som hände och gå vidare. En presentatör som felsöker inför utvärderarna
bränner minuter som inte finns.

> *"Det där ska inte hända — jag tar med mig det. Nästa steg är …"*

Kör lokalt, inte mot Vercel. Systemet har inga externa beroenden, så det fungerar
utan nät — vilket också är värt en mening om någon frågar.
