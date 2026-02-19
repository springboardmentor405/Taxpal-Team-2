import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./ExpenseBreakdownCard.css";

// Category colors - strictly defined
const CATEGORY_COLORS = {
  "Rent/Mortgage": "#1D4ED8",
  "Business Expenses": "#10B981",
  Utilities: "#F59E0B",
  Food: "#EF4444",
  Other: "#8B5CF6",
};

// Mock data
const MOCK_DATA = [
  { name: "Rent/Mortgage", value: 32 },
  { name: "Business Expenses", value: 28 },
  { name: "Utilities", value: 15 },
  { name: "Food", value: 12 },
  { name: "Other", value: 13 },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, isDarkMode }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    // Calculate total amount (assuming based on a monthly budget)
    const totalAmount = 6000; // This would come from props
    const amount = Math.round((value / 100) * totalAmount);

    return (
      <div className={`expense-tooltip ${isDarkMode ? "dark" : ""}`} role="tooltip">
        <p className="tooltip-category">{name}</p>
        <p className="tooltip-percentage">{value}%</p>
        <p className="tooltip-amount">${amount.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// Skeleton Loader Component
const CardSkeleton = () => (
  <div className="card-skeleton">
    <div className="skeleton-header"></div>
    <div className="skeleton-chart"></div>
    <div className="skeleton-breakdown">
      <div className="skeleton-row"></div>
      <div className="skeleton-row"></div>
      <div className="skeleton-row"></div>
      <div className="skeleton-row"></div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="empty-state" role="status" aria-label="No expense data available">
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
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="empty-state-text">No expenses recorded yet</p>
    <p className="empty-state-subtext">Add your first expense to see the breakdown</p>
  </div>
);

// Category Breakdown Section
const CategoryBreakdown = ({ data, isDarkMode }) => {
  return (
    <div className={`category-breakdown ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="breakdown-title">Breakdown by Category</div>
      <div className="breakdown-items">
        {data.map((item, index) => (
          <div key={index} className="breakdown-item">
            <div className="item-info">
              <div
                className="category-dot"
                style={{ backgroundColor: CATEGORY_COLORS[item.name] || "#9CA3AF" }}
                aria-label={`${item.name} category`}
              ></div>
              <span className="category-name">{item.name}</span>
            </div>
            <span className="category-percentage" aria-label={`${item.value} percent`}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function ExpenseBreakdownCard({
  isDarkMode = false,
  data = null,
  isLoading = false,
  totalAmount = 6000,
  subtitle = "Current Month",
}) {
  const chartData = useMemo(() => {
    return data || MOCK_DATA;
  }, [data]);

  const hasData = chartData && chartData.length > 0;

  // Get colors array in correct order
  const colors = chartData.map((item) => CATEGORY_COLORS[item.name] || "#9CA3AF");

  return (
    <div className={`expense-breakdown-card ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Header Section */}
      <div className="card-header">
        <div>
          <h2 className="card-title">Expense Breakdown</h2>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-wrapper">
        {isLoading ? (
          <CardSkeleton />
        ) : !hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* Pie Chart */}
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart aria-label="Expense distribution pie chart">
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={84}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={300}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index]}
                        className="pie-slice"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                    cursor={{ fill: "rgba(0,0,0,0.1)" }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="square"
                    wrapperStyle={{ paddingLeft: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <CategoryBreakdown data={chartData} isDarkMode={isDarkMode} />
          </>
        )}
      </div>
    </div>
  );
}

export default ExpenseBreakdownCard;
