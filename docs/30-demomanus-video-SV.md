# Demomanus — inspelad genomgång av Scenario 2

*Omarbetat 2026-08-25 mot systemet som det ser ut nu. Ett scenario, inspelat.
Komplement till `docs/27-presentationsmanus.md`, som är repliken för de femton
minuterna hos Medlingsinstitutet — det här är manus för filmen.*

## Varför just det här scenariot

Avropsförfrågan bedömer tre roller. Den här filmen visar **en**:
Avtalsadministratör/Handläggare. Skälen är tre, och de är värda att säga rakt ut
innan någon lägger tid på inspelningen.

Det är **myndighetens dagliga arbete**. Systemadministratörens scenario handlar
om vem som får göra vad, allmänhetens dator om vad som lämnas ut. Det här är det
arbete som sker varje vecka under en avtalsrörelse, och det är det arbete resten
läser: Konjunkturlönerapporten, årsrapporten och den publika datorn läser alla
det handläggaren skriver in.

Det är **det längsta**: åtta steg mot sex och fem. Alla fyra punkter som avropet
räknar upp för rollen ligger i det.

Och det är den del där systemet gör något **som inte går att visa med en skiss**:
protokollet bredvid formuläret, matchningen som är ett val och inte ett
påstående, det avvisade förslaget, och publiceringen som syns på en annan roll
efteråt.

---

## Berättelsen på en rad

> **Ett undertecknat protokoll kommer in. Filmen följer arbetet från den tomma
> posten till den dag en besökare kan läsa avtalet på datorn i
> Medlingsinstitutets lokaler — och stannar tre gånger på ställen där maskinen
> föreslår och en människa avgör.**

Det är storylinen, och den ska höras i öppningen och stängas i slutet. Allt
däremellan är stationer på den vägen — inte funktioner som räknas upp.

**De tre stoppen är filmens poäng.** Matchningen som handläggaren kan ändra, det
felaktiga förslaget som avvisas, och klarmarkeringen som ingen regel gör åt
någon. Blir filmen för lång är det de andra scenerna som kortas.

Två saker som **inte** ska styra dispositionen:

- **Inte menyn.** En film som går igenom menyalternativ visar ett systems
  innehållsförteckning, inte dess arbete.
- **Inte kravlistan.** Kravnumren finns i svarstexten och i systemets eget
  krav-ID-läge. En film som läser upp dem läser upp något tittaren har på papper.

---

## Inspelningsuppsättning

| | |
|---|---|
| Adress | `miis-poc.vercel.app` — samma bygge som utvärderaren klickar i |
| Roll | Avtalsadministratör, hela filmen utom näst sista scenen |
| Datamängd | Normalläge |
| Språk | Svenska |
| Krav-ID | **Dolda** — produktvyn |
| Fönster | 1440 × 900, webbläsaren i helskärm, inga bokmärken eller flikar synliga |
| Muspekare | Synlig. Rör den långsamt och pausa **innan** klicket, inte efter |

**Börja med en ren session.** Rensa webbläsarens data för adressen först — filmen
lägger upp ett avtal och publicerar ett annat, och båda ligger kvar i sessionen.
En andra tagning på en smutsig session visar ett avtal som redan är publicerat i
den scen som handlar om att publicera det.

**Demoraden lämnas synlig och förklaras en gång, i scen 1.** Den som ser en
rollväxlare i en film och inte får den förklarad tror att den är föreslagen
funktionalitet — vilket är precis vad den inte är. Att dölja den vore dessutom
att visa något annat än det tittaren själv möter på adressen.

**Klipp bort väntan, aldrig ett resultat.** OCR-steget kör fyra moment på egen
hand. Klipp i den vänteperioden om den blir lång — men klipp aldrig så att ett
värde hinner ändras utan att tittaren ser det ske.

---

## Tidsbudget

Räknat mot **130 ord i minuten**, vilket är presenterande svensk taltakt. Drygt
fyra tiondelar av speltiden går till klick och tystnad — det är inte spilltid
utan den tid tittaren läser skärmen.

Klockan är räknad ur replikerna och inte tvärtom: varje scens tid är dess taltid
delad med 0,58, så alla scener får samma andrum i stället för att totalen stämmer
medan enskilda scener kräver att man pratar oavbrutet över två klick.

