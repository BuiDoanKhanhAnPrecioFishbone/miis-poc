# Testflöde — MIIS över ett avtalsår

*Framtaget 2026-08-24. Komplement till `docs/21-definition-of-done.md`, som
provar **defekttyper**. Det här provar **verksamheten**.*

## Varför ett år och inte en skärmlista

`docs/21` har tolv scenarier, och de är bra på det de gör: var och en är skriven
så att ett fel är entydigt, och de har hittat verkliga defekter. Men de är
organiserade efter *sätt att gå sönder på* — en kontroll som ser levande ut, en
rapport utan resultat — inte efter hur någon faktiskt arbetar.

Ett system som klarar tolv sådana prov kan fortfarande vara omöjligt att arbeta i
över ett år, eftersom felen som återstår sitter i **övergångarna**: det som en
handläggare gör i mars förutsätter det en administratör gjorde i oktober, och
ingen skärmbaserad testlista går över den skarven.

MIIS används i en avtalsrörelses takt. Så testas det i en avtalsrörelses takt.

**Fem faser, i ordning. Varje fas anger vem, vad, och vad som ska stämma efteråt
— och vad som redan är automatiserat, så att en människa bara gör det en maskin
inte kan.**

---

## Fas 1 · Inför avtalsrörelsen (okt–dec)

Ingenting registreras ännu. Det som händer är att grunden ställs i ordning, och
allt som görs fel här syns först i mars.

| # | Roll | Handling | Ska stämma efteråt |
|---|---|---|---|
| 1.1 | Behörighetsadministratör | Lägg upp en ny handläggare, tilldela roll | Personen står i registret, med datum och vem som tilldelade |
| 1.2 | Behörighetsadministratör | Byt roll på någon, återkalla på någon annan | Rollen ändrad på raden, stämpeln ny; den återkallade är inaktiv men kvar |
| 1.3 | Behörighetsadministratör | Försök inaktivera den siste behörighetsadministratören | Vägras, med skälet på kontrollen |
| 1.4 | Systemadministratör | Sätt sessionens tidsgräns till 10 min | Startsidan säger 10, varningen kommer efter 8 |
| 1.5 | Systemadministratör | Försök sätta 45 min | Vägras — NFÅ-002:s tak |
| 1.6 | Systemadministratör | Lägg till ett bevakningsord inför rörelsen | Ordet står i tabellen |
| 1.7 | Systemadministratör | Försök ta bort ett av MI:s fördefinierade ord | Vägras, med skälet på raden |
| 1.8 | Systemadministratör | Sätt en gallringsregel till 12 månader | Regeln ändrad; loggarnas regel går inte att röra |
| 1.9 | Avtalsadministratör | Registrera Märket för perioden | Märket syns i avtalsvyn och i medlarvyn |
| 1.10 | Avtalsadministratör | Lägg upp en ny part, koppla en kontaktperson | Parten finns i registret; kontakten på parten |
| 1.11 | Medlaradministratör | Lägg till en medlare, inaktivera en som slutat | Ny rad märkt *Ny*; den inaktiva erbjuds inte vid förordnande |

**Skarven som ska provas:** bevakningsordet från 1.6 måste markera text i det
protokoll som laddas upp i fas 2. Det är det enda stället i systemet där en
administratörsinställning får synlig effekt på en handläggares dag, och det är
värt att kontrollera i just den ordningen.

---

## Fas 2 · Under avtalsrörelsen (jan–apr)

Protokollen kommer in. Det här är den fas som har volym, och den enda där
tidspress är verklig.

