import {Router} from 'express';
import db from "../db/db.js";
import {isLoggedIn} from "../middleware/auth.js";

const router = Router();

router.get("/item/:itemId", async (req, res) => {
    const allReservationsSpecificItem = await db.all(`
        SELECT *
        FROM reservations
        WHERE item_id = ?`, req.params.itemId);
    res.send(allReservationsSpecificItem);
});

router.get("/my-requests", isLoggedIn, async (req, res) => {
    const allMyRequests = await db.all(`
        SELECT reservations.*, items.item, users.fullname AS owner_name
        FROM reservations
                 JOIN items ON items.id = reservations.item_id
                 JOIN users ON users.id = items.owner_id
        WHERE reservations.requested_by = ? `, req.session.user.id);
    res.send({data: allMyRequests});
});

router.get("/received", isLoggedIn, async (req, res) => {
    const myReceivedRequestsAndReservations = await db.all(`
        SELECT reservations.*, items.item, users.fullname AS borrowers_name, users.phone AS borrowers_phone
        FROM reservations
                 JOIN users ON users.id = reservations.requested_by
                 JOIN items ON items.id = reservations.item_id
        WHERE items.owner_id = ?`, req.session.user.id);
    res.send({data: myReceivedRequestsAndReservations});
});

router.post("/request", isLoggedIn, async (req, res) => {
    const {item_id, start_date, end_date} = req.body;

    try {
        const makeRequest = await db.run(`
            INSERT INTO reservations (item_id, start_date, end_date, requested_by)
            VALUES (?, ?, ?, ?)`, item_id, start_date, end_date, req.session.user.id);

        const reservationInfo
            = await db.get(`
            SELECT reservations.*, items.item, items.owner_id
            FROM reservations
            JOIN items ON items.id = reservations.item_id
            WHERE reservations.id = ?`, makeRequest.lastID);

        const io = req.app.get("io");
        io.to(`user-${reservationInfo.owner_id}`).emit("new-loan-request", {
            item: reservationInfo.item
        });

        res.status(201).send({
            message: "request created",
            request: reservationInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({error: "Could not create request"});
    }

});

router.put("/:reservationId/approve", async (req, res) => {

    await db.run(`
        UPDATE reservations
        SET status = 'APPROVED'
        WHERE id = ?`, req.params.reservationId);

    const getAppReservation = await db.get(`
        SELECT reservations.id, reservations.requested_by, items.item
        FROM reservations
        JOIN items ON items.id = reservations.item_id
        WHERE reservations.id = ?`, req.params.reservationId);

    const io = req.app.get("io");
    io.to(`user-${getAppReservation.requested_by}`)
        .emit("request-approved", {
            item: getAppReservation.item
        });

    res.status(200).send({
        message: "request approved",
        request: getAppReservation
    });
});

router.delete("/:reservationId", isLoggedIn, async (req, res) => {
    const reservationInfo = await db.get(`
        SELECT reservations.requested_by,
               items.item
        FROM reservations
        JOIN items ON items.id = reservations.item_id
        WHERE reservations.id = ?`, req.params.reservationId);

    await db.run(`
        DELETE FROM reservations
        WHERE id = ?`, req.params.reservationId);

    const io = req.app.get("io");
    io.to(`user-${reservationInfo.requested_by}`)
        .emit("request-declined", {
            item: reservationInfo.item
        });

    res.send({ message: "Reservation deleted" });
});

export default router;