| Scen | Klocka | Ord |
|---|---|---|
| 1 · Vad det här är | 0:00–1:10 | 86 |
| 2 · Avtalet AI:t inte får röra | 1:10–2:10 | 74 |
| 3 · Protokollet kommer in | 2:10–3:00 | 61 |
| 4 · Första stoppet — vilket avtal gäller det? | 3:00–4:00 | 78 |
| 5 · Varifrån siffran kom | 4:00–4:25 | 34 |
| 6 · Andra stoppet — det avvisade förslaget | 4:25–5:10 | 59 |
| 7 · AI-stödet, samlat | 5:10–6:25 | 94 |
| 8 · Var registreringen hamnar | 6:25–7:00 | 45 |
| 9 · Att rätta en uppgift | 7:00–7:55 | 70 |
| 10 · Tredje stoppet — klarmarkering och publicering | 7:55–8:50 | 71 |
| 11 · Datorn i lokalerna | 8:50–9:10 | 28 |
| 12 · Avslut | 9:10–9:45 | 46 |
| **Summa** | **9:45** | **746** |

746 ord i 130 ord/minut är **5:44 ren taltid inom 9:45** — 4:01
tystnad, och den tystnaden är där tittaren hinner läsa skärmen. Fyll den inte.

*Räkna om efter varje ändring av replikerna — en tidsbudget som ingen räknat om
är en gissning:*

```bash
python -c "import io,re;s=io.open('docs/30-demomanus-video-SV.md',encoding='utf-8').read();parts=re.split(r'^## ',s,flags=re.M);print(sum(len(q.split()) for p in parts if p.startswith('Scen ') for q in re.findall(r'^> (.*)$',p,re.M)))"
```

---

## Scen 1 · Vad det här är — 0:00–1:10

**Bild:** `/avtal` i produktvyn. Ingen rörelse de första två sekunderna.

**Pekare:** vilar. Vid andra stycket: peka på den grå raden överst, en gång.

**Replik:**

> Det här är MIIS, Medlingsinstitutets informationssystem, som ett körande
> system. Ni kan klicka i det själva på adressen i rutan.
>
> En sak först: den grå raden överst ingår inte i systemet. Det är
> granskningsverktyg — roll, datamängd, språk. De ligger utanför systemets ram
> just för att ingen ska ta dem för föreslagen funktionalitet.
>
> Jag är inloggad som avtalsadministratör. Ett protokoll har kommit in, och jag
> ska följa det hela vägen till datorn ute i era lokaler. Tre gånger på vägen
> föreslår systemet något och jag avgör.

*Regi:* sista meningen är storylinen. Säg den långsamt — den ska höras igen i
sista scenen.

---

## Scen 2 · Avtalet AI:t inte får röra — 1:10–2:10

**Bild:** klicka **Registrera nytt kollektivavtal**. `/avtal/ny`.

**Pekare:** fyll fälten i takt med repliken. Namn **Stål- och metallindustrin
tjänstemän**, avtalsområde **Stål och metall**, arbetsgivarpart
**Industriarbetsgivarna**, arbetstagarpart **Unionen**. Fyll också i
teckningsdatum. Spara.

**Replik:**

> Ibland är avtalet nytt — parterna har aldrig tecknat något förut. Då finns
> ingenting i registret att matcha mot, och det är därför er kravspecifikation
> säger att helt nya avtal alltid registreras för hand.
>
> Skärmen säger det själv i stället för att bara göra det.
>
> Och titta på kvittot. Avtalet är sparat, men ofullständigt — och listan visar
> vad som är registrerat och vad som återstår. Teckningsdatumet jag nyss skrev
> in är redan avbockat.

*Regi:* låt checklistan ligga kvar två sekunder. Den är svaret på frågan *hur
långt har jag kommit*, och den kommer tillbaka i scen 10.

---

## Scen 3 · Protokollet kommer in — 2:10–3:00

**Bild:** `/registrera`. Ladda upp PDF:en. Låt OCR-momenten löpa.

**Pekare:** efter uppladdningen — scrolla formuläret **långsamt** och låt
tittaren se att protokollet står stilla till vänster.

**Replik:**

> Det vanliga fallet är det här: ett undertecknat protokoll om ett avtal som
> redan finns, oftast inskannat.
>
> Det här är era egna fem steg. Vi har inte lagt till några.
>
> Och det viktigaste på hela skärmen är att protokollet står kvar bredvid
> formuläret medan handläggaren arbetar. Att kontrollera ett värde blir en blick
> i stället för en scroll fram och tillbaka.

*Regi:* scrollningen **är** poängen i den här scenen. Gör den långsamt nog att
den syns, och säg ingenting under den.

---

