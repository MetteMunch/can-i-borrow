import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from "../db/db.js";
import {sendResetEmail} from "../utils/email.js";

const router = Router();

router.post('/signup', async (req, res) => {
    const {fullname, username, email, password, address, phone} = req.body;

    if (!fullname || !username || !email || !password || !address || !phone) {
        return res.status(400).send({message: "Missing required fields"});
    }

    //Jeg anvender db.get da jeg ved, at denne quiry vil maksimalt returnere en række
    const checkExistingUser = await db.get('SELECT * FROM users WHERE username = ?;', username);

    if (checkExistingUser) {
        return res.status(400).send({message: "Username already taken"});
    }

    const hashedPassword = await bcrypt.hash(password, 14);
    const role = "USER";

    try {
        await db.run(
            'INSERT INTO users (fullname, username, email, password, role, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            fullname, username, email, hashedPassword, role, address, phone);

        res.send({message: 'User created successfully'});
    } catch (err) {
        res.status(500).send({error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);

    if (!user) return res.status(401).send({message: 'Invalid username'});

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send({message: 'Invalid password'});

    req.session.user = {id: user.id, username: user.username, role: user.role};
    res.send({message: 'Logged in successfully', user: req.session.user});
});

import {isLoggedIn, isAdmin} from "../middleware/auth.js";

router.get("/secret", isLoggedIn, (req, res) => {
    res.send({data: "You are logged in and can use this secret path"});
});

router.get("/admindashboard", isAdmin, (req, res) => {
    res.send({data: "welcome to admin dashboard"});
});

// route til tjek af email udsendelse ved glemt passowrd (sker ikke virkelig ændring)

router.post("/forgot-password", async (req, res) => {
    const {email} = req.body;

    try {
        await sendResetEmail(email);
        res.send({message: "Hvis emailen findes, er der sendt en besked."});
    } catch (err) {
        console.error(err);
        res.status(500).send({message: "Kunne ikke sende email."});
    }
});

export default router;
