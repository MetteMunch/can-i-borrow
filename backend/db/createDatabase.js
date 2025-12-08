import 'dotenv/config';
import  db  from './db.js';
import bcrypt from 'bcryptjs';

// db.exec - kører DCL og DDL quiries mod databasen (DDL er oprettelse af tabeller mm, og DCL er oprettelse og auth af brugere
// db.run - er med parametre og til INSERT, UPDATE, DELETE
// db.all - er til SELECT

/*
Conventions for SQL
use lowercase
use snake case
use plural for tables
*/

const deleteTableMode = process.argv.includes('delete'); //når vi kører i dette mode, så droppes tabeller
const updateTableMode = process.argv.includes('update'); //når vi kører i dette mode, så oprettes tabeller
const insertDataMode = process.argv.includes('insert'); //når vi kører i dette mode, så indsætter vi init data

if(deleteTableMode) {
    await db.exec(`
        DROP TABLE IF EXISTS reservations;
    `);

    await db.exec(`
        DROP TABLE IF EXISTS items;
    `);

    await db.exec(`
        DROP TABLE IF EXISTS users;
    `);
}

if(updateTableMode) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname VARCHAR (200) NOT NULL,
            username VARCHAR (50) UNIQUE NOT NULL,
            address VARCHAR (200) NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone INTEGER UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK (role IN ("ADMIN","USER") )
            );

        CREATE TABLE IF NOT EXISTS items
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item VARCHAR (100) NOT NULL,
            description VARCHAR (500) NOT NULL,
            owner_id INTEGER NOT NULL,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id)
            );

        CREATE TABLE IF NOT EXISTS reservations
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            status TEXT CHECK (status IN ('BLOCKED','REQUESTED','APPROVED')) NOT NULL,
            requested_by INTEGER,
            FOREIGN KEY (item_id) REFERENCES items(id),
            FOREIGN KEY (requested_by) REFERENCES users(id)
            );
    `);
}

if(insertDataMode) {
   const adminpassword = await bcrypt.hash(process.env.ADMINPASS, 14);
   const userpassword = await bcrypt.hash(process.env.USERPASS, 14);

   await db.run(`
        INSERT INTO users (fullname, username, email, password, role, address, phone)
        VALUES ('Mette Munch Hansen', 'Tøl70-1', 'admin@mail.dk', ? , 'ADMIN', 'Tølløsevej 70, 1', 29840737);
   `,adminpassword);

   await db.run(`
        INSERT INTO users (fullname, username, email, password, role, address, phone)
        VALUES ('Alm Bruger', 'Tøl66', 'alm@mail.dk', ?, 'USER', 'Tølløsevej 66', 12345678);
   `,userpassword);

   await db.exec(`
        INSERT INTO items (item, description, owner_id, image_url)
        VALUES ('Pælebor', 'Skal du grave huller til stolper eller lignende og er stærk (den er uden motor), så kan du låne denne', 2, 'https://photos.google.com/photo/AF1QipO5wiUkTT1keMOrqsepT_rys5aTR5JGJd7pe-UC')
   
   `);

   await db.exec(`
        INSERT INTO reservations (item_id, start_date, end_date, status, requested_by)
        VALUES (1,'2025-12-08T08:56:51.000Z','2025-12-09T09:00:00.000Z','REQUESTED',1);
   `);
}

