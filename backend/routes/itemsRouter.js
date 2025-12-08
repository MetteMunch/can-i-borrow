import {Router} from 'express';
import db from "../db/db.js";

const router = Router();


router.get("/", async (req, res) => {
    const items = await db.all("SELECT * FROM items;");
    res.send(items);
});

router.post("/", async (req, res) => {
    const {item, description, image_url} = req.body;

    try {
        const newItem = await db.run(`
            INSERT INTO items (item, description, owner_id, image_url)
            VALUES (?, ?, ?, ?)`, item, description, req.session.user.id, image_url);

        const createdItem = await db.get(`
        SELECT * FROM items WHERE id = ? `, newItem.lastID);

        res.status(201).send({
            message: "item created",
            item: createdItem
        });

    } catch (error) {
        console.error(err);
        res.status(500).send({ error: "Could not create item" });
    }

});


export default router;