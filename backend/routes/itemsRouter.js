import {Router} from 'express';
import db from "../db/db.js";
import {isLoggedIn} from "../middleware/auth.js";

const router = Router();


router.get("/", async (req, res) => {
    const allItems = await db.all("SELECT items.*, users.fullname AS owner_name FROM items JOIN users ON users.id = items.owner_id;");
    res.send({ data: allItems });
});

router.get("/my-items", isLoggedIn, async (req, res) => {
    const allOfMyItems = await db.all(`SELECT * FROM items WHERE owner_id = ?`, req.session.user.id);
    console.log("Prøver at hente alle mine items", allOfMyItems)
    res.send({
        data: allOfMyItems
    });
});


router.get("/:itemId", async (req, res) => {
    const specificItem = await db.get("SELECT items.*, users.fullname AS owner_name, users.phone AS owner_phone FROM items JOIN users ON users.id = items.owner_id WHERE items.id = ?", req.params.itemId);
    res.status(200).send({
        data: specificItem
    });
});


router.post("/", isLoggedIn, async (req, res) => {
    const {item, description, image_url} = req.body;

    try {
        const newItem = await db.run(`
            INSERT INTO items (item, description, owner_id, image_url)
            VALUES (?, ?, ?, ?)`, item, description, req.session.user.id, image_url);

        const createdItem = await db.get(`
            SELECT *
            FROM items
            WHERE id = ? `, newItem.lastID);

        res.status(201).send({
            message: "item created",
            item: createdItem
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({error: "Could not create item"});
    }

});


export default router;