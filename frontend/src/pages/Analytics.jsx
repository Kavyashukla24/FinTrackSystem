
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from "lucide-react";
import API from "../api";

const COLORS = [
  "#a78bfa",
  "#c5f76a",
  "#38bdf8",
  "#fb923c",
  "#f472b6",
  "#2dd4bf",
  "#facc15",
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const tooltipStyle = {
  backgroundColor: "#1b1b2b",
  border: "1px solid #35354a",
  borderRadius: "12px",
  color: "#ffffff",
};

function Analytics() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await API.get("/transactions");
        setTransactions(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));

    const year = date.getFullYear();
    const month = date.getMonth();

    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    const monthTransactions = transactions.filter((item) => {
      const itemDate = new Date(item.date);

      return (
        itemDate.getFullYear() === year &&
        itemDate.getMonth() === month
      );
    });

    const income = monthTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = monthTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      key,
      month: date.toLocaleString("en-IN", { month: "short" }),
      income,
      expense,
      savings: income - expense,
    };
  });

  const currentMonth = monthlyData[monthlyData.length - 1];

  const categoryTotals = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      categoryTotals[item.category || "Other"] =
        (categoryTotals[item.category || "Other"] || 0) +
        Number(item.amount);
    });

  const categoryData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const totalTransactions = transactions.length;

  if (loading) {
    return (
      <div className="ft-page">
        <div className="ft-status-card">Loading your financial analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ft-page">
        <div className="ft-page-header">
          <div className="ft-page-heading">
            <span className="ft-eyebrow">YOUR MONEY, DECODED</span>
            <h1>Financial Analytics</h1>
            <p>Understand your income and spending patterns.</p>
          </div>

          <button
            className="ft-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} /> Dashboard
          </button>
        </div>

        <div className="ft-status-card ft-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="ft-page">
      {/* Page heading */}
      <header className="ft-page-header">
        <div className="ft-page-heading">
          <span className="ft-eyebrow">YOUR MONEY, DECODED</span>
          <h1>Financial <span>Analytics</span></h1>
          <p>Understand your income, expenses and savings patterns.</p>
        </div>

        <button
          className="ft-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      {/* Summary cards */}
      <section className="analytics-summary-grid">
        <div className="analytics-stat-card income-stat">
          <div className="analytics-stat-top">
            <span>Monthly Income</span>
            <div className="analytics-stat-icon">
              <TrendingUp size={21} />
            </div>
          </div>
          <h2>{formatCurrency(currentMonth.income)}</h2>
          <p>Income received this month</p>
        </div>

        <div className="analytics-stat-card expense-stat">
          <div className="analytics-stat-top">
            <span>Monthly Expenses</span>
            <div className="analytics-stat-icon">
              <TrendingDown size={21} />
            </div>
          </div>
          <h2>{formatCurrency(currentMonth.expense)}</h2>
          <p>Total spending this month</p>
        </div>

        <div className="analytics-stat-card savings-stat">
          <div className="analytics-stat-top">
            <span>Monthly Savings</span>
            <div className="analytics-stat-icon">
              <PiggyBank size={21} />
            </div>
          </div>
          <h2>{formatCurrency(currentMonth.savings)}</h2>
          <p>Income minus expenses</p>
        </div>

        <div className="analytics-stat-card transactions-stat">
          <div className="analytics-stat-top">
            <span>Total Transactions</span>
            <div className="analytics-stat-icon">
              <Wallet size={21} />
            </div>
          </div>
          <h2>{totalTransactions}</h2>
          <p>All recorded transactions</p>
        </div>
      </section>

      {/* Charts */}
      <section className="analytics-chart-grid">
        <div className="analytics-card analytics-card-wide">
          <div className="analytics-card-heading">
            <div>
              <span className="ft-eyebrow">LAST SIX MONTHS</span>
              <h2>Income vs Expenses</h2>
              <p>Compare your monthly money inflow and spending.</p>
            </div>
          </div>

          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 15, right: 10, left: 5, bottom: 5 }}
                barGap={8}
              >
                <CartesianGrid
                  stroke="#303044"
                  strokeDasharray="4 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#a1a1b5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fill: "#a1a1b5", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={65}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(value)}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Legend wrapperStyle={{ color: "#c4c4d4", fontSize: 12 }} />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#c5f76a"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={34}
                />
                <Bar
                  dataKey="expense"
                  name="Expenses"
                  fill="#a78bfa"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <span className="ft-eyebrow">SPENDING BREAKDOWN</span>
              <h2>Expenses by Category</h2>
              <p>Where your money goes.</p>
            </div>
          </div>

          {categoryData.length === 0 ? (
            <div className="analytics-empty">
              No expense data available yet.
            </div>
          ) : (
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="48%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ color: "#c4c4d4", fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="analytics-card analytics-card-wide">
          <div className="analytics-card-heading">
            <div>
              <span className="ft-eyebrow">SAVINGS PERFORMANCE</span>
              <h2>Monthly Savings Trend</h2>
              <p>See how your savings change over time.</p>
            </div>
          </div>

          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  stroke="#303044"
                  strokeDasharray="4 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#a1a1b5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fill: "#a1a1b5", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={65}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(value)}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#c5f76a"
                  strokeWidth={3}
                  dot={{ fill: "#c5f76a", stroke: "#171725", strokeWidth: 3, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Monthly table */}
      <section className="analytics-card analytics-table-card">
        <div className="analytics-card-heading">
          <div>
            <span className="ft-eyebrow">MONTH-BY-MONTH</span>
            <h2>Monthly Financial Summary</h2>
            <p>A quick overview of your financial activity.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Savings</th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item) => (
                <tr key={item.key}>
                  <td>{item.month} {item.key.slice(0, 4)}</td>
                  <td className="table-income">{formatCurrency(item.income)}</td>
                  <td className="table-expense">{formatCurrency(item.expense)}</td>
                  <td className={item.savings < 0 ? "table-expense" : "table-savings"}>
                    {formatCurrency(item.savings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
