# Demomanus — inspelad genomgång av Scenario 2

*Framtaget 2026-08-25. Ett scenario, inspelat. Komplement till
`docs/27-presentationsmanus.md`, som är repliken för de femton minuterna hos
Medlingsinstitutet — det här är manus för filmen.*

## Varför just det här scenariot

Bilaga 2 §3.5 bedömer tre roller. Den här filmen visar **en**:
Avtalsadministratör/Handläggare. Skälen är tre, och de är värda att säga rakt ut
innan någon lägger tid på inspelningen.

Det är **myndighetens dagliga arbete**. Systemadministratörens scenario handlar om
vem som får göra vad, allmänhetens dator om vad som lämnas ut. Det här är det
arbete som sker varje vecka under en avtalsrörelse, och det är det arbete
resten läser: Konjunkturlönerapporten, årsrapporten och den publika datorn läser
alla det handläggaren skriver in.

Det är **det längsta**: sju steg mot sex och fem. Alla fyra av §3.5:s punkter för
rollen ligger i det, och de går att gå igenom på **ett och samma avtal** — vilket
är hela poängen med att filma det som ett flöde i stället för som skärmar.

Och det är den del där systemet gör något **som inte går att visa med en skiss**:
protokollet bredvid formuläret, källkopplingen, det avvisade förslaget, och
publiceringen som syns på en annan roll efteråt.

---

## Berättelsen på en rad

> **Två vägar in i registret, en väg ut. Filmen lägger upp ett nytt
> kollektivavtal, registrerar ett inkommet protokoll, rättar en uppgift — och
> slutar med att avtalet som lades upp i början kan läsas av en besökare på
> datorn i Medlingsinstitutets lokaler.**

Det är hela storylinen, och den ska höras i öppningen och stängas i slutet. Allt
däremellan är stationer på den vägen — inte funktioner som räknas upp.

Två saker som **inte** ska styra dispositionen:

- **Inte menyn.** En film som går igenom menyalternativ visar ett systems
  innehållsförteckning, inte dess arbete.
- **Inte kravlistan.** Kraven syns i traceability-lagret och i svarstexten. En
  film som läser upp krav-ID:n läser upp något tittaren redan har på papper.

---

## Inspelningsuppsättning

| | |
|---|---|
| Adress | `miis-poc.vercel.app` — samma bygge som utvärderaren klickar i |
| Roll | Avtalsadministratör, hela filmen utom sista scenen |
| Datamängd | Normalläge |
| Språk | Svenska |
| Krav-ID | **Dolda** — produktvyn. Se scen 11 för det enda undantaget |
| Fönster | 1440 × 900, webbläsaren i helskärm, inga bokmärken eller flikar synliga |
| Muspekare | Synlig. Rör den långsamt och pausa **innan** klicket, inte efter |

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

| Scen | Klocka | Ord |
|---|---|---|
| 1 · Vad det här är | 0:00–1:00 | 76 |
| 2 · Avtalet AI:t inte får röra | 1:00–1:55 | 66 |
| 3 · Protokollet kommer in | 1:55–2:45 | 61 |
| 4 · Varifrån siffran kom | 2:45–3:20 | 41 |
| 5 · Det avvisade förslaget | 3:20–4:05 | 59 |
| 6 · Var registreringen hamnar | 4:05–4:40 | 45 |
| 7 · Att rätta en uppgift | 4:40–5:35 | 72 |
| 8 · En rad per avtalsrörelse | 5:35–6:05 | 39 |
| 9 · Klarmarkering och publicering | 6:05–7:20 | 95 |
| 10 · Datorn i lokalerna | 7:20–8:00 | 50 |
| 11 · Avslut | 8:00–8:25 | 32 |
| **Summa** | **8:25** | **636** |

636 ord i 130 ord/minut är **4:54 ren taltid inom 8:25** —
3:31 tystnad, och den tystnaden är där tittaren hinner läsa skärmen. Fyll
den inte.

**Klockan är räknad ur replikerna, inte tvärtom.** Varje scens tid är dess
taltid delad med 0,58 — samma andel tal i alla scener, i stället för att totalen
stämmer medan enskilda scener kräver att man pratar oavbrutet över två klick.
Behövs en kortare version är det scen 7 och scen 9 som ska kortas, inte scen 5:
det avvisade förslaget är det enda i filmen en konkurrent inte kan påstå sig ha.

Siffrorna är räknade ur scenernas egna repliker, inte uppskattade. Kommandot
räknar **bara** det som står under en `## Scen`-rubrik — storylinen längre upp är
inte något som sägs i filmen, och en kontroll som räknar med den återger inte
tabellen den ska kontrollera:

```bash
python -c "import io,re;s=io.open('docs/30-demomanus-video-SV.md',encoding='utf-8').read();parts=re.split(r'^## ',s,flags=re.M);print(sum(len(q.split()) for p in parts if p.startswith('Scen ') for q in re.findall(r'^> (.*)$',p,re.M)))"
```

