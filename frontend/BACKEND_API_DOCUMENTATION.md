# Backend API Documentation - FinancialOverviewChart

## Overview
This document outlines the required backend API endpoints for the FinancialOverviewChart component.

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Get Financial Overview by Time Range

**Endpoint:** `GET /api/financial-overview`

**Query Parameters:**
- `range` (required): `"month"` | `"quarter"` | `"year"`
- `userId` (optional): User ID for personalized data
- `fromDate` (optional): Start date (YYYY-MM-DD)
- `toDate` (optional): End date (YYYY-MM-DD)

**Example Request:**
```bash
GET /api/financial-overview?range=month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "label": "Jan",
      "income": 8200,
      "expenses": 3500
    },
    {
      "label": "Feb",
      "income": 6700,
      "expenses": 3000
    },
    {
      "label": "Mar",
      "income": 8800,
      "expenses": 3600
    },
    {
      "label": "Apr",
      "income": 7900,
      "expenses": 3300
    },
    {
      "label": "May",
      "income": 9100,
      "expenses": 3400
    },
    {
      "label": "Jun",
      "income": 8500,
      "expenses": 3200
    }
  ],
  "metadata": {
    "totalRecords": 6,
    "timeRange": "month",
    "generatedAt": "2025-02-19T10:30:00Z"
  }
}
```

---

### 2. Get Financial Data by Date Range

**Endpoint:** `GET /api/financial-overview/range`

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `groupBy` (optional): `"day"` | `"week"` | `"month"` (default: `"month"`)

**Example Request:**
```bash
GET /api/financial-overview/range?startDate=2025-01-01&endDate=2025-06-30&groupBy=month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "label": "2025-01-01 to 2025-01-31",
      "income": 8200,
      "expenses": 3500,
      "date": "2025-01",
      "count": 30
    }
  ]
}
```

---

### 3. Get Monthly Financial Data

**Endpoint:** `GET /api/financial-overview/monthly`

**Example Request:**
```bash
GET /api/financial-overview/monthly
```

**Expected Response (200 OK):**
Similar to time range endpoint, returns 12 months of data

---

### 4. Get Quarterly Financial Data

**Endpoint:** `GET /api/financial-overview/quarterly`

**Example Request:**
```bash
GET /api/financial-overview/quarterly
```

**Expected Response (200 OK):**
Returns Q1, Q2, Q3, Q4 data for current year

---

### 5. Get Yearly Financial Data

**Endpoint:** `GET /api/financial-overview/yearly`

**Example Request:**
```bash
GET /api/financial-overview/yearly
```

**Expected Response (200 OK):**
Returns data for last 4-5 years

---

### 6. Get Financial Summary

**Endpoint:** `GET /api/financial-overview/summary`

**Example Request:**
```bash
GET /api/financial-overview/summary
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalIncome": 51000,
    "totalExpenses": 20100,
    "netProfit": 30900,
    "incomeGrowth": 12.5,
    "expenseGrowth": -2.3,
    "profitMargin": 60.59,
    "averageIncome": 8500,
    "averageExpenses": 3350
  }
}
```

---

### 7. Compare Two Periods

**Endpoint:** `GET /api/financial-overview/compare`

**Query Parameters:**
- `period1` (required): e.g., `"current-month"`, `"2025-02"`, `"Q1-2025"`
- `period2` (required): e.g., `"previous-month"`, `"2025-01"`, `"Q1-2024"`

**Example Request:**
```bash
GET /api/financial-overview/compare?period1=current-month&period2=previous-month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period1": "February 2025",
    "period2": "January 2025",
    "income": {
      "current": 9100,
      "previous": 8200,
      "growth": 10.98,
      "changeAmount": 900
    },
    "expenses": {
      "current": 3400,
      "previous": 3500,
      "growth": -2.86,
      "changeAmount": -100
    },
    "profit": {
      "current": 5700,
      "previous": 4700,
      "growth": 21.28,
      "changeAmount": 1000
    }
  }
}
```

---

### 8. Export Financial Data

**Endpoint:** `GET /api/financial-overview/export/csv`

**Query Parameters:**
- `range` (required): `"month"` | `"quarter"` | `"year"`
- `format` (optional): `"csv"` | `"xlsx"` | `"json"` (default: `"csv"`)

