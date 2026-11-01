
const Budget = require("../models/Budget");

// GET ALL BUDGETS FOR A SELECTED MONTH
const getBudgets = async (req, res) => {
  try {
    const currentDate = new Date();

    const month = Number(req.query.month) || currentDate.getMonth() + 1;
    const year = Number(req.query.year) || currentDate.getFullYear();

    if (month < 1 || month > 12 || year < 2000) {
      return res.status(400).json({
        message: "Invalid month or year.",
      });
    }

    const budgets = await Budget.find({
      user: req.user.id,
      month,
      year,
    }).sort({ category: 1 });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch budgets.",
      error: error.message,
    });
  }
};

// CREATE A NEW BUDGET
const addBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || amount === undefined || !month || !year) {
      return res.status(400).json({
        message: "Please provide category, amount, month and year.",
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Budget amount must be greater than zero.",
      });
    }

    const budgetMonth = Number(month);
    const budgetYear = Number(year);

    if (
      !Number.isInteger(budgetMonth) ||
      budgetMonth < 1 ||
      budgetMonth > 12 ||
      !Number.isInteger(budgetYear) ||
      budgetYear < 2000
    ) {
      return res.status(400).json({
        message: "Please provide a valid month and year.",
      });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category: category.trim(),
      amount: Number(amount),
      month: budgetMonth,
      year: budgetYear,
    });

    res.status(201).json({
      message: "Budget created successfully.",
      budget,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A budget for this category already exists for this month.",
      });
    }

    res.status(400).json({
      message: "Failed to create budget.",
      error: error.message,
    });
  }
};

// UPDATE AN EXISTING BUDGET
const updateBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Budget amount must be greater than zero.",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { amount: Number(amount) },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found.",
      });
    }

    res.status(200).json({
      message: "Budget updated successfully.",
      budget,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update budget.",
      error: error.message,
    });
  }
};

// DELETE A BUDGET
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found.",
      });
    }

    res.status(200).json({
      message: "Budget deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete budget.",
      error: error.message,
    });
  }
};

module.exports = {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
};
