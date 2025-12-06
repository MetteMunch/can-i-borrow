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
            role TEXT CHECK( role IN ("ADMIN", "USER") )
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
}

