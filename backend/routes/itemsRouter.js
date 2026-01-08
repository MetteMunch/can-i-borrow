import { Router } from 'express';
import db from '../db/db.js';
import { isLoggedIn } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const allItems = await db.all(
    'SELECT items.*, users.fullname AS owner_name FROM items JOIN users ON users.id = items.owner_id;'
  );
  res.send({ data: allItems });
});

router.get('/my-items', isLoggedIn, async (req, res) => {
  const allOfMyItems = await db.all(`SELECT * FROM items WHERE owner_id = ?`, req.session.user.id);
  res.send({
    data: allOfMyItems,
  });
  console.log("userId fra hentning af mine items", req.session.user.id);
});

router.get('/:itemId', async (req, res) => {
  const specificItem = await db.get(
    'SELECT items.*, users.fullname AS owner_name, users.phone AS owner_phone FROM items JOIN users ON users.id = items.owner_id WHERE items.id = ?',
    req.params.itemId
  );
  res.status(200).send({
    data: specificItem,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { item, description, image_url } = req.body;

  try {
    const newItem = await db.run(
      `
            INSERT INTO items (item, description, owner_id, image_url)
            VALUES (?, ?, ?, ?)`,
      item,
      description,
      req.session.user.id,
      image_url
    );

    const createdItem = await db.get(
      `
            SELECT *
            FROM items
            WHERE id = ? `,
      newItem.lastID
    );

    res.status(201).send({
      message: 'item created',
      item: createdItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Could not create item' });
  }
});

router.put('/:itemId', isLoggedIn, async (req, res) => {
  const { item, description, image_url } = req.body;
  const itemId = req.params.itemId;
  const userId = req.session.user.id;

  // tjek at item findes og at du ejer det
  const existing = await db.get('SELECT * FROM items WHERE id = ?', itemId);

  if (!existing) {
    return res.status(404).send({ message: 'Item findes ikke' });
  }

  if (existing.owner_id !== userId) {
    return res.status(403).send({ message: 'Du har ikke rettighed til at redigere denne genstand' });
  }

  // behold eksisterende værdier hvis noget mangler
  const newItem = item?.trim() ?? existing.item;
  const newDesc = description?.trim() ?? existing.description;
  const newImage = image_url?.trim() ?? existing.image_url;

  await db.run(
    `
      UPDATE items
      SET item = ?, description = ?, image_url = ?
      WHERE id = ?
    `,
    newItem,
    newDesc,
    newImage,
    itemId
  );

  const updated = await db.get('SELECT * FROM items WHERE id = ?', itemId);

  res.send({ message: 'Item opdateret', data: updated });
});

router.delete('/:itemId', isLoggedIn, async (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.session.user.id;

  const existing = await db.get('SELECT * FROM items WHERE id = ?', itemId);

  if (!existing) {
    return res.status(404).send({ message: 'Item findes ikke' });
  }

  if (existing.owner_id !== userId) {
    return res.status(403).send({ message: 'Du har ikke rettighed til at slette denne genstand' });
  }

  // (valgfrit men anbefalet) blokér sletning hvis der findes reservationer
  const hasReservations = await db.get(
    'SELECT 1 FROM reservations WHERE item_id = ? LIMIT 1',
    itemId
  );

  if (hasReservations) {
    return res.status(400).send({
      message: 'Genstanden kan ikke slettes, fordi der findes reservationer/anmodninger på den.',
    });
  }

  await db.run('DELETE FROM items WHERE id = ?', itemId);

  res.send({ message: 'Item slettet' });
});



export default router;
