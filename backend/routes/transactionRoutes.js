const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// ===== ADD TRANSACTION =====
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;

    const newTransaction = new Transaction({
      user_id: req.user,
      type,
      category,
      amount,
      date
    });

    await newTransaction.save();

    res.status(201).json({ message: "Transaction added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ===== GET ALL USER TRANSACTIONS =====
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user_id: req.user })
      .sort({ date: -1 });   // newest first

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;