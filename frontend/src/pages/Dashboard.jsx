
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Trash2,
    LogOut,
    Wallet,
    Pencil,
    Search,
    ChartNoAxesCombined,
    FileText,
    PiggyBank,
    RotateCcw,
    Filter,
} from "lucide-react";

import API from "../api";

function Dashboard() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter states
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Get logged-in user's information
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/transactions");
            setTransactions(response.data);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load transactions. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    // Calculate dashboard totals
    const income = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const expense = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const balance = income - expense;

    // Get available expense categories
    const categories = [
        ...new Set(
            transactions
                .filter((transaction) => transaction.type === "expense")
                .map((transaction) => transaction.category)
                .filter(Boolean)
        ),
    ];

    // Apply search and filters
    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                transaction.title?.toLowerCase().includes(searchText) ||
                transaction.category?.toLowerCase().includes(searchText) ||
                transaction.description?.toLowerCase().includes(searchText);

            const matchesType =
                typeFilter === "all" ||
                transaction.type === typeFilter;

            const matchesCategory =
                categoryFilter === "all" ||
                transaction.category === categoryFilter;

            const transactionDate = transaction.date
                ? new Date(transaction.date).toISOString().split("T")[0]
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
    }, [
        transactions,
        search,
        typeFilter,
        categoryFilter,
        startDate,
        endDate,
    ]);

    // Delete transaction
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/transactions/${id}`);

            setTransactions((previousTransactions) =>
                previousTransactions.filter(
                    (transaction) => transaction._id !== id
                )
            );

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to delete transaction."
            );
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearch("");
        setTypeFilter("all");
        setCategoryFilter("all");
        setStartDate("");
        setEndDate("");
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="dashboard-container">

            {/* HEADER */}
            <header className="dashboard-header">
                <div>
                    <h1>FinTrack</h1>
                    <p>Welcome back, {user.name || "User"}!</p>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            {/* NAVIGATION */}
            <nav className="dashboard-nav">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="active"
                >
                    <Wallet size={17} />
                    Dashboard
                </button>

                <button onClick={() => navigate("/analytics")}>
                    <ChartNoAxesCombined size={17} />
                    Analytics
                </button>

                <button onClick={() => navigate("/reports")}>
                    <FileText size={17} />
                    Reports
                </button>

                <button onClick={() => navigate("/search")}>
                    <Search size={17} />
                    Search
                </button>

                <button onClick={() => navigate("/budgets")}>
                    <PiggyBank size={17} />
                    Budgets
                </button>
            </nav>

            {/* SUMMARY CARDS */}
            <section className="summary-cards">

                <div className="summary-card">
                    <div className="summary-icon income">
                        <Wallet size={22} />
                    </div>

                    <p>Total Income</p>
                    <h2>{formatCurrency(income)}</h2>
                </div>

                <div className="summary-card">
                    <div className="summary-icon expense">
                        <Wallet size={22} />
                    </div>

                    <p>Total Expenses</p>
                    <h2>{formatCurrency(expense)}</h2>
                </div>

                <div className="summary-card">
                    <div className="summary-icon balance">
                        <PiggyBank size={22} />
                    </div>

                    <p>Available Balance</p>
                    <h2>{formatCurrency(balance)}</h2>
                </div>

            </section>

            {/* TRANSACTION SECTION */}
            <section className="dashboard-transactions">

                <div className="transactions-header">
                    <div>
                        <h2>Transactions</h2>
                        <p>Manage and track your money.</p>
                    </div>

                    <button
                        className="add-transaction-button"
                        onClick={() => navigate("/add-transaction")}
                    >
                        <Plus size={18} />
                        Add Transaction
                    </button>
                </div>

                {/* FILTERS */}
                <div className="dashboard-filters">

                    <div className="dashboard-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-row">

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>

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

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            aria-label="Start date"
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            aria-label="End date"
                        />

                        <button
                            className="reset-filter-button"
                            onClick={resetFilters}
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>

                    </div>
                </div>

                {/* TRANSACTION LIST */}
                {loading ? (
                    <p className="loading-message">
                        Loading transactions...
                    </p>
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={fetchTransactions}>
                            Try Again
                        </button>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="empty-transactions">
                        <Filter size={35} />

                        <h3>No transactions found</h3>

                        <p>
                            Try changing your filters or add a new transaction.
                        </p>

                        <button
                            onClick={() => navigate("/add-transaction")}
                        >
                            <Plus size={17} />
                            Add Transaction
                        </button>
                    </div>
                ) : (
                    <div className="transaction-list">

                        {filteredTransactions
                            .slice()
                            .sort(
                                (a, b) =>
                                    new Date(b.date) - new Date(a.date)
                            )
                            .map((transaction) => (
                                <div
                                    className="transaction-item"
                                    key={transaction._id}
                                >

                                    <div className="transaction-info">
                                        <div
                                            className={`transaction-type-icon ${
                                                transaction.type
                                            }`}
                                        >
                                            {transaction.type === "income" ? (
                                                <Plus size={19} />
                                            ) : (
                                                <Wallet size={19} />
                                            )}
                                        </div>

                                        <div>
                                            <h3>{transaction.title}</h3>

                                            <p>
                                                {transaction.type === "income"
                                                    ? "Income"
                                                    : transaction.category || "Expense"}
                                                {" • "}
                                                {formatDate(transaction.date)}
                                            </p>

                                            {transaction.description && (
                                                <small>
                                                    {transaction.description}
                                                </small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="transaction-right">

                                        <strong
                                            className={
                                                transaction.type === "income"
                                                    ? "income-amount"
                                                    : "expense-amount"
                                            }
                                        >
                                            {transaction.type === "income"
                                                ? "+"
                                                : "-"}
                                            {formatCurrency(
                                                Number(transaction.amount)
                                            )}
                                        </strong>

                                        <div className="transaction-actions">

                                            <button
                                                title="Edit transaction"
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-transaction/${transaction._id}`
                                                    )
                                                }
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                title="Delete transaction"
                                                onClick={() =>
                                                    handleDelete(transaction._id)
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>
                                    </div>

                                </div>
                            ))}

                    </div>
                )}

                {!loading && !error && filteredTransactions.length > 0 && (
                    <p className="transaction-count">
                        Showing {filteredTransactions.length} of{" "}
                        {transactions.length} transactions
                    </p>
                )}

            </section>

        </div>
    );
}

export default Dashboard;
