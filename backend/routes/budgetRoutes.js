
const express = require("express");
const router = express.Router();

const {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const authMiddleware = require("../middleware/authMiddleware");

// All budget routes require authentication
router.use(authMiddleware);

// GET all budgets for a month
router.get("/", getBudgets);

// CREATE a new budget
router.post("/", addBudget);

// UPDATE a budget
router.put("/:id", updateBudget);

// DELETE a budget
router.delete("/:id", deleteBudget);

module.exports = router;
