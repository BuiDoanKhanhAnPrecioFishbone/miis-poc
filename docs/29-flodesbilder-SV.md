# Flödesbilder — huvudflödet i varje scenario

*Genererad ur `lib/domain/walkthrough.ts` av `npm run flows`. Skriv inte i den här filen — ändra steget i genomgången, kör om, och både bilderna och texten följer med. Det är samma flöde som den guidade genomgången på **miis-poc.vercel.app/genomgang** går igenom, och samma bygge som utvärderaren klickar i.*

6 scenarier, 22 steg. De tre första är de roller som bedöms och ligger först; de tre sista är med som belägg för att systemet är helt, inte som en del av det bedömda svaret.

**Demoraden är borttagen ur bilderna.** Rollväxlaren och språkvalet är granskningshjälpmedel och ingår inte i MIIS, så de hör inte hemma i ett dokument som säger *så här ser systemet ut*. Rollen står i stället i texten vid varje steg.

---

## Registrera, uppdatera och publicera ett kollektivavtal

**Bedömt scenario** · Roll: Avtalsadministratör · 7 steg

### Uppgift och mål

Ett kollektivavtal ska in i registret, hållas aktuellt och till slut lämnas ut. Det kommer två vägar: som ett helt nytt avtal utan tidigare motsvarighet, vilket alltid registreras manuellt (§4.1), eller som ett undertecknat avtalsprotokoll — oftast en inskannad PDF — om ett avtal systemet redan har. Därefter ska uppgifterna gå att komplettera och rätta, varje avtalsrörelse ska lägga sin egen rad, och avtalet ska publiceras när registreringen är klar. Målet är en korrekt, komplett och spårbar post: allt nedströms läser det handläggaren skriver in, från Konjunkturlönerapporten till Medlingsinstitutets årsrapport och den publika datorn.

### Arbetsflöde

#### 1. Registrera ett nytt kollektivavtal

*Roll: Avtalsadministratör · `/avtal/ny`*

Ett avtal utan tidigare motsvarighet i MIIS. Det här är den enda registreringen AI-stödet inte får göra: §4.1 säger att helt nya avtal alltid registreras manuellt, och skälet syns på skärmen — AI:t läser ett protokoll mot ett avtal systemet redan har, och för ett förstagångsavtal finns ingenting att matcha mot. Avtalet sparas som ofullständigt och opublicerat, och skärmen räknar upp vad som återstår. Lägg upp **Stål- och metallindustrin tjänstemän**, mellan Industriarbetsgivarna och Unionen: protokollet i nästa steg är mellan just de två parterna, och inget avtal i registret är det — A-001 är samma bransch fast med IF Metall. Nästa steg matchar därför protokollet mot posten som skapades här, vilket är hela poängen med §4.1:s ordning: ett förstagångsavtal har ingenting att matchas mot förrän det finns.

![Registrera ett nytt kollektivavtal](../screenshots/flode/agreement-admin-01-registrera-ett-nytt-kollektivavtal.png)

<small>Krav: FA-001, FA-005, FAI-002</small>

#### 2. Registrera avtalsprotokoll [AI-stöd]

*Roll: Avtalsadministratör · `/registrera`*

Ladda upp protokollet och gå igenom Medlingsinstitutets egna fem steg (§4.4). Det matchade avtalet är en lista, inte ett påstående: varje kandidat säger vad den lästes ur — rubrikens avtalsnamn, båda parterna eller filnamnet — och avtalet som lades upp i steg 1 står bland dem. OCR, bevakningsord och matchning körs automatiskt; AI-förslagen är källkopplade — välj ett så markeras stycket det lästes ur. Ett förslag är avsiktligt fel, så den avvisade vägen visas och inte bara påstås.

![Registrera avtalsprotokoll](../screenshots/flode/agreement-admin-02-registrera-avtalsprotokoll.png)

<small>Krav: FAI-001, FAI-002, FAI-003, FAI-004, FA-021</small>

#### 3. Avtalsregistret

*Roll: Avtalsadministratör · `/avtal`*