**Example Request:**
```bash
GET /api/financial-overview/export/csv?range=month&format=csv
```

**Response:**
- Content-Type: `text/csv` or `application/vnd.ms-excel`
- File download

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid time range. Must be 'month', 'quarter', or 'year'",
  "code": "INVALID_RANGE"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "No data found for the specified period",
  "code": "NOT_FOUND"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

---

## Backend Implementation Example (Node.js/Express)

```javascript
// GET /api/financial-overview
app.get("/api/financial-overview", async (req, res) => {
  try {
    const { range = "month", userId, fromDate, toDate } = req.query;

    // Validate range parameter
    if (!["month", "quarter", "year"].includes(range)) {
      return res.status(400).json({
        success: false,
        error: "Invalid time range",
        code: "INVALID_RANGE",
      });
    }

    // Fetch data from database
    let query = {};
    if (userId) query.userId = userId;

    if (fromDate && toDate) {
      query.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Group data based on range
    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: getGroupId(range),
          income: { $sum: "$income" },
          expenses: { $sum: "$expenses" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const data = await Transaction.aggregate(pipeline);

    const formattedData = data.map((item) => ({
      label: formatLabel(item._id, range),
      income: item.income,
      expenses: item.expenses,
    }));

    res.json({
      success: true,
      data: formattedData,
      metadata: {
        totalRecords: formattedData.length,
        timeRange: range,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
});

// Helper function to get group ID based on range
function getGroupId(range) {
  switch (range) {
    case "month":
      return { $substr: ["$date", 0, 7] }; // YYYY-MM format
    case "quarter":
      return {
        $concat: [
          { $substr: ["$date", 0, 4] },
          "-Q",
          {
            $ceil: {
              $divide: [{ $month: "$date" }, 3],
            },
          },
        ],
      };
    case "year":
      return { $substr: ["$date", 0, 4] }; // YYYY format
    default:
      return { $substr: ["$date", 0, 7] };
  }
}
```

---

## Response Caching Strategy

For optimal performance, implement response caching:

```javascript
// Cache financial data for 5 minutes
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(range, userId) {
  return `financial_${range}_${userId || "public"}`;
}

function isCacheValid(cacheEntry) {
  return Date.now() - cacheEntry.timestamp < CACHE_TTL;
}

app.get("/api/financial-overview", (req, res) => {
  const cacheKey = getCacheKey(req.query.range, req.user?.id);
  const cached = cache.get(cacheKey);

  if (cached && isCacheValid(cached)) {
    return res.json(cached.data);
  }

  // Fetch from database and cache
  const data = fetchData(req.query);
  cache.set(cacheKey, { data, timestamp: Date.now() });

  res.json(data);
});
```

---

## Rate Limiting

Recommended rate limits for API endpoints:

- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute
- **Export endpoints**: 10 requests/minute

---

## Authentication

All endpoints should support:

- **JWT Bearer Token** in Authorization header
- **API Key** in x-api-key header (optional)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "x-api-key: YOUR_API_KEY" \
     http://localhost:5000/api/financial-overview?range=month
```

---

## Data Format Requirements

### Transaction Schema (Database)
```javascript
{
  _id: ObjectId,
  userId: String,
  type: "income" | "expense",
  amount: Number,
  category: String,
  description: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Aggregated Response Format
```javascript
{
  label: String,        // Display label (Jan, Q1, 2025)
  income: Number,       // Total income for period
  expenses: Number,     // Total expenses for period
  date?: String,        // Period identifier (YYYY-MM, YYYY-Qx, YYYY)
  count?: Number        // Number of transactions
}
```

---

## Testing with cURL

```bash
# Get monthly data
curl http://localhost:5000/api/financial-overview?range=month

# Get quarterly data
curl http://localhost:5000/api/financial-overview?range=quarter

# Get yearly data
curl http://localhost:5000/api/financial-overview?range=year

# Export as CSV
curl http://localhost:5000/api/financial-overview/export/csv?range=month \
     -o financial-data.csv
```

---

## Frontend Integration

See [FinancialOverviewChart.md](./FinancialOverviewChart.md) and [FinancialOverviewChart.examples.jsx](./FinancialOverviewChart.examples.jsx) for frontend integration examples.