## Scen 4 · Första stoppet — vilket avtal gäller det? — 3:00–4:00

**Bild:** fältet **Avtal (befintligt i MIIS)** överst i AI-analysen. Öppna listan
så att kandidaterna syns. Peka på protokollets partsrad till vänster.

**Pekare:** från det föreslagna avtalet, till protokollets parter, till andra
raden i listan.

**Replik:**

> Systemet har läst protokollet och föreslår vilket avtal det gäller. Under
> rutan står varför: avtalsnamnet i rubriken.
>
> Men titta på parterna i protokollet till vänster. Industriarbetsgivarna och
> **Unionen**. Det föreslagna avtalet är samma bransch, fast med IF Metall.
>
> Därför är det här en lista och inte ett påstående. Varje rad säger vad den
> lästes ur — rubriken, parterna eller filnamnet — och avtalet jag lade upp för
> en minut sedan ligger där, matchat på just parterna. Handläggaren avgör.

*Regi:* det viktigaste stoppet i filmen. Låt listan stå öppen. Om ni bara har tid
med en scen till, är det den här som ska vara med.

---

## Scen 5 · Varifrån siffran kom — 4:00–4:25

**Bild:** klicka AI-märket vid ett fält. Stycket markeras i protokollet.

**Pekare:** från fältet till det markerade stycket, i en rörelse.

**Replik:**

> Varje förslag är källkopplat. Jag markerar det här fältet — och stycket det
> lästes ur markeras i protokollet.
>
> Handläggaren behöver aldrig leta efter var en siffra kom ifrån för att kunna
> lita på den.

*Regi:* gör det **två gånger**, med två olika fält, andra gången utan replik.
Upprepningen visar att det är ett beteende och inte ett specialfall.

---

## Scen 6 · Andra stoppet — det avvisade förslaget — 4:25–5:10

**Bild:** förslaget på arbetstagarpart är fel. Avvisa det.

**Pekare:** vila på förslaget medan repliken börjar. Klicka på *"Jag avvisar
det"*.

**Replik:**

> Inget av det här sparas av sig självt. Varje förslag kräver ett godkännande —
> det är ert eget krav, och det är själva poängen med AI-stöd hos en myndighet.
>
> Ett av förslagen här är avsiktligt fel. Jag avvisar det.
>
> Vi visar den vägen med flit. Ett flöde som bara visar den lyckade vägen påstår
> granskningen. Det här demonstrerar den.

*Regi:* låt det avvisade förslaget försvinna i bild innan du går vidare — klipp
inte över det.

---

## Scen 7 · AI-stödet, samlat — 5:10–6:25

**Bild:** öppna AI-panelen nere till höger. Visa de tre flikarna i tur och
ordning: **Fråga**, **Granska**, **Om**.

**Pekare:** på fliknamnen medan de nämns. Öppna **Om** sist och låt den ligga.

**Replik:**

> Det här är hela AI-stödet, samlat på ett ställe.
>
> **Fråga** ställer en fråga om registret. Svaret är de poster systemet räknade,
> och man kan öppna var och en. Det formulerar ingen text om kollektivavtal — en
> myndighet kan inte publicera ett svar den inte kan stå för.
>
> **Granska** är kön: varje maskinellt framtaget förslag som ingen godkänt än.
> Den är gemensam, inte personlig, och siffran faller när ett förslag godkänns
> eller avvisas.
>
> **Om** är katalogen. De fyra funktioner ni beskrivit, var och en med var den
> körs — och gränserna i era egna ord.

*Regi:* säg **fyra** och peka på listan. Att kunna säga "det finns ingen femte"
är hela poängen med att ha en katalog.

---

## Scen 8 · Var registreringen hamnar — 6:25–7:00

**Bild:** `/avtal`. Sätt ett filter så att tabellen smalnar av.

**Pekare:** på färgmarkeringen i statuskolumnen.

**Replik:**

> Registreringen hamnar här. Färgen visar hur avtalet kom till — nytecknat,
> tecknat efter medling, eller kvarstående.
>
> Färgen står aldrig ensam. Den bärs av en form och ett ord också, för ett
> register där färgen är enda bäraren är oläsbart för en del av era användare.

*Regi:* filtret ska **smalna av tabellen i bild**. En kontroll som ser levande ut
och inte är det är det värsta en utvärderare kan hitta.

---

## Scen 9 · Att rätta en uppgift — 7:00–7:55

**Bild:** öppna Stål- och metallindustrin. Klicka **Redigera** i panelen
*Avtalets omfattning*. Ändra antal anställda och fackmedlemmar.

