
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CalendarDays,
} from "lucide-react";
import API from "../api";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function Reports() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reportType, setReportType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

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

  const getDateKey = (date) => String(date).slice(0, 10);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = getDateKey(transaction.date);

    if (reportType === "monthly") {
      return transactionDate.startsWith(selectedMonth);
    }

    return transactionDate.startsWith(String(selectedYear));
  });

  const income = filteredTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const expense = filteredTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const savings = income - expense;

  const categoryTotals = {};

  filteredTransactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      const category = item.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) + Number(item.amount);
    });

  const categories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const totalCategoryExpense = categories.reduce(
    (total, [, amount]) => total + amount,
    0
  );

  if (loading) {
    return (
      <div className="ft-page">
        <div className="ft-status-card">Preparing your financial report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ft-page">
        <header className="ft-page-header">
          <div className="ft-page-heading">
            <span className="ft-eyebrow">YOUR FINANCIAL OVERVIEW</span>
            <h1>Financial <span>Reports</span></h1>
            <p>Review your income, expenses and savings.</p>
          </div>

          <button
            className="ft-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} /> Dashboard
          </button>
        </header>

        <div className="ft-status-card ft-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Consistent page header */}
      <header className="ft-page-header">
        <div className="ft-page-heading">
          <span className="ft-eyebrow">YOUR FINANCIAL OVERVIEW</span>
          <h1>Financial <span>Reports</span></h1>
          <p>Review your income, expenses and savings in one place.</p>
        </div>

        <button
          className="ft-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      {/* Report filters */}
      <section className="report-filters">
        <div className="report-filter-heading">
          <div className="report-filter-icon">
            <CalendarDays size={21} />
          </div>
          <div>
            <h2>Choose Report Period</h2>
            <p>Select a month or year to view your financial activity.</p>
          </div>
        </div>

        <div className="report-filter-controls">
          <label>
            <span>Report Type</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
          </label>

          {reportType === "monthly" ? (
            <label>
              <span>Select Month</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </label>
          ) : (
            <label>
              <span>Select Year</span>
              <input
                type="number"
                min="2000"
                max="2100"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </label>
          )}
        </div>
      </section>

      {/* Financial summary */}
      <section className="report-summary">
        <div className="report-card report-income">
          <div className="report-card-top">
            <span>Total Income</span>
            <div><TrendingUp size={21} /></div>
          </div>
          <h2>{formatCurrency(income)}</h2>
          <p>Money received during this period</p>
        </div>

        <div className="report-card report-expense">
          <div className="report-card-top">
            <span>Total Expenses</span>
            <div><TrendingDown size={21} /></div>
          </div>
          <h2>{formatCurrency(expense)}</h2>
          <p>Money spent during this period</p>
        </div>

        <div className="report-card report-savings">
          <div className="report-card-top">
            <span>Net Savings</span>
            <div><PiggyBank size={21} /></div>
          </div>
          <h2 className={savings < 0 ? "report-negative" : ""}>
            {formatCurrency(savings)}
          </h2>
          <p>Income minus expenses</p>
        </div>
      </section>

      {/* Category report */}
      <section className="category-report">
        <div className="report-section-heading">
          <div>
            <span className="ft-eyebrow">SPENDING BREAKDOWN</span>
            <h2>Category-wise Expenses</h2>
            <p>See which categories account for your spending.</p>
          </div>
          <FileText size={23} />
        </div>

        {categories.length === 0 ? (
          <div className="report-empty">
            <FileText size={30} />
            <h3>No expenses found</h3>
            <p>There are no expense transactions for this period.</p>
          </div>
        ) : (
          <div className="report-category-list">
            {categories.map(([category, amount], index) => {
              const percentage =
                totalCategoryExpense > 0
                  ? (amount / totalCategoryExpense) * 100
                  : 0;

              return (
                <div className="category-row" key={category}>
                  <div className="category-row-info">
                    <div className="category-row-name">
                      <span className="category-rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong>{category}</strong>
                    </div>

                    <strong>{formatCurrency(amount)}</strong>
                  </div>

                  <div className="category-progress">
                    <div
                      className="category-progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="category-percentage">
                    {percentage.toFixed(1)}% of total expenses
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Transaction count */}
      <div className="report-count">
        <FileText size={18} />
        <span>
          <strong>{filteredTransactions.length}</strong> transactions included in this report
        </span>
      </div>
    </div>
  );
}

export default Reports;
