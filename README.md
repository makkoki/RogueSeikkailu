# Rogue-seikkailu selaimessa

Tämä hakemisto sisältää pienen, lapsille ja nuorille sopivan 2D-roguelike-pelin,
jonka voi avata suoraan selaimessa. Pelaaja tutkii viittä luolatasoa, taistelee
kirjaimilla merkittyjä vihollisia vastaan, kerää varusteita ja etsii alimman
huoneen aarretta.

## Käynnistä peli

Peli ei tarvitse kirjastoja tai käännösvaihetta. Käynnistä paikallinen palvelin:

```bash
python3 -m http.server 8000
```

Avaa sitten <http://localhost:8000>. Liiku nuolinäppäimillä tai WASD-näppäimillä.
Mobiilissa voit käyttää ruudun nuolipainikkeita. Astu portaalle vaihtaaksesi
luolatasoa. Tavoitteesi on löytää viidennen luolan kultainen Valotähti (`★`).

## Peliohje

- Liiku nuolinäppäimillä, WASD-näppäimillä tai mobiilin nuolipainikkeilla.
- Viholliset liikkuvat jokaisen vuorosi jälkeen kohti pelaajaa. Kun vihollinen
  pääsee viereesi, sen osuma vähentää kuntoasi. Peli päättyy kun kunto loppuu.
- Tuhoa vihollinen **liikkumalla sitä kohti**. Tällöin hyökkäät liikkumisen
  sijaan. Hyökkää uudelleen, kunnes vihollisen kestopisteet loppuvat.
- Kerää taikavaruste (`!`): se kasvattaa hyökkäysvoimaa yhdellä, kasvattaa
  enimmäiskuntoa kahdella ja palauttaa kuntosi täyteen.
- Portaat `>` vievät seuraavaan luolaan ja portaat `<` edelliseen. Voit palata
  hakemaan väliin jääneen varusteen.

### Viholliset

| Merkki | Vihollinen | Ominaisuudet |
| --- | --- | --- |
| `S` | Sammalmönkijä | 2 kestopistettä, liikkuu joka toisella vuorolla ja tekee 1 vahinkoa. |
| `L` | Lepakko | 1 kestopiste, liikkuu joka vuorolla ja tekee 1 vahinkoa. |
| `V` | Kivivartija | 3 kestopistettä, liikkuu joka vuorolla ja tekee 2 vahinkoa. |

Vihollinen ei voi liikkua seinän tai toisen vihollisen läpi. Se voi kuitenkin
kiertää esteen, joten seuraa sen liikettä ja käytä luolan käytäviä hyväksesi.

## Kuinka tällainen peli tehdään Codexilla

1. **Kuvaile pieni ensimmäinen versio.** Kerro Codexille ruudukon koko,
   ohjaus, huoneiden määrä, viholliset, varusteet ja voittotilanne. Pyydä ensin
   toimiva prototyyppi ilman ulkoisia kirjastoja.
2. **Jaa peli järjestelmiin.** Tässä versiossa kartta, pelaaja, vuorot,
   taistelu, esineet, tasojen vaihto ja piirtäminen ovat erillisiä funktioita
   tiedostossa `game.js`. Näin Codexille voi pyytää yhden muutoksen kerrallaan.
3. **Testaa jokainen muutos.** Pyydä Codexia tarkistamaan JavaScriptin syntaksi,
   käynnistämään paikallinen palvelin ja kokeile itse ainakin liikkuminen,
   taistelu, portaat, varusteiden keruu, häviö ja voitto.
4. **Laajenna pienin askelin.** Seuraavia hyviä pyyntöjä ovat esimerkiksi
   “lisää äänen mykistyspainike”, “tallenna peli localStorageen” tai “tee
   kartoista satunnaisia mutta aina läpäistäviä”.
5. **Pidä sisältö ikätasoisena.** Käytä sävyltään kevyttä seikkailua,
   vältä pelottavaa kuvastoa ja anna tappion jälkeen helppo uusi yritys.

Esimerkkipyyntö Codexille:

> Tee HTML-, CSS- ja JavaScript-tiedostoihin vuoropohjainen ruudukkopeli.
> Käytä Canvasia ilman ulkoisia riippuvuuksia. Lisää kaksi luolatasoa, kaksi
> sivuhuonetta tai umpikujaa per taso, portaat ylös ja alas, kirjainviholliset,
> kerättäviä varusteita ja alimman tason palkinto. Tee käyttöliittymästä
> saavutettava ja lisää mobiiliohjaimet. Tarkista lopuksi JavaScriptin syntaksi.

## Projektin rakenne

- `index.html` – käyttöliittymä ja Canvas-pelialue
- `styles.css` – responsiivinen, selkeä ulkoasu
- `game.js` – pelitila, kartat, vuorot, taistelu ja piirtäminen
