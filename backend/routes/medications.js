import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', (req, res) => {
  const { name, dosage, frequency } = req.body;
  const userId = req.user.id;

  db.run(`INSERT INTO medications (user_id, name, dosage, frequency) VALUES (?, ?, ?, ?)`,
    [userId, name, dosage, frequency],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

router.get('/', (req, res) => {
  db.all(`SELECT * FROM medications WHERE user_id = ?`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.patch('/:id/taken', (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE medications SET is_taken_today = 1 WHERE id = ? AND user_id = ?`, [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes > 0 });
  });
});

router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM medications WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});

export default router;
