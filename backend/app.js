import 'dotenv/config';
import express from 'express';

const app = express();

app.use(express.json());

import cors from 'cors';
app.use(cors({
    origin: 'http://localhost:5173', // Svelte dev server
    credentials: true,
}));

import session from 'express-session';
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

import sessionRouter from "./routes/sessionRouter.js";
app.use("/session", sessionRouter);

import authRouter from "./routes/authRouter.js";
app.use("/auth", authRouter);

import itemsRouter from "./routes/itemsRouter.js";
app.use("/items", itemsRouter);

import reservationsRouter from "./routes/reservationsRouter.js";
app.use("/reservations", reservationsRouter);

import fileRouter from "./routes/fileRouter.js";
app.use("/files", fileRouter);

import uploadRouter from "./routes/localFileRouter.js";
app.use("/uploads", uploadRouter);
app.use("/uploads", express.static("uploads"));


app.get("/test", (req, res) => {
    res.send({data: "Der er hul igennem til test"});
});

app.all("/{*splat}", (req, res) => {
    res.status(404).send({ data: "Didn't match with a route" });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is running on: ", PORT);
    //TODO; indsæt if hvis ikke server starter korrekt
});