Där registreringen hamnar. Filtren avgränsar tabellen på riktigt, och FR-012:s färgmarkering bär både form och ord.

![Avtalsregistret](../screenshots/flode/agreement-admin-03-avtalsregistret.png)

<small>Krav: FA-005, FA-006, FR-012</small>

#### 4. Lägg till eller uppdatera information

*Roll: Avtalsadministratör · `/avtal/A-001`*

FA-001 är att registrera *och redigera* avtalsinformation. Varje avsnitt som går att rätta har sin egen Redigera — identiteten och avtalets omfattning, de fyra mått Medlingsinstitutet faktiskt räknar om mellan ronderna. Ändringen sker på värdena själva i stället för på en andra skärm, och skrivs till ändringsloggen med tidpunkt och användare. Två fält är avsiktligt låsta och säger varför på sin egen rad: avtalstypen följer av vilka löneavtal som finns, och parterna ändras i partsregistret så att avtalshistoriken följer med. Organisationsgrad räknas fram medan de två talen ovanför skrivs in — den följer, den skrivs inte.

![Lägg till eller uppdatera information](../screenshots/flode/agreement-admin-04-lagg-till-eller-uppdatera-information.png)

<small>Krav: FA-001, FA-014, FH-001</small>

#### 5. Versioner och ändringar av avtalet

*Roll: Avtalsadministratör · `/avtal/A-001#loneavtal`*

Ett avtal har ingen versionslista utan en rad per avtalsrörelse: FA-002 ger varje omförhandling ett eget löneavtal med sin egen konstruktion, sitt utrymme och sin kostnadsram, så jämförelsen mot förra ronden är tabellen. Raden går att rätta: konstruktion, löneutrymme, kostnadsram och individgaranti ändras per avtalsrörelse, från ett formulär som namnger den period det gäller. Löptiden ändras däremot på avtalet och inte här — en avtalsrörelse kan inte gälla längre än avtalet den tillhör. Vad som ändrats *inom* en period står i händelseloggen, med gammalt och nytt värde (FH-001).

![Versioner och ändringar av avtalet](../screenshots/flode/agreement-admin-05-versioner-och-andringar-av-avtalet.png)

<small>Krav: FA-002, FH-001, FH-002</small>

#### 6. Publicera avtalet

*Roll: Avtalsadministratör · `/avtal/A-001`*

Publicering är en handling med datum och person, inte en följd av att posten är komplett — myndigheten avgör när ett avtal lämnas ut. Den ligger i högerspalten bredvid statusen den ändrar, inte i redigeringen: att rätta en uppgift och att lämna ut avtalet är två olika saker. Kontrollen erbjuds bara på en registrering som är markerad som klar och där avtalet är tecknat; på ett halvregistrerat avtal nekas den och säger varför. Samma avtal som de fyra stegen ovan: protokollet lästes mot det, uppgifterna rättades i det, och det är det som nu lämnas ut. Efteråt går det att öppna avtalet som allmänheten ser det.

![Publicera avtalet](../screenshots/flode/agreement-admin-06-publicera-avtalet.png)

<small>Krav: FR-009, FR-011, FH-001</small>

#### 7. Rapportuttag [AI-stöd]

*Roll: Avtalsadministratör · `/rapporter`*

Behovet går att beskriva i en mening överst: förslaget namnger rapporten och fyller urvalsbilden, med de ord det lästes ur, och kör ingenting — en rapport en roll inte får köra avvisas med skälet i stället för att tyst utelämnas. Bilaga F inleds med att det för varje rapport visas urvalsbild och resultat. Välj rapport, fyll i urvalet — kriterierna skiljer sig mellan rapporterna — och generera. Urvalskriterierna skrivs ut överst i resultatet.

![Rapportuttag](../screenshots/flode/agreement-admin-07-rapportuttag.png)

<small>Krav: FR-005, FR-006, FR-007, FR-008, FAI-002</small>

### Användbarhet, effektivitet och tillgänglighet

