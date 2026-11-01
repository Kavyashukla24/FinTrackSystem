const Transaction = require("../models/Transaction");

// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id
    }).sort({ date: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
};

// ADD TRANSACTION
const addTransaction = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      date,
      description
    } = req.body;

    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero"
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense"
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount: Number(amount),
      type,
      category,
      date: date || Date.now(),
      description
    });

    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add transaction",
      error: error.message
    });
  }
};

// UPDATE TRANSACTION
const updateTransaction = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      date,
      description
    } = req.body;

    if (amount !== undefined &&
        (!Number.isFinite(Number(amount)) || Number(amount) <= 0)) {
      return res.status(400).json({
        message: "Amount must be greater than zero"
      });
    }

    if (type !== undefined &&
        !["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Invalid transaction type"
      });
    }

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (amount !== undefined) updates.amount = Number(amount);
    if (type !== undefined) updates.type = type;
    if (category !== undefined) updates.category = category;
    if (date !== undefined) updates.date = date;
    if (description !== undefined) updates.description = description;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.status(200).json(transaction);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update transaction",
      error: error.message
    });
  }
};

// DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete transaction",
      error: error.message
    });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
};