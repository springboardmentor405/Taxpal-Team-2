import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./FinancialOverviewChart.css";

// Mock data for different time ranges
const DATA_BY_RANGE = {
  month: [
    { label: "Jan", income: 8200, expenses: 3500 },
    { label: "Feb", income: 6700, expenses: 3000 },
    { label: "Mar", income: 8800, expenses: 3600 },
    { label: "Apr", income: 7900, expenses: 3300 },
    { label: "May", income: 9100, expenses: 3400 },
    { label: "Jun", income: 8500, expenses: 3200 },
  ],
  quarter: [
    { label: "Q1", income: 23700, expenses: 10100 },
    { label: "Q2", income: 25500, expenses: 9900 },
    { label: "Q3", income: 24800, expenses: 10300 },
    { label: "Q4", income: 22300, expenses: 9500 },
  ],
  year: [
    { label: "2022", income: 85000, expenses: 35000 },
    { label: "2023", income: 96200, expenses: 38500 },
    { label: "2024", income: 108500, expenses: 42300 },
    { label: "2025", income: 115700, expenses: 45200 },
  ],
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" role="tooltip">
        <p className="tooltip-label">{payload[0].payload.label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Skeleton Loader Component
const ChartSkeleton = () => (
  <div className="chart-skeleton" aria-busy="true">
    <div className="skeleton-line skeleton-header"></div>
    <div className="skeleton-line skeleton-bar"></div>
    <div className="skeleton-line skeleton-bar"></div>
    <div className="skeleton-line skeleton-bar"></div>
    <div className="skeleton-line skeleton-footer"></div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="empty-state" role="status" aria-label="No transactions available">
    <svg
      className="empty-state-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <p className="empty-state-text">No transactions yet</p>
    <p className="empty-state-subtext">Start adding transactions to see your financial overview</p>
  </div>
);

// Format Y-axis values
const formatYAxis = (value) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
};

function FinancialOverviewChart({ isDarkMode = false, data = null, isLoading = false }) {
  const [timeRange, setTimeRange] = useState("month");

  // Use provided data or mock data
  const chartData = useMemo(() => {
    return data || DATA_BY_RANGE[timeRange];
  }, [timeRange, data]);

  const hasData = chartData && chartData.length > 0;

  const toggleButtons = [
    { id: "month", label: "Month" },
    { id: "quarter", label: "Quarter" },
    { id: "year", label: "Year" },
  ];

  // Calculate max value for Y-axis
  const maxValue = useMemo(() => {
    if (!hasData) return 10000;
    const maxIncome = Math.max(...chartData.map((d) => d.income || 0));
    const maxExpenses = Math.max(...chartData.map((d) => d.expenses || 0));
    const max = Math.max(maxIncome, maxExpenses);
    return Math.ceil(max / 1000) * 1000;
  }, [chartData, hasData]);

  return (
    <div className={`financial-overview-card ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Header Section */}
      <div className="chart-header">
        <h2 className="chart-title">Income vs Expenses</h2>

        {/* Toggle Buttons */}
        <div className="toggle-group" role="group" aria-label="Time range selection">
          {toggleButtons.map((btn) => (
            <button
              key={btn.id}
              className={`toggle-btn ${timeRange === btn.id ? "active" : "inactive"}`}
              onClick={() => setTimeRange(btn.id)}
              aria-pressed={timeRange === btn.id}
              aria-label={`View by ${btn.label}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-content">
        {isLoading ? (
          <ChartSkeleton />
        ) : !hasData ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              aria-label="Income and Expenses grouped bar chart"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(167, 139, 250, 0.35)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: isDarkMode ? "#D1D5DB" : "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: isDarkMode ? "#4B5563" : "rgba(167, 139, 250, 0.35)" }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                domain={[0, maxValue]}
                tick={{ fill: isDarkMode ? "#D1D5DB" : "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: isDarkMode ? "#4B5563" : "rgba(167, 139, 250, 0.35)" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(167, 139, 250, 0.08)" }} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                }}
                iconType="square"
              />
              <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Stats */}
      {!isLoading && hasData && (
        <div className="chart-footer">
          <div className="stat-item">
            <span className="stat-label">Total Income:</span>
            <span className="stat-value income">
              ${chartData.reduce((sum, item) => sum + item.income, 0).toLocaleString()}
            </span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Total Expenses:</span>
            <span className="stat-value expense">
              ${chartData.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()}
            </span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Net Profit:</span>
            <span className="stat-value profit">
              ${(
                chartData.reduce((sum, item) => sum + item.income, 0) -
                chartData.reduce((sum, item) => sum + item.expenses, 0)
              ).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialOverviewChart;