Protokollet står kvar bredvid formuläret medan handläggaren scrollar, så en kontroll är en blick i stället för en scroll fram och tillbaka. Fältets bredd säger vad som ska stå i det, enheten står i etiketten och värdet är ett rent tal. Fem steg — Medlingsinstitutets egna, inga påhittade. En ofullständig registrering går att spara och ger en påminnelse, så ett protokoll med en lucka inte blockerar kön. WCAG 2.1 AA verifieras automatiskt vid varje ändring: 0 fel, ingen horisontell scroll mellan 375 och 1920 pixlar, och FR-012:s status bärs alltid av färg, form och ord tillsammans.

---

## Användare, roller, behörigheter och systemets förvaltning

**Bedömt scenario** · Roll: Systemadministratör · 6 steg

### Uppgift och mål

Systemadministratören svarar för systemet, inte för handläggningen i det: vem som har åtkomst, som vad, och vad systemet har gjort. Målet är att Medlingsinstitutet ska kunna lägga upp en ny medarbetare, ge, ändra och återkalla behörighet, och svara för en ifrågasatt siffra i en publicerad rapport — allt utan att kontakta leverantören. Scenariot går över två roller, och det är avsiktligt: Bilaga 1 §3.1 ger systemadministratören full åtkomst inklusive systemkonfiguration men uttryckligen inte behörigheter, och lägger användare och rolltilldelning hos behörighetsadministratören. Uppdelningen är ansvarsfördelning — den som konfigurerar systemet är inte den som ger åtkomst till det — och genomgången byter roll där §3.1 kräver det i stället för att vidga en behörighet som myndigheten har skrivit en parentes för att begränsa.

### Arbetsflöde

#### 1. Överblick över användare, roller och behörigheter

*Roll: Behörighetsadministratör · `/administration/anvandare`*

Vem som har åtkomst, som vad, sedan när och av vem. Under registret ligger behörighetsmatrisen, som visar vad varje roll får göra i varje modul — den läses och ändras inte, eftersom NFÅ-003 definierar åtkomsten utifrån §3.1:s åtta roller och en matris som gick att flytta om skulle beskriva en konfiguration i stället för myndighetens eget dokument.

![Överblick över användare, roller och behörigheter](../screenshots/flode/system-admin-01-overblick-over-anvandare-roller-och-beho.png)

<small>Krav: NFÅ-005, NFÅ-003, FH-001</small>

#### 2. Skapa en ny användare

*Roll: Behörighetsadministratör · `/administration/anvandare`*

Namn, EFOS-identitet, e-post och roll. Inget lösenordsfält och ingen kontoskapande åtgärd: NFÅ-001 lägger autentiseringen i Försäkringskassans IdP över SAML med EFOS-kort, så en användare i MIIS är en länk till en identitet som redan finns — att rita ett kontoformulär vore att påstå att vi byggt en identitetsleverantör.

![Skapa en ny användare](../screenshots/flode/system-admin-02-skapa-en-ny-anvandare.png)

<small>Krav: NFÅ-005, NFÅ-001</small>

#### 3. Tilldela roll och behörighet

*Roll: Behörighetsadministratör · `/administration/anvandare`*

Rollen är behörigheten: §3.1 ger varje roll ett verb, och det är rollen som avgör vad personen ser och får göra. Tilldelningen stämplas med datum och vem som gjorde den, vilket är FH-001-halvan av NFÅ-005.

![Tilldela roll och behörighet](../screenshots/flode/system-admin-03-tilldela-roll-och-behorighet.png)

<small>Krav: NFÅ-005, NFÅ-003</small>

#### 4. Ändra eller återkalla behörighet

*Roll: Behörighetsadministratör · `/administration/anvandare`*

Ändra rollen i raden, eller återkalla åtkomsten. Båda skrivs till ändringsloggen. Pröva den sista behörighetsadministratören: både flytten och inaktiveringen nekas, och kontrollen säger varför på sig själv — det är den utelåsning NFÅ-005 finns för att förhindra. Ingen användare raderas, eftersom inloggningarna i loggen måste gå att härleda.

