
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import API from "../api";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Bills",
  "Other",
];

function Budgets() {
  const navigate = useNavigate();
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [budgetResponse, transactionResponse] = await Promise.all([
        API.get(`/budgets?month=${month}&year=${year}`),
        API.get("/transactions"),
      ]);

      setBudgets(budgetResponse.data);
      setTransactions(transactionResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load budget information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const getCategorySpending = (selectedCategory) => {
    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);

        return (
          transaction.type === "expense" &&
          transaction.category === selectedCategory &&
          transactionDate.getMonth() + 1 === month &&
          transactionDate.getFullYear() === year
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    try {
      await API.post("/budgets", {
        category,
        amount: Number(amount),
        month,
        year,
      });

      setAmount("");
      setMessage("Budget added successfully!");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to add budget."
      );
    }
  };

  const handleUpdateBudget = async (id) => {
    setError("");
    setMessage("");

    if (!editAmount || Number(editAmount) <= 0) {
      setError("Enter a valid budget amount.");
      return;
    }

    try {
      await API.put(`/budgets/${id}`, {
        amount: Number(editAmount),
      });

      setEditingId(null);
      setEditAmount("");
      setMessage("Budget updated successfully!");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update budget."
      );
    }
  };

  const handleDeleteBudget = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/budgets/${id}`);
      setMessage("Budget deleted successfully!");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete budget."
      );
    }
  };

  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.amount),
    0
  );

  const totalSpent = budgets.reduce(
    (total, budget) =>
      total + getCategorySpending(budget.category),
    0
  );

  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="budget-page">
      {/* Consistent page heading */}
      <header className="ft-page-header">
        <div className="ft-page-heading">
          <span className="ft-eyebrow">TAKE CONTROL OF YOUR SPENDING</span>
          <h1>Budget <span>Management</span></h1>
          <p>Plan your spending, set limits and stay on track.</p>
        </div>

        <button
          className="ft-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      {/* Month and year selection */}
      <div className="budget-period">
        <label>
          <span>Month</span>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Year</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {Array.from(
              { length: 6 },
              (_, index) => today.getFullYear() - 2 + index
            ).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="budget-error">{error}</p>}
      {message && <p className="budget-success">{message}</p>}

      {/* Budget summary */}
      <section className="budget-summary">
        <div className="budget-summary-card">
          <div className="budget-summary-icon">
            <Wallet size={22} />
          </div>
          <p>Total Budget</p>
          <h2>₹{totalBudget.toLocaleString("en-IN")}</h2>
        </div>

        <div className="budget-summary-card">
          <div className="budget-summary-icon">
            <Wallet size={22} />
          </div>
          <p>Total Spent</p>
          <h2>₹{totalSpent.toLocaleString("en-IN")}</h2>
        </div>

        <div className="budget-summary-card">
          <div className="budget-summary-icon">
            <Wallet size={22} />
          </div>
          <p>Remaining Budget</p>
          <h2 className={remainingBudget < 0 ? "over-budget" : ""}>
            ₹{remainingBudget.toLocaleString("en-IN")}
          </h2>
        </div>
      </section>

      {/* Add budget */}
      <section className="budget-form-card">
        <div className="budget-section-heading">
          <div>
            <span className="ft-eyebrow">SET YOUR LIMITS</span>
            <h2><Plus size={20} /> Add Category Budget</h2>
          </div>
        </div>

        <form onSubmit={handleAddBudget}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter budget amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            <Plus size={18} /> Add Budget
          </button>
        </form>
      </section>

      {/* Category budgets */}
      <section className="budget-list">
        <div className="budget-section-heading">
          <div>
            <span className="ft-eyebrow">YOUR SPENDING LIMITS</span>
            <h2>Category Budgets</h2>
            <p>{monthNames[month - 1]} {year}</p>
          </div>
          <span className="budget-count">{budgets.length} budgets</span>
        </div>

        {loading ? (
          <div className="ft-status-card">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <div className="empty-budget">
            <Wallet size={32} />
            <h3>No budgets yet</h3>
            <p>
              No budgets found for {monthNames[month - 1]} {year}.
              Add your first category budget above.
            </p>
          </div>
        ) : (
          <div className="budget-items-grid">
            {budgets.map((budget) => {
              const spent = getCategorySpending(budget.category);
              const remaining = Number(budget.amount) - spent;
              const percentage = (spent / Number(budget.amount)) * 100;
              const progress = Math.min(percentage, 100);

              return (
                <div className="budget-item" key={budget._id}>
                  <div className="budget-item-header">
                    <div>
                      <h3>{budget.category}</h3>
                      <p>
                        Spent: ₹{spent.toLocaleString("en-IN")}
                        {" / "}
                        ₹{Number(budget.amount).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="budget-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(budget._id);
                          setEditAmount(String(budget.amount));
                        }}
                        title="Edit budget"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBudget(budget._id)}
                        title="Delete budget"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="budget-progress">
                    <div
                      className={`budget-progress-fill ${
                        percentage >= 100
                          ? "danger"
                          : percentage >= 80
                          ? "warning"
                          : ""
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="budget-item-footer">
                    <span>{percentage.toFixed(1)}% used</span>

                    <span className={remaining < 0 ? "over-budget" : ""}>
                      {remaining < 0
                        ? `Overspent by ₹${Math.abs(remaining).toLocaleString("en-IN")}`
                        : `Remaining: ₹${remaining.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  {editingId === budget._id && (
                    <div className="budget-edit-form">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />

                      <button
                        type="button"
                        onClick={() => handleUpdateBudget(budget._id)}
                      >
                        <Save size={16} /> Save
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditAmount("");
                        }}
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  )}

                  {percentage >= 100 && (
                    <p className="budget-warning">
                      You have exceeded this category budget!
                    </p>
                  )}

                  {percentage >= 80 && percentage < 100 && (
                    <p className="budget-warning">
                      Warning: You have used more than 80% of your budget.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Budgets;
