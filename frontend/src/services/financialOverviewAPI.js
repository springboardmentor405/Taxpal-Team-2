/**
 * Financial Overview API Integration
 * Handles all API calls related to the FinancialOverviewChart component
 */

import axios from "axios";

// API Base URL - adjust based on your backend configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Fetch financial overview data for specified time range
 * @param {string} timeRange - "month", "quarter", or "year"
 * @param {object} options - Additional options (filters, date range, etc.)
 * @returns {Promise<Array>} Array of financial data objects
 * @throws {Error} If API call fails
 */
export const fetchFinancialOverview = async (timeRange = "month", options = {}) => {
  try {
    const params = new URLSearchParams({
      range: timeRange,
      ...options,
    });

    const response = await axios.get(
      `${API_BASE_URL}/financial-overview?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if needed
          // "Authorization": `Bearer ${getAuthToken()}`,
        },
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching financial overview:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch financial data"
    );
  }
};

/**
 * Fetch financial data with date range filter
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of financial data objects
 */
export const fetchFinancialByDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/financial-overview/range`, {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching financial data by date range:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch financial data"
    );
  }
};

/**
 * Fetch specific time range data
 * @param {string} timeRange - "month", "quarter", or "year"
 * @returns {Promise<Array>} Array of financial data for the specific range
 */
export const getTimeRangeData = async (timeRange) => {
  const timeRangeMap = {
    month: "monthly",
    quarter: "quarterly",
    year: "yearly",
  };

  try {
    const response = await axios.get(
      `${API_BASE_URL}/financial-overview/${timeRangeMap[timeRange] || "monthly"}`
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching ${timeRange} data:`, error);
    throw error;
  }
};

/**
 * Fetch summary statistics for financial overview
 * @returns {Promise<object>} Object containing total income, expenses, and profit
 */
export const fetchFinancialSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/financial-overview/summary`);

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch financial summary"
    );
  }
};

/**
 * Export financial data to CSV
 * @param {string} timeRange - Data range to export
 * @returns {Promise<Blob>} CSV file blob
 */
export const exportFinancialData = async (timeRange = "month") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/financial-overview/export/csv`,
      {
        params: { range: timeRange },
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error exporting financial data:", error);
    throw new Error("Failed to export financial data");
  }
};

/**
 * Fetch comparison data between two periods
 * @param {string} period1 - First period (e.g., "current-month")
 * @param {string} period2 - Second period (e.g., "previous-month")
 * @returns {Promise<object>} Comparison data with growth metrics
 */
export const fetchPeriodComparison = async (period1, period2) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/financial-overview/compare`, {
      params: {
        period1,
        period2,
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching period comparison:", error);
    throw new Error("Failed to fetch comparison data");
  }
};

/**
 * Batch fetch multiple time ranges at once
 * @param {Array<string>} timeRanges - Array of time ranges to fetch
 * @returns {Promise<object>} Object with keys for each time range containing data
 */
export const fetchMultipleTimeRanges = async (
  timeRanges = ["month", "quarter", "year"]
) => {
  try {
    const requests = timeRanges.map((range) =>
      fetchFinancialOverview(range)
    );

    const results = await Promise.all(requests);

    return timeRanges.reduce((acc, range, index) => {
      acc[range] = results[index];
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching multiple time ranges:", error);
    throw error;
  }
};

/**
 * Cache for financial data (implements basic memoization)
 */
class FinancialDataCache {
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

export const financialDataCache = new FinancialDataCache();

/**
 * Fetch financial data with caching
 * @param {string} timeRange - Time range to fetch
 * @param {boolean} forceRefresh - Skip cache and force fresh fetch
 * @returns {Promise<Array>} Financial data
 */
export const fetchFinancialOverviewCached = async (
  timeRange = "month",
  forceRefresh = false
) => {
  const cacheKey = `financial_${timeRange}`;

  if (!forceRefresh) {
    const cached = financialDataCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached data for ${timeRange}`);
      return cached;
    }
  }

  const data = await fetchFinancialOverview(timeRange);
  financialDataCache.set(cacheKey, data);

  return data;
};

export default {
  fetchFinancialOverview,
  fetchFinancialByDateRange,
  getTimeRangeData,
  fetchFinancialSummary,
  exportFinancialData,
  fetchPeriodComparison,
  fetchMultipleTimeRanges,
  fetchFinancialOverviewCached,
  financialDataCache,
};