![Ändra eller återkalla behörighet](../screenshots/flode/system-admin-04-andra-eller-aterkalla-behorighet.png)

<small>Krav: NFÅ-005, FH-001, NFL-001</small>

#### 5. Systeminställningar [AI-stöd]

*Roll: Systemadministratör · `/administration`*

Fyra inställningar, och två av dem går avsiktligt inte att ändra: NFL-003 nämner systemadministratören i sitt förbud, och NFÅ-006:s IP-spärr ligger i driftmiljön. Sessionens tidsgräns är konfigurerbar på riktigt — sätt den till tio minuter och startsidan säger tio.

![Systeminställningar](../screenshots/flode/system-admin-05-systeminstallningar.png)

<small>Krav: NFÅ-002, NFL-003, NFÅ-006, FAI-004</small>

#### 6. Ändrings- och händelselogg [AI-stöd]

*Roll: Systemadministratör · `/administration`*

Den övriga administration som gör att myndigheten kan svara för systemet själv. FH-001 kräver gammalt och nytt värde — skillnaden mellan en logg som registrerar att något ändrades och en som kan rekonstruera vad det var, och det som gör FAI-002:s garanti kontrollerbar i efterhand. Utskriften är NFL-004:s exportfunktion som faktiskt körs. Under fliken Bevakningsord underhålls FAI-004:s tabell: §4.1 kallar den fördefinierad *och* anpassningsbar, så administratören lägger till egna ord och tar bort dem igen. Medlingsinstitutets egna fyra går inte att ta bort, och raden säger varför.

![Ändrings- och händelselogg](../screenshots/flode/system-admin-06-andrings-och-handelselogg.png)

<small>Krav: FH-001, FH-002, NFL-003, NFL-004, FAI-004</small>

### Användbarhet, effektivitet och tillgänglighet

Behörighetsregistret svarar på rollens fyra frågor i den ordning de ställs — vem har åtkomst, som vad, sedan när och av vem, och är personen kvar. Rollbytet sker i raden, så handläggaren har personen, den nuvarande rollen och vem som tilldelade den framför sig när den ändras. En åtgärd som nekas säger varför på sig själv: den sista behörighetsadministratören går varken att flytta eller inaktivera, eftersom det är den utelåsning bara leverantören kan reparera. Ingen post raderas — inloggningarna ligger i loggen och måste gå att härleda (NFL-001). Långa tabeller fäster sin rubrikrad och scrollar i en egen namngiven region som går att nå med tangentbord, och en inställning som nekas säger åt vilket håll den är fel och vilken gräns som gäller.

---

## Ta fram avtalsinformation från den publika datorn

**Bedömt scenario** · Roll: Publik dator · 5 steg

### Uppgift och mål

En besökare kommer till Medlingsinstitutets lokaler — en journalist som kontrollerar ett påstående, en student, en anställd som vill veta vilket avtal som gäller. Målet är att få veta vilket avtal som gäller ett område, hur länge det löper och om det har omförhandlats, och att kunna ta med sig svaret. Besökaren har ingen inloggning, ingen introduktion och ett försök.

### Arbetsflöde

#### 1. Den publika ingången

*Roll: Publik dator · `/allmanheten`*

Ingen inloggningssida, och det är avsiktligt: NFÅ-001 lägger autentiseringen hos Försäkringskassans IdP för personalen, och NFÅ-006 begränsar publik åtkomst till Medlingsinstitutets egen IP-adress — datorn i rummet är legitimationen.

![Den publika ingången](../screenshots/flode/public-01-den-publika-ingangen.png)

<small>Krav: NFÅ-006, FR-011</small>

#### 2. Sök efter avtal på bransch eller avtalsområde

*Roll: Publik dator · `/allmanheten`*

Skriv ett ord så smalnar listan av medan du skriver. Under fritexten ligger bransch först — en besökare tänker i branscher långt innan hen tänker i arbetsgivarorganisationer — och sedan Medlingsinstitutets egna tre kriterier ur Bilaga F:s Rapport 1 och ett datum för vad som gällde vid en viss tidpunkt.

