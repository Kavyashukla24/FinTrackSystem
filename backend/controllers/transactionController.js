
const Transaction = require("../models/Transaction");

// Get today's date in India (YYYY-MM-DD)
const getTodayDate = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;

  return `${year}-${month}-${day}`;
};

// Validate transaction date
const validateTransactionDate = (date) => {
  if (!date) {
    return { date: new Date(), error: null };
  }

  let parsedDate;
  let dateString;

  if (
    typeof date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      return {
        date: null,
        error: "Please provide a valid date.",
      };
    }

    dateString = date;
  } else {
    parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return {
        date: null,
        error: "Please provide a valid date.",
      };
    }

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(parsedDate);

    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;

    dateString = `${year}-${month}-${day}`;
  }

  if (dateString > getTodayDate()) {
    return {
      date: null,
      error: "Transaction date cannot be in the future.",
    };
  }

  return {
    date: parsedDate,
    error: null,
  };
};

// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
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
      description,
    } = req.body;

    if (!title || amount === undefined || !type) {
      return res.status(400).json({
        message: "Please provide title, amount and transaction type.",
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero.",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense.",
      });
    }

    // Category is required only for expenses
    if (type === "expense" && !category?.trim()) {
      return res.status(400).json({
        message: "Please select a category for your expense.",
      });
    }

    // Validate date
    const dateResult = validateTransactionDate(date);

    if (dateResult.error) {
      return res.status(400).json({
        message: dateResult.error,
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title: title.trim(),
      amount: Number(amount),
      type,
      category: type === "income" ? "" : category.trim(),
      date: dateResult.date,
      description: description || "",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add transaction",
      error: error.message,
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
      description,
    } = req.body;

    // Find transaction belonging to logged-in user
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    const updatedType = type !== undefined
      ? type
      : transaction.type;

    if (!["income", "expense"].includes(updatedType)) {
      return res.status(400).json({
        message: "Invalid transaction type.",
      });
    }

    if (
      amount !== undefined &&
      (!Number.isFinite(Number(amount)) || Number(amount) <= 0)
    ) {
      return res.status(400).json({
        message: "Amount must be greater than zero.",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: "Transaction title cannot be empty.",
      });
    }

    // Income has no category
    const updatedCategory =
      updatedType === "income"
        ? ""
        : category !== undefined
          ? category.trim()
          : transaction.category;

    if (updatedType === "expense" && !updatedCategory) {
      return res.status(400).json({
        message: "Please select a category for your expense.",
      });
    }

    // Validate date if supplied
    if (date !== undefined) {
      const dateResult = validateTransactionDate(date);

      if (dateResult.error) {
        return res.status(400).json({
          message: dateResult.error,
        });
      }

      transaction.date = dateResult.date;
    }

    // Update fields
    if (title !== undefined) {
      transaction.title = title.trim();
    }

    if (amount !== undefined) {
      transaction.amount = Number(amount);
    }

    transaction.type = updatedType;
    transaction.category = updatedCategory;

    if (description !== undefined) {
      transaction.description = description;
    }

    const updatedTransaction = await transaction.save();

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};

// DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
