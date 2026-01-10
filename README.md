# Problemdomæne

I vores lille Grundejerforening i Brønshøj bestående af 40 boliger vil vi gerne
have en applikation, som gør det nemt at låne og udlåne diverse udstyr.

---

# Overordnet oversigt - Brugerens vej i appen

![Flowbillede](images_README/flowBillede.jpg)

---

# Opsætningsguide

Her er en guide til at få projektet sat korrekt op med backend,
database og miljøvariabler.

---

## Indledende opsætning

1.  Navigér til `/backend`

2.  Kør følgende kommando for at oprette `database.db`:

    ```bash
    node app.js
    ```

3.  Stop serveren igen.

---

## Dotenv-fil til backend

Opret en fil ved navn `.env` i `/backend` med følgende indhold:

```env
SESSION_SECRET=dinegensuperhemmeligesecrettilsessioner
DATABASE_PATH=./database.db
ADMINPASS=<indsæt et password til en admin bruger, som oprettes ved opstart>
USERPASS=<indsæt et password til en alm bruger, som oprettes ved opstart>
```

---

## Opsætning af database

Kør følgende kommandoer i `/backend`:

### 1. Opret tabel

```bash
npm run db-update
```

Dette opretter tabellerne i databasen.

### 2. Indsæt init data

```bash
npm run db-insert
```

Dette indsætter 5 brugere i databasen:

- **Admin-bruger**
  - Brugernavn: `Tøl70`
  - Password: det du har angivet i `.env` under ADMINPASS.
- **Almindelig bruger**
  - Brugernavn: `Tøl66`
  - Password: det du har angivet i `.env` under USERPASS.

---

## Kør applikationen

Når alt er sat op, kan du starte backend og frontend samtidig ved at gå
til projektets rod `/can-i-borrow` og køre:

```bash
npm run dev
```

Applikationen vil nu være tilgængelig på:

http://localhost:5173/

---

# Udeståender pr. 16.12.25, som jeg gerne vil nå at indarbejde inden eksamen

- [x] Opsætning af filserver Hetzner S3 - Object Storage (billeder) i stedet for at gemme lokalt.
- [x] Redigeringsmuligheder på allerede oprettede genstande.
- [x] Lave ét Dashboard, som styres med role i stedet for meget redundant kode som nu.
- [x] Samle API-url ét sted.

## Alle ovenstående udeståender er blevet indarbejdet.