---

## Scen 1 · Vad det här är — 0:00–1:00

**Bild:** `/avtal` i produktvyn. Ingen rörelse de första två sekunderna.

**Pekare:** vilar. Vid andra meningen: peka på den grå raden överst, en gång.

**Replik:**

> Det här är MIIS, Medlingsinstitutets informationssystem, som ett körande
> system. Ni kan klicka i det själva på adressen i rutan.
>
> En sak först: den grå raden överst ingår inte i systemet. Det är
> granskningsverktyg — roll, datamängd, språk. De ligger utanför systemets ram
> just för att ingen ska ta dem för föreslagen funktionalitet.
>
> Jag är inloggad som avtalsadministratör. Jag lägger upp ett avtal, registrerar
> ett protokoll, och slutar med att avtalet finns på den publika datorn.

*Regi:* sista meningen är storylinen och den ska hållas. Avtalet som läggs upp i
scen 2 är samma post som publiceras i scen 9 och som söks fram i scen 10 — det
är därför filmen hänger ihop i stället för att vara en rundvandring.

---

## Scen 2 · Avtalet AI:t inte får röra — 1:00–1:55

**Bild:** klicka **Registrera nytt kollektivavtal**. `/avtal/ny`.

**Pekare:** fyll fälten i takt med repliken. **Fyll även i teckningsdatum** —
avtalet kommer tillbaka i scen 9, och publicering kräver att det är tecknat.
Spara.

**Replik:**

> Ibland är avtalet nytt — parterna har aldrig tecknat något förut. Då finns
> ingenting i registret att matcha mot, och det är därför er
> kravspecifikation säger att helt nya avtal alltid registreras manuellt.
>
> Skärmen säger det själv, i stället för att bara göra det.
>
> Det sparas som ofullständigt och opublicerat, och listan under bekräftelsen
> räknar upp vad som återstår. En lucka blockerar ingenting — den syns.

*Regi:* låt bekräftelsens punktlista ligga kvar två sekunder. Den listan är
kvittot på att systemet vet vad som fattas — och sista punkten på den,
*"markera registreringen som klar och publicera avtalet"*, är exakt det scen 9
gör. **Anteckna avtalets namn.** Filmen kommer tillbaka till just den här
posten.

---

## Scen 3 · Protokollet kommer in — 1:55–2:45

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
> formuläret medan handläggaren arbetar. Att kontrollera ett värde blir en
> blick i stället för en scroll fram och tillbaka.

*Regi:* scrollningen **är** poängen i den här scenen. Gör den långsamt nog att
den syns, och säg ingenting under den.

---

## Scen 4 · Varifrån siffran kom — 2:45–3:20

**Bild:** klicka AI-märket vid ett fält. Stycket markeras i protokollet.

**Pekare:** från fältet till det markerade stycket, i en rörelse.

**Replik:**

> AI-stödet har läst protokollet och föreslår värden. Varje förslag är
> källkopplat.
>
> Jag markerar det här fältet — och stycket det lästes ur markeras i
> protokollet. Handläggaren behöver aldrig leta efter var en siffra kom ifrån
> för att kunna lita på den.

*Regi:* gör det **två gånger**, med två olika fält, andra gången utan replik.
Upprepningen visar att det är ett beteende och inte ett specialfall.

---

## Scen 5 · Det avvisade förslaget — 3:20–4:05

**Bild:** ett av förslagen är fel. Avvisa det.

**Pekare:** vila på förslaget medan repliken börjar. Klicka **Avvisa** på
"Jag avvisar det".

**Replik:**

> Inget av det här sparas av sig självt. Varje förslag kräver ett godkännande —
> det är ert eget krav, och det är själva poängen med AI-stöd hos en myndighet.
>
> Ett av förslagen här är avsiktligt fel. Jag avvisar det.
>
> Vi visar den vägen med flit. Ett flöde som bara visar den lyckade vägen
> påstår granskningen. Det här demonstrerar den.

*Regi:* den viktigaste scenen i filmen. Låt det avvisade förslaget försvinna i
bild innan du går vidare — klipp inte över det.

---

## Scen 6 · Var registreringen hamnar — 4:05–4:40

**Bild:** `/avtal`. Sätt ett filter så att tabellen smalnar av.

**Pekare:** på färgmarkeringen i statuskolumnen.

**Replik:**

> Registreringen hamnar här. Färgen visar hur avtalet kom till — nytecknat,
> tecknat efter medling, eller kvarstående.
>
> Färgen står aldrig ensam. Den bärs av en form och ett ord också, för ett
> register där färgen är enda bäraren är oläsbart för en del av era användare.

*Regi:* filtret ska **smalna av tabellen i bild**. En kontroll som ser levande
ut och inte är det är det värsta en utvärderare kan hitta.

---

## Scen 7 · Att rätta en uppgift — 4:40–5:35