| # | Roll | Handling | Ska stämma efteråt |
|---|---|---|---|
| 2.1 | Avtalsadministratör | Registrera ett **helt nytt** avtal manuellt | Sparat som ofullständigt; finns i registret; går att öppna |
| 2.2 | Avtalsadministratör | Försök publicera det | Vägras — registreringen är inte klar |
| 2.3 | Avtalsadministratör | Ladda upp ett protokoll, gå igenom de fem stegen | Bevakningsordet från 1.6 är markerat |
| 2.4 | Avtalsadministratör | Öppna ett AI-förslag | Stycket det lästes ur markeras i protokollet |
| 2.5 | Avtalsadministratör | **Avvisa** ett förslag | Det försvinner ur kön; siffran på Granska faller |
| 2.6 | Avtalsadministratör | Godkänn resten, avsluta flödet | Flödet slutar på avtalet, inte på registret |
| 2.7 | Avtalsadministratör | Rätta en felläst kostnadsram på löneavtalsraden | Nytt värde på raden; gammalt och nytt i ändringsloggen |
| 2.8 | Avtalsadministratör | Rätta avtalets namn i identitetspanelen | Värdet ändrat där det läses |
| 2.9 | Avtalsadministratör | Publicera ett komplett, undertecknat avtal | Badge, datum, person — och en väg till den publika vyn |
| 2.10 | Allmänhetens dator | Sök upp det nyss publicerade avtalet | **Det finns där** |

**Skarven som ska provas:** 2.9 → 2.10, med rollbyte emellan. Det är
§3.5:s nionde punkt ordagrant — *"så att det blir tillgängligt för användare med
åtkomst till publicerad information"* — och det är den övergång som var trasig
längst.

---

## Fas 3 · När förhandlingarna strandar (feb–maj)

Sällan, men det är här myndighetens kärnuppdrag ligger.

| # | Roll | Handling | Ska stämma efteråt |
|---|---|---|---|
| 3.1 | Medlingsadministratör | Öppna ärendet ur GD-beslutet | Fyra flikar; förhandlingsordningen syns oavsett flik |
| 3.2 | Medlingsadministratör | Koppla ytterligare ett avtal till ärendet | Avtalet står i listan |
| 3.3 | Medlingsadministratör | Förordna en medlare som ettan | Endast aktiva medlare med rätt medlingstyp erbjöds |
| 3.4 | Medlingsadministratör | Skapa GD-beslutet ur mallen, variant *med varsel* | Förifyllda värden med sin källa; dokumentet står kvar efter sparandet |
| 3.5 | Medlingsadministratör | Skriv ut det | Dokumentet, inte skärmen |
| 3.6 | Medlingsadministratör | Klarmarkera beslutet | Notifieringen beskrivs som utlöst |
| 3.7 | Medlingsadministratör | Registrera utfallet med stridsåtgärd | Förlorade arbetsdagar efterfrågas |
| 3.8 | Medlingsadministratör | Registrera ett utfall **utan** stridsåtgärd | De fälten efterfrågas inte |

**Skarven som ska provas:** 3.3 förutsätter 1.11. En medlare som inaktiverades i
oktober får inte gå att förordna i mars.

---

## Fas 4 · Rapportering (löpande, tyngst i maj–aug)

| # | Roll | Handling | Ska stämma efteråt |
|---|---|---|---|
| 4.1 | Avtalsadministratör | Kör **var och en** av de tio rapporterna | Alla tio ger ett dokument med urvalskriterierna överst |
| 4.2 | Avtalsadministratör | Ändra ett kriterium och kör om | Resultatet ändras, och kriterieblocket säger vad som valdes |
| 4.3 | Avtalsadministratör | Skriv ut en flersidig rapport | Sidbrytningen fungerar; ingen navigation på pappret |
| 4.4 | Avtalsadministratör | Markera avtal som exporterade i Konjunkturlönerapporten | Raderna får datum |
| 4.5 | Avtalsadministratör | Lägg upp ett schemalagt uttag, pausa ett | Nytt uttag i listan; det pausade skickar inte |
| 4.6 | Statistikanvändare | Bygg `(konstruktion 1 ELLER 2) OCH sektor privat` | Resultatet smalnar av utan att man trycker Sök |
| 4.7 | Statistikanvändare | Byt informationstyp till Parter | Andra rader, andra kriterier, andra kolumner |
| 4.8 | Statistikanvändare | Spara sökningen med ett eget namn, ladda den | Urvalet återställs — inte träffarna |

---

## Fas 5 · Löpande, hela året