![Sök efter avtal på bransch eller avtalsområde](../screenshots/flode/public-02-sok-efter-avtal-pa-bransch-eller-avtalso.png)

<small>Krav: FR-001, FR-003, FR-011</small>

#### 3. Avgränsa träfflistan

*Roll: Publik dator · `/allmanheten`*

Varje valt kriterium blir en chip som går att ta bort ett i taget, och tabellen smalnar av på riktigt. Sekretessmarkerade avtal står kvar i listan och räknas med — det som utelämnas är deras uppgifter, och de utelämnas i markupen, inte i stilmallen. Bara publicerade avtal finns här: ett halvregistrerat avtal på den publika datorn vore myndigheten som publicerar ett utkast.

![Avgränsa träfflistan](../screenshots/flode/public-03-avgransa-trafflistan.png)

<small>Krav: FR-003, FR-011, D-002</small>

#### 4. Ta del av avtalet

*Roll: Publik dator · `/allmanheten/A-013`*

Bilaga F:s Rapport 1 i sin helhet: parter, avtalsområde, bransch, löptider per avtalsrörelse, uppsägning och prolongering, och de länkade handlingarna. Inga löneuppgifter — kostnadsram och löneutrymme är myndighetens arbetsmaterial, och det här är utlämnandet.

![Ta del av avtalet](../screenshots/flode/public-04-ta-del-av-avtalet.png)

<small>Krav: FR-011, D-002, FA-002</small>

#### 5. Öppna och ladda ned

*Roll: Publik dator · `/allmanheten/A-013`*

Två uttag, och båda körs. Utskriften får Medlingsinstitutets brevhuvud och ett utskriftsdatum och kan sparas som PDF i webbläsaren; nedladdningen skriver en riktig CSV-fil ur uppgifterna på skärmen, utan serverdrift (FR-013). Besökarens uppgift slutar med att svaret följer med hem, och en streckad knapp hade avslutat det bedömda scenariot på en kontroll som inte gör något.

![Öppna och ladda ned](../screenshots/flode/public-05-oppna-och-ladda-ned.png)

<small>Krav: FR-011, FR-013</small>

### Användbarhet, effektivitet och tillgänglighet

En skärm, ett sökfält, ett resultat. Ingen meny, ingen inloggning, inget internt fackspråk och inget som går att redigera. Besökaren behöver aldrig välja i en lista innan hen kan börja — hen skriver, och det som skrivits visas som ett borttagbart filter ovanför resultatet så det alltid framgår vad listan är en lista över. Det här är rollen där tillgängligheten betyder mest: vyn är verifierad från 375 till 1920 pixlar utan horisontell scroll, med 0 fel från axe, och varje status bärs av färg, form och ord.

---

## Medlingsärenden och partsträffar

**Kompletterande scenario** · Roll: Medlingsadministratör · 2 steg

### Uppgift och mål

Medlingsadministratören skapar ett medlingsärende ur ett generaldirektörsbeslut och håller partsträffar inför avtalsrörelsen. Partsträffsvyn är den mest särpräglade skärmen i systemet: den används live, under mötet.

### Arbetsflöde

#### 1. Medlingsärendet [AI-stöd]

*Roll: Medlingsadministratör · `/medling/M-2027-12`*

Skapat ur GD-beslutet, med §4.1:s beslutsstöd och dokumentmallen med och utan varsel. Ärendet är fyra flikar, eftersom det är fyra olika arbetsuppgifter: **Ärendet** är vad GD beslutade och vilka avtal det omfattar, **Medlare** är förordnandet, **Handlingar** är GD-beslutet och klarmarkeringen, och **Utfall** är vad medlingen gav. Det som varje uppgift utförs mot — förhandlingsordningen, beslutsstödet och Märket — står kvar i högerspalten oavsett flik. Medlarlistan visar bara aktiva medlare som tar den här medlingstypen. Utfallet är underlaget för Medlingsinstitutets statistik över stridsåtgärder — förlorade arbetsdagar och berörda anställda visas bara när det förekom en stridsåtgärd, eftersom en nolla i den kolumnen är en mätning och inte en frånvaro. GD-beslutets nummer och datum går inte att ändra: de kommer ur ett beslut, inte ur registret.

