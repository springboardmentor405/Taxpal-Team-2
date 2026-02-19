/**
 * Expense Breakdown API Integration
 * Handles all API calls related to the ExpenseBreakdownCard component
 */

import axios from "axios";

// API Base URL - adjust based on your backend configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Fetch expense breakdown data by category
 * @param {string} period - "week", "month", or "year"
 * @param {object} options - Additional options (filters, date range, etc.)
 * @returns {Promise<Array>} Array of expense data objects
 * @throws {Error} If API call fails
 */
export const fetchExpenseBreakdown = async (period = "month", options = {}) => {
  try {
    const params = new URLSearchParams({
      period,
      ...options,
    });

    const response = await axios.get(
      `${API_BASE_URL}/expenses/breakdown?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching expense breakdown:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch expense breakdown"
    );
  }
};

/**
 * Fetch expense breakdown with date range filter
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of expense data objects
 */
export const fetchExpenseBreakdownByDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses/breakdown/range`, {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching expense breakdown by date range:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch expense breakdown"
    );
  }
};

/**
 * Fetch expense data by specific category
 * @param {string} category - Category name
 * @param {string} period - "week", "month", or "year"
 * @returns {Promise<object>} Expense data for the category
 */
export const fetchExpenseByCategory = async (category, period = "month") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expenses/category/${encodeURIComponent(category)}`,
      {
        params: { period },
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching expenses for ${category}:`, error);
    throw error;
  }
};

/**
 * Fetch total expense amount for period
 * @param {string} period - "week", "month", or "year"
 * @returns {Promise<object>} Total amount and breakdown
 */
export const fetchTotalExpenses = async (period = "month") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses/total`, {
      params: { period },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch total expenses"
    );
  }
};

/**
 * Fetch expense comparison between two periods
 * @param {string} period1 - First period
 * @param {string} period2 - Second period
 * @returns {Promise<object>} Comparison data with growth metrics
 */
export const fetchExpenseComparison = async (period1, period2) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses/compare`, {
      params: {
        period1,
        period2,
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching expense comparison:", error);
    throw new Error("Failed to fetch comparison data");
  }
};

/**
 * Export expense data to CSV
 * @param {string} period - Data period to export
 * @returns {Promise<Blob>} CSV file blob
 */
export const exportExpenseData = async (period = "month") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expenses/export/csv`,
      {
        params: { period },
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error exporting expense data:", error);
    throw new Error("Failed to export expense data");
  }
};

/**
 * Fetch expense summary statistics
 * @param {string} period - "week", "month", or "year"
 * @returns {Promise<object>} Summary statistics (average, median, etc.)
 */
export const fetchExpenseSummary = async (period = "month") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses/summary`, {
      params: { period },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    throw new Error("Failed to fetch expense summary");
  }
};

/**
 * Cache for expense breakdown data
 */
class ExpenseCache {
  constructor(ttl = 5 * 60 * 1000) {
    // 5 minutes default TTL
    this.cache = {};
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache[key] = {
      data: value,
      timestamp: Date.now(),
    };
  }

  get(key) {
    const entry = this.cache[key];
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      delete this.cache[key];
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache = {};
  }
}

export const expenseCache = new ExpenseCache();

/**
 * Fetch expense breakdown with caching
 * @param {string} period - Time period to fetch
 * @param {boolean} forceRefresh - Skip cache and force fresh fetch
 * @returns {Promise<Array>} Expense breakdown data
 */
export const fetchExpenseBreakdownCached = async (
  period = "month",
  forceRefresh = false
) => {
  const cacheKey = `expense_breakdown_${period}`;

  if (!forceRefresh) {
    const cached = expenseCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached expense data for ${period}`);
      return cached;
    }
  }

  const data = await fetchExpenseBreakdown(period);
  expenseCache.set(cacheKey, data);

  return data;
};

export default {
  fetchExpenseBreakdown,
  fetchExpenseBreakdownByDateRange,
  fetchExpenseByCategory,
  fetchTotalExpenses,
  fetchExpenseComparison,
  exportExpenseData,
  fetchExpenseSummary,
  fetchExpenseBreakdownCached,
  expenseCache,
};