**Pekare:** på Organisationsgrad medan de två talen ovanför skrivs in.

**Replik:**

> Ert krav säger registrera *och redigera*. Varje avsnitt som går att rätta har
> sin egen Redigera-knapp, och rättningen sker på värdena själva — inte på en
> andra skärm med samma uppgifter en gång till.
>
> Titta på organisationsgraden medan jag skriver. Den räknas fram. Den är inte
> ett tredje tal någon matar in, för då kan den bli inaktuell.
>
> Ändringen skrivs till ändringsloggen med gammalt värde, nytt värde, tidpunkt
> och användare.

*Regi:* skriv långsamt nog att organisationsgraden hinner uppdateras synligt. Det
är den enda scenen där ett tal ändrar sig av sig självt, och det ska ses.

---

## Scen 10 · Tredje stoppet — klarmarkering och publicering — 7:55–8:50

**Bild:** högerspalten. Peka på checklistan, klicka **Markera registreringen som
klar**, sedan **Publicera avtalet**.

**Pekare:** på checklistans rader innan du klarmarkerar.

**Replik:**

> Två handlingar till slut, och de är avsiktligt åtskilda.
>
> Först klarmarkeringen. Checklistan visar vad posten innehåller och vad den
> saknar — men den avgör inte. Ett kvarstående avtal som ingen omförhandlat i år
> är en komplett registrering utan löneavtal under sig. Handläggaren avgör, inte
> en regel.
>
> Sedan publiceringen. Den är en handling med datum och person, inte en följd av
> att posten är komplett. Ni avgör när ett avtal lämnas ut.

*Regi:* låt raden *Publicerat …, av …* ligga kvar två sekunder. Datumet och
personen är hela argumentet.

---

## Scen 11 · Datorn i lokalerna — 8:50–9:10

**Bild:** byt roll till **Publik dator** i demoraden. `/allmanheten`. Sök upp
avtalet.

**Pekare:** på rollväxlaren när den ändras — säg att du byter.

**Replik:**

> Nu byter jag roll, till datorn som står i era lokaler.
>
> Ingen inloggning, ingen meny, inget fackspråk. En besökare, ett sökfält.
>
> Och avtalet jag nyss publicerade ligger här.

*Regi:* sök fram avtalet **i bild**. Att det finns där är beviset; att säga att
det finns där är ett påstående.

---

## Scen 12 · Avslut — 9:10–9:45

**Bild:** avtalet i den publika vyn ligger kvar.

**Replik:**

> Det var handläggarens arbete, från protokollet på skrivbordet till det en
> besökare kan läsa.
>
> Tre gånger föreslog systemet något och en människa avgjorde: vilket avtal
> protokollet gällde, vilka värden som stämde, och när posten var klar att
> lämnas ut.
>
> Allt ni sett är det körande systemet.

*Regi:* stanna på bilden två sekunder efter sista ordet.

---

## Vad som inte får sägas

Avropets regel om den muntliga presentationen — *"leverantören får ej tillföra
nya åtaganden"* — gäller filmen lika mycket. En film som visas för
Medlingsinstitutet är en del av anbudet.

**Varje påstående i manuset ovan finns i den inlämnade texten.** Kontrollera mot
`docs/18-role-scenarios-SV.md` innan inspelning, inte efter.

Tre saker att inte säga, i den ordning frestelsen brukar komma:

- **Inga tidsvinster i procent.** Att protokollet står bredvid formuläret sparar
  tid; hur mycket vet vi inte, och en siffra ingen mätt är ett åtagande.
- **Ingenting om AI-modell eller leverantör av den.** Prototypen har ingen. Det
  står i svaret och ska inte antydas bort i en film.
- **Inga funktioner som inte syns i bild.** Om det inte demonstreras hör det
  hemma i texten.

---

## Efterarbete

**Textning på svenska, inte automatisk.** Repliken finns redan skriven ovan —
klistra in den. En automattextning som stavar *Medlingsinstitutet* fel i en film
till Medlingsinstitutet är en onödig sak att låta hända.

**Ingen musik.** Det här är ett myndighetssystem, inte en produktlansering.

**Filnamn:** `MIIS-demo-scenario2-avtalsadministrator-SV.mp4`.

**Om filmen ska finnas på engelska** görs den om från början med språket satt
till engelska, inte med engelsk textning över svenska skärmar. Gränssnittet är
översatt i sin helhet; en film som säger en sak och visar en annan väcker frågan
om vad mer som skiljer.