![Medlingsärendet](../screenshots/flode/mediation-admin-01-medlingsarendet.png)

<small>Krav: FF-006, FF-007, FF-008, FF-009, FF-010, FSD-001</small>

#### 2. Partsträffen [AI-stöd]

*Roll: Medlingsadministratör · `/partstraffar/PT-2027-05`*

Inför, under och efter mötet. Ett yrkande kan lyftas till bevakningsordstabellen och börjar då markera text i protokoll som kommer in månader senare.

![Partsträffen](../screenshots/flode/mediation-admin-02-partstraffen.png)

<small>Krav: FF-004, FF-005, FAI-004, FSD-002</small>

### Användbarhet, effektivitet och tillgänglighet

Tre skeden, och det mellersta är en inmatningsyta snarare än en sammanfattning — anteckningar tidsstämplas när de skrivs, och ett yrkande blir en post i samma stund det hörs.

---

## Sammansatt sökning och uttag

**Kompletterande scenario** · Roll: Statistikanvändare · 1 steg

### Uppgift och mål

Statistikanvändaren bygger en sammansatt fråga över avtalsinformationen och tar ut resultatet. Rollen är läsande: §3.1 ger den läsa och datauttag, och behörighetsmatrisen säger samma sak.

### Arbetsflöde

#### 1. Sökbyggaren [AI-stöd]

*Roll: Statistikanvändare · `/sok`*

Ovanför byggaren går det att beskriva sökningen i en mening. Förslaget visar vilket register och vilka villkor maskinen läste ut, med de ord varje villkor lästes ur, och ingenting ställs in förrän handläggaren godkänt det — det som inte kunde tolkas står också där. FR-002:s val av informationstyp är ett val av vilket register som söks: fyra flikar med var sina rader, var sina kriterier och var sina kolumner. Villkoren är fält, operator och värde; grupperna kombineras med OCH och villkoren inom en grupp med OCH eller ELLER, vilket är formen W3D3 inte klarar. Det finns ingen Sök-knapp — resultatet smalnar av medan urvalet ändras. Bokslutsdatumet visas bara där raderna har löptider. Varje träff öppnar sin egen post, presentationskolumnerna tas bort ur både tabellen och utskriften, och ett sparat urval laddas: det är urvalet som sparas, aldrig träffarna.

![Sökbyggaren](../screenshots/flode/statistics-user-01-sokbyggaren.png)

<small>Krav: FR-002, FR-003, FR-004, FAI-002</small>

### Användbarhet, effektivitet och tillgänglighet

Villkoren skrivs ut som en läsbar mening, så en fråga med grupperingar går att kontrollera utan att läsa formuläret bakåt.

---

## Medlarregistret

**Kompletterande scenario** · Roll: Medlaradministratör · 1 steg

### Uppgift och mål

Medlaradministratören underhåller registret över medlare och använder statistiken per medlare — år, avtalsområde och position ettan eller tvåan — som underlag när en medlare ska utses.

### Arbetsflöde

#### 1. Medlarregistret

*Roll: Medlaradministratör · `/medlare`*

Registret går att underhålla, inte bara läsa: kontaktuppgifter och medlingstyper ändras på raden, en ny medlare läggs till från registrets egen rubrikrad — samma formulär som rättar en befintlig, eftersom det är samma fält, och en medlare som slutat inaktiveras i stället för att raderas — FF-009:s statistik per medlare skulle annars försvinna med personen. Uppdrag, ettan, tvåan och senaste år räknas ur uppdragshistoriken och går inte att skriva in.

![Medlarregistret](../screenshots/flode/mediator-admin-01-medlarregistret.png)

<small>Krav: FF-009, FE-001, D-004</small>

### Användbarhet, effektivitet och tillgänglighet

Statistiken härleds ur uppdragen i stället för att lagras, så registret aldrig kan säga något annat än de medlingsärenden det sammanfattar.

---