**Bild:** öppna avtalet. Klicka **Redigera** i panelen *Avtalets omfattning*.
Ändra antal anställda och fackmedlemmar.

**Pekare:** på Organisationsgrad medan de två talen ovanför skrivs in.

**Replik:**

> Ert krav säger registrera *och redigera*. Varje avsnitt som går att rätta har
> sin egen Redigera-knapp, och rättningen sker på värdena själva — inte på en
> andra skärm med samma uppgifter en gång till.
>
> Titta på organisationsgraden här nere medan jag skriver. Den räknas fram. Den
> är inte ett tredje tal någon matar in, för då kan den bli inaktuell.
>
> Ändringen skrivs till ändringsloggen med gammalt värde, nytt värde, tidpunkt
> och användare.

*Regi:* skriv långsamt nog att organisationsgraden hinner uppdateras synligt.
Det är den enda scenen där ett tal ändrar sig av sig självt, och det ska ses.

---

## Scen 8 · En rad per avtalsrörelse — 5:35–6:05

**Bild:** fliken **Löneavtal**.

**Pekare:** längs raderna, uppifrån och ned.

**Replik:**

> Ett avtal har ingen versionslista. Det har en rad per avtalsrörelse — varje
> omförhandling får sin egen konstruktion, sitt eget löneutrymme och sin egen
> kostnadsram.
>
> Jämförelsen mot förra ronden är alltså inte en rapport man beställer. Den är
> tabellen.

*Regi:* håll den kort. Poängen är strukturen, inte siffrorna.

---

## Scen 9 · Klarmarkering och publicering — 6:05–7:20

**Bild:** **öppna avtalet från scen 2** — det som sparades som ofullständigt.
Högerspalten: klicka **Markera registreringen som klar**, sedan **Publicera
avtalet**.

**Pekare:** peka först på raden *Registreringen saknar …*, och på den nekade
publiceringsknappen, innan du klarmarkerar.

**Replik:**

> Nu tillbaka till avtalet jag lade upp i början. Det är fortfarande
> ofullständigt, och publiceringen nekas — skärmen säger att registreringen
> måste vara markerad som klar.
>
> Så det är två handlingar, och de är avsiktligt åtskilda.
>
> Först klarmarkeringen. Systemet visar vad posten saknar, men det avgör inte.
> Ett kvarstående avtal som ingen omförhandlat i år är en komplett registrering
> utan löneavtal under sig — så handläggaren avgör, inte en regel.
>
> Sedan publiceringen. Den är en handling med datum och person, inte en följd av
> att posten är komplett. Ni avgör när ett avtal lämnas ut.

*Regi:* visa den nekade knappen **innan** du klarmarkerar — vägran och vägen
förbi den hör ihop, och det är den ordningen en handläggare möter dem i. Låt
raden *Publicerat …, av …* ligga kvar två sekunder efteråt. Datumet och personen
är hela argumentet.

Det här är den väg `npm run scenario` går igenom och kontrollerar vid varje
ändring, så filmen följer ett flöde som är verifierat och inte ett som råkar
fungera den dagen.

---

## Scen 10 · Datorn i lokalerna — 7:20–8:00

**Bild:** byt roll till **Publik dator** i demoraden. `/allmanheten`. Sök upp
avtalet.

**Pekare:** på rollväxlaren när den ändras — säg att du byter.

**Replik:**

> Nu byter jag roll, till datorn som står i era lokaler.
>
> Ingen inloggning, ingen meny, inget fackspråk. En besökare, ett sökfält.
>
> Och avtalet jag lade upp i början av filmen ligger här. Det är hela vägen:
> från en tom post till något en journalist kan läsa och ta med sig.

*Regi:* sök fram avtalet **i bild**. Att det finns där är beviset; att säga att
det finns där är ett påstående.

---

## Scen 11 · Avslut — 8:00–8:25

**Bild:** avtalet i den publika vyn ligger kvar. **Valfritt:** slå på Krav-ID i
demoraden och låt taggarna tona in under sista meningen.

**Replik:**

> Det var handläggarens scenario. Systemadministratörens ligger i svaret och i
> den guidade genomgången, och allmänhetens dator såg ni just slutet av.
>
> Allt ni sett är det körande systemet. Ingenting är en skiss.

*Regi:* om Krav-ID slås på: säg ingenting om det. Taggarna talar för sig själva
och en förklaring gör en tyst styrka till en utläggning.

---

## Vad som inte får sägas

Bilaga 2 §3.6: *"Leverantören får ej tillföra nya åtaganden, det är inte en
möjlighet till en andra anbudsomgång."* Det gäller filmen lika mycket som den
muntliga presentationen — en film som visas för Medlingsinstitutet är en del av
anbudet.

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

**Om filmen ska finnas på engelska** görs den om från början med `miis_lang=en`,
inte med engelsk textning över svenska skärmar. Gränssnittet är översatt i sin
helhet; en film som säger en sak och visar en annan väcker frågan om vad mer som
skiljer.