| # | Roll | Handling | Ska stämma efteråt |
|---|---|---|---|
| 5.1 | Allmänhetens dator | Sök på bransch, avgränsa, öppna, skriv ut, ladda ned | Fyra handlingar, två skärmar, båda exporterna fungerar |
| 5.2 | Allmänhetens dator | Sök upp ett sekretessmarkerat avtal | Listas och räknas — men har ingen sida |
| 5.3 | Medlare | Öppna det gränssnittet | Endast Start och Rapporter; inga lönesiffror |
| 5.4 | Systemadministratör | Läs ändringsloggen efter fas 2 | Rättningarna i 2.7 och 2.8 står där med gammalt och nytt värde |
| 5.5 | Vilken som helst | Låt sessionen löpa ut | Varningen kommer; utloggningen loggas |

**Skarven som ska provas:** 5.4 är hela systemets revisionsspår. Om en rättning
från fas 2 inte går att hitta i augusti är loggen dekoration.

---

## Vad som redan är automatiserat

Kör i den här ordningen; var och en avslutas med felkod och kan grinda en
sammanslagning.

```bash
npm test          # 344 enhetstester över domänlagret
npx tsc --noEmit  # typer, och det som håller den engelska översättningen komplett
npm run lint      # arkitekturreglerna — datasömmen, inga råa button/table
npm run build     # produktionsbygge, faller på trasiga mockreferenser
npm run audit     # WCAG 2.1 AA per vy per roll, och kravtext i produktvyn
npm run sweep     # döda kontroller, konsolfel, tomma paneler, länkar som inte går
npm run scenario  # sex övergångar där rollen byts mitt i flödet
```

`npm run scenario` är den enda som byter roll mitt i ett flöde. Den kör 1.1–2.2
och 2.9–2.10 och 4.1 ovan, och den återställer sessionens egna poster vid start
så att en andra körning provar samma sak som den första.

**Två steg är avsiktligt inte automatiserade**, och det står i skriptet varför:
den siste behörighetsadministratören (1.3) och att Granska-siffran faller (2.5).
Båda gick inte att träffa stabilt från Playwright, och en kontroll som inte
hittar sitt mål är en grön som aldrig kördes. De täcks i stället av fem
enhetstester i `lib/domain/user.test.ts` respektive `useAiQueueReview`, och de
provades för hand 2026-08-24. Att lägga in dem här i en skakig form hade fått
sviten att se bredare ut och vara värd mindre.

**Vad de täcker av tabellerna ovan:** reglerna bakom nästan varje rad —
behörighet, status, publicering, gallring, sökningens sammansättning, AI-stödets
gränser. Vad de **inte** täcker är övergångarna: ingen av dem byter roll mitt i
ett flöde, och det är där felen har suttit.

**Det är därför faserna ovan görs för hand.** Inte för att automatiseringen är
svag, utan för att den mäter delar och verksamheten är en kedja.

---

## Om det bara finns tid för fem saker

I den här ordningen, och det tar tjugo minuter:

1. **2.9 → 2.10** — publicera, byt roll, hitta avtalet. §3.5:s nionde punkt.
2. **2.1 → 2.2** — registrera nytt avtal, se publiceringen vägras med skäl.
3. **2.5** — avvisa ett AI-förslag och se siffran falla. FAI-002 som ett tal.
4. **4.1** — kör tre rapporter och se att var och en ger ett dokument.
5. **1.3** — försök låsa ut den siste behörighetsadministratören.

De fem är valda av samma skäl: var och en har varit trasig, var och en är
scenariobunden, och var och en går att se på tre klick.

---

## Vad det här inte provar

**Migreringen.** Det finns ingen W3D3-data att migrera i prototypen. T-007 hör
till leveransen och beskrivs i `docs/19-arbetsprocesser-SV.md`.

**Autentiseringen.** NFÅ-001 lägger inloggningen i Försäkringskassans IdP.
Rollbytet i demoraden är ett granskningsverktyg, inte en inloggning.

**AI-modellen.** Förslagen är förberedda exempeldata. Det som provas är
gränssnittet runt dem — källkopplingen, godkännandet, avvisningen, kön — vilket
är det FAI-002 faktiskt kräver av oss.

**Volym.** Sjutton avtal, inte trehundra. NFP-003:s tre sekunder är beskrivna,
inte uppmätta.
