
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

// Get today's date in local YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function TransactionForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);
  const today = getTodayDate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: today,
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditing);

  // Fetch existing transaction when editing
  useEffect(() => {
    if (!id) return;

    const fetchTransaction = async () => {
      try {
        const response = await API.get("/transactions");

        const transaction = response.data.find(
          (item) => item._id === id
        );

        if (!transaction) {
          setError("Transaction not found");
          return;
        }

        setFormData({
          title: transaction.title,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category || "",
          date: new Date(transaction.date)
            .toISOString()
            .split("T")[0],
          description: transaction.description || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load transaction"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // If user selects Income, remove the category
      if (name === "type") {
        return {
          ...prev,
          type: value,
          category:
            value === "income"
              ? ""
              : prev.category || "Food",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Submit transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Prevent future dates
    if (formData.date > today) {
      setError("Transaction date cannot be in the future.");
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: Number(formData.amount),
        category:
          formData.type === "expense"
            ? formData.category
            : "",
      };

      if (isEditing) {
        await API.put(`/transactions/${id}`, transactionData);
      } else {
        await API.post("/transactions", transactionData);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save transaction"
      );
    }
  };

  if (loading) {
    return <p>Loading transaction...</p>;
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>
          {isEditing ? "Edit Transaction" : "Add Transaction"}
        </h1>

        {error && <p className="error">{error}</p>}

        {/* Transaction Title */}
        <input
          name="title"
          placeholder="Transaction title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Amount */}
        <input
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        {/* Transaction Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        {/* Show Category only for Expense */}
        {formData.type === "expense" && (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        )}

        {/* Transaction Date */}
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          max={today}
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit">
          {isEditing ? "Update Transaction" : "Save Transaction"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
