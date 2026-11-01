
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  ArrowLeft,
  RotateCcw,
  Pencil,
  Trash2,
  Download,
  SlidersHorizontal,
  ReceiptText,
} from "lucide-react";
import API from "../api";

function Search() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await API.get("/transactions");
        setTransactions(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load transactions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const categories = [
    ...new Set(
      transactions.map((item) => item.category).filter(Boolean)
    ),
  ];

  const filteredTransactions = transactions.filter((item) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      item.title?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText) ||
      item.description?.toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "all" || item.type === typeFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      item.category === categoryFilter;

    // Compare date-only values to avoid timezone shifts.
    const transactionDate = item.date
      ? new Date(item.date).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        })
      : "";

    const matchesStartDate =
      !startDate || transactionDate >= startDate;

    const matchesEndDate =
      !endDate || transactionDate <= endDate;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    startDate !== "" ||
    endDate !== "";

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const deleteTransaction = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/transactions/${id}`);

      setTransactions((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to delete transaction."
      );
    }
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions available to export!");
      return;
    }

    const headers = [
      "Title",
      "Amount",
      "Type",
      "Category",
      "Date",
      "Description",
    ];

    const rows = filteredTransactions.map((item) => [
      item.title,
      item.amount,
      item.type,
      item.category,
      item.date
        ? new Date(item.date).toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          })
        : "",
      item.description || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "FinTrack_Transactions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="search-page">
      <header className="ft-page-header">
        <div className="ft-page-heading">
          <span className="ft-eyebrow">FIND WHAT YOU NEED</span>
          <h1>Transaction <span>Search</span></h1>
          <p>Find, filter and manage all your transactions easily.</p>
        </div>

        <button
          className="ft-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      <section className="search-panel">
        <div className="search-panel-heading">
          <div>
            <span className="ft-eyebrow">SMART SEARCH</span>
            <h2>Find a transaction</h2>
            <p>Search using a title, category or description.</p>
          </div>
          <SlidersHorizontal size={23} />
        </div>

        <div className="search-input-wrapper">
          <SearchIcon size={21} />

          <input
            type="text"
            className="search-input"
            placeholder="Try searching for food, salary, shopping..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="search-clear-button"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="search-filter-heading">
          <SlidersHorizontal size={17} />
          <span>Refine your results</span>
        </div>

        <div className="filter-container">
          <div className="filter-group">
            <label>Transaction Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
          </div>
        </div>

        <div className="search-panel-footer">
          <span>
            {loading
              ? "Loading transactions..."
              : error
                ? "Unable to count transactions"
                : hasActiveFilters
                  ? `${filteredTransactions.length} matching transaction(s)`
                  : `${filteredTransactions.length} transaction(s) available`}
          </span>

          <button
            className="reset-button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>
      </section>

      <section className="search-results">
        <div className="search-results-heading">
          <div>
            <span className="ft-eyebrow">YOUR RECORDS</span>
            <h2>Transaction Results</h2>
            <p className="results-count">
              {loading
                ? "Fetching your records..."
                : error
                  ? "Records unavailable"
                  : hasActiveFilters
                    ? `${filteredTransactions.length} matching result(s)`
                    : `${filteredTransactions.length} total transaction(s)`}
            </p>
          </div>

          <button
            className="export-button"
            onClick={exportToCSV}
            disabled={loading || filteredTransactions.length === 0}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>

        {error ? (
          <div className="search-empty-state">
            <ReceiptText size={32} />
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="search-empty-state">
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="search-empty-state">
            <SearchIcon size={34} />
            <h3>
              {hasActiveFilters
                ? "No matching transactions"
                : "No transactions yet"}
            </h3>
            <p>
              {hasActiveFilters
                ? "Try a different search term or adjust your filters."
                : "Your transactions will appear here once you add them."}
            </p>

            {hasActiveFilters && (
              <button className="reset-button" onClick={resetFilters}>
                <RotateCcw size={16} />
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="search-transaction-list">
            {filteredTransactions.map((item) => (
              <article className="search-transaction-item" key={item._id}>
                <div className="search-transaction-main">
                  <div
                    className={`search-transaction-icon ${
                      item.type === "income" ? "income" : "expense"
                    }`}
                  >
                    <span className="search-arrow-symbol">
                      {item.type === "income" ? "↗" : "↘"}
                    </span>
                  </div>

                  <div className="search-transaction-info">
                    <h3>{item.title}</h3>

                    <div className="search-transaction-meta">
                      {item.category && <span>{item.category}</span>}
                      <span>{formatDate(item.date)}</span>
                      <span className={`transaction-type-label ${item.type}`}>
                        {item.type}
                      </span>
                    </div>

                    {item.description && (
                      <p>{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="search-transaction-right">
                  <strong
                    className={
                      item.type === "income"
                        ? "search-income-amount"
                        : "search-expense-amount"
                    }
                  >
                    {item.type === "income" ? "+" : "-"}₹
                    {Number(item.amount).toLocaleString("en-IN")}
                  </strong>

                  <div className="search-transaction-actions">
                    <button
                      onClick={() =>
                        navigate(`/edit-transaction/${item._id}`)
                      }
                      title="Edit transaction"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => deleteTransaction(item._id)}
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Search;
