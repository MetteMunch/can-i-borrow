import {Router} from 'express';
import db from "../db/db.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = Router();

router.get("/item/:itemId", async (req, res) => {
    const allReservationsSpecificItem = await db.all(`
        SELECT *
        FROM reservations
        WHERE item_id = ?`, req.params.itemId);
    res.send(allReservationsSpecificItem);
});

router.get("/my-requests", isLoggedIn, async  (req,res) => {
    const allMyRequests = await db.all(`
    SELECT reservations.*, items.item, users.fullname AS owner_name FROM reservations
    JOIN items ON items.id = reservations.item_id
    JOIN users ON users.id = items.owner_id
    WHERE reservations.requested_by = ? `, req.session.user.id);
    console.log("Prøver at kalde allMyRequests", allMyRequests)
    res.send({data: allMyRequests});
});

router.get("/my-loans", isLoggedIn, async  (req,res) => {
    const allMyLoans = await db.all(`
    SELECT reservations.*, items.item, users.fullname AS owner_name FROM reservations
    JOIN items ON items.id = reservations.item_id
    JOIN users ON users.id = items.owner_id
    WHERE reservations.requested_by = ? AND reservations.status = 'APPROVED'`, req.session.user.id);
    console.log("Prøver at alle kalde allMyLoans", allMyLoans);
    res.send({data: allMyLoans});
});



router.post("/request", isLoggedIn, async (req, res) => {
    const {item_id, start_date, end_date} = req.body;

    try {
        const makeRequest = await db.run(`
            INSERT INTO reservations (item_id, start_date, end_date, requested_by)
            VALUES (?, ?, ?, ?)`, item_id, start_date, end_date, req.session.user.id);

        const getRequest = await db.get(`
        SELECT * FROM reservations WHERE id = ?`, makeRequest.lastID);

        res.status(201).send({
            message: "request created",
            request: getRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({error: "Could not create request"});
    }

});

router.put("/:reservationId/approve", async (req,res) => {

    await db.run(`
    UPDATE reservations SET status = 'APPROVED' WHERE id = ?`, req.params.reservationId);

    const getAppReservation = await db.get(`
    SELECT * FROM reservations WHERE id = ?`, req.params.reservationId);

    res.status(200).send({
        message: "request approved",
        request: getAppReservation
    });
});

export default router;