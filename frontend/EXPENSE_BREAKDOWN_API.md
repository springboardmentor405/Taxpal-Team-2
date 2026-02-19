# Backend API Documentation - ExpenseBreakdownCard

## Overview
This document outlines the required backend API endpoints for the ExpenseBreakdownCard component.

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Get Expense Breakdown by Period

**Endpoint:** `GET /api/expenses/breakdown`

**Query Parameters:**
- `period` (required): `"week"` | `"month"` | `"year"`
- `userId` (optional): User ID for personalized data
- `fromDate` (optional): Start date (YYYY-MM-DD)
- `toDate` (optional): End date (YYYY-MM-DD)

**Example Request:**
```bash
GET /api/expenses/breakdown?period=month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "name": "Rent/Mortgage",
      "value": 32
    },
    {
      "name": "Business Expenses",
      "value": 28
    },
    {
      "name": "Utilities",
      "value": 15
    },
    {
      "name": "Food",
      "value": 12
    },
    {
      "name": "Other",
      "value": 13
    }
  ],
  "metadata": {
    "totalAmount": 6000,
    "totalExpenses": 5,
    "period": "month",
    "generatedAt": "2025-02-19T10:30:00Z"
  }
}
```

---

### 2. Get Expense Breakdown by Date Range

**Endpoint:** `GET /api/expenses/breakdown/range`

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `userId` (optional): User ID

**Example Request:**
```bash
GET /api/expenses/breakdown/range?startDate=2025-01-01&endDate=2025-01-31
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "name": "Rent/Mortgage",
      "value": 30,
      "amount": 1800
    },
    {
      "name": "Business Expenses",
      "value": 28,
      "amount": 1680
    },
    {
      "name": "Utilities",
      "value": 15,
      "amount": 900
    },
    {
      "name": "Food",
      "value": 15,
      "amount": 900
    },
    {
      "name": "Other",
      "value": 12,
      "amount": 720
    }
  ],
  "metadata": {
    "totalAmount": 6000,
    "dateRange": "2025-01-01 to 2025-01-31",
    "generatedAt": "2025-02-19T10:30:00Z"
  }
}
```

---

### 3. Get Expense by Specific Category

**Endpoint:** `GET /api/expenses/category/{categoryName}`

**Path Parameters:**
- `categoryName` (required): Category name (URL encoded)
  - Valid values: "Rent/Mortgage", "Business Expenses", "Utilities", "Food", "Other"

**Query Parameters:**
- `period` (optional): `"week"` | `"month"` | `"year"` (default: "month")
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Example Request:**
```bash
GET /api/expenses/category/Rent%2FMortgage?period=month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "name": "Rent/Mortgage",
    "value": 32,
    "amount": 1920,
    "percentage": 32,
    "count": 1,
    "average": 1920,
    "transactions": [
      {
        "id": "tx_123",
        "date": "2025-02-01",
        "amount": 1920,
        "description": "Monthly rent"
      }
    ]
  }
}
```

---

### 4. Get Total Expenses for Period

**Endpoint:** `GET /api/expenses/total`

**Query Parameters:**
- `period` (required): `"week"` | `"month"` | `"year"`
- `userId` (optional): User ID

**Example Request:**
```bash
GET /api/expenses/total?period=month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalAmount": 6000,
    "period": "month",
    "categoryCount": 5,
    "transactionCount": 42,
    "average": 142.86,
    "breakdown": {
      "Rent/Mortgage": 1920,
      "Business Expenses": 1680,
      "Utilities": 900,
      "Food": 720,
      "Other": 780
    }
  }
}
```

---

### 5. Compare Two Periods

**Endpoint:** `GET /api/expenses/compare`

**Query Parameters:**
- `period1` (required): First period
- `period2` (required): Second period

**Example Request:**
```bash
GET /api/expenses/compare?period1=current-month&period2=previous-month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period1": "February 2025",
    "period2": "January 2025",
    "totalExpenses": {
      "current": 6200,
      "previous": 6000,
      "change": 200,
      "changePercentage": 3.33,
      "trend": "up"
    },
    "breakdownComparison": [
      {
        "category": "Rent/Mortgage",
        "current": 1920,
        "previous": 1920,
        "change": 0,
        "changePercentage": 0
      },
      {
        "category": "Business Expenses",
        "current": 1750,
        "previous": 1680,
        "change": 70,
        "changePercentage": 4.17
      }
    ]
  }
}
```

---

### 6. Get Expense Summary Statistics

**Endpoint:** `GET /api/expenses/summary`

**Query Parameters:**
- `period` (optional): `"week"` | `"month"` | `"year"` (default: "month")

**Example Request:**
```bash
GET /api/expenses/summary?period=month
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalExpenses": 6000,
    "averageDaily": 200,
    "highestCategory": {
      "name": "Rent/Mortgage",
      "amount": 1920,
      "percentage": 32
    },
    "statistics": {
      "median": 120,
      "standardDeviation": 450,
      "highest": 1920,
      "lowest": 45
    },
    "topCategories": [
      { "name": "Rent/Mortgage", "amount": 1920 },
      { "name": "Business Expenses", "amount": 1680 }
    ]
  }
}
```

---

### 7. Export Expense Data

**Endpoint:** `GET /api/expenses/export/csv`

**Query Parameters:**
- `period` (required): `"week"` | `"month"` | `"year"`
- `format` (optional): `"csv"` | `"xlsx"` | `"pdf"` (default: "csv")

**Example Request:**
```bash
GET /api/expenses/export/csv?period=month&format=csv
```

**Response:**
- Content-Type: `text/csv`
- Returns CSV file with expense breakdown

---

### 8. Get Expenses List (Detailed)

**Endpoint:** `GET /api/expenses/list`

**Query Parameters:**
- `period` (required): `"week"` | `"month"` | `"year"`
- `category` (optional): Filter by specific category
- `page` (optional): Pagination page (default: 1)
- `limit` (optional): Items per page (default: 50)

**Example Request:**
```bash
GET /api/expenses/list?period=month&category=Food&page=1&limit=20
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "exp_123",
        "date": "2025-02-15",
        "category": "Food",
        "amount": 45.50,
        "description": "Grocery shopping",
        "merchant": "Whole Foods"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 87,
      "pages": 5
    }
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid period. Must be 'week', 'month', or 'year'",
  "code": "INVALID_PERIOD"
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
  "error": "No expenses found for the specified period",
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
// GET /api/expenses/breakdown
app.get("/api/expenses/breakdown", async (req, res) => {
  try {
    const { period = "month", userId } = req.query;

    // Validate period
    if (!["week", "month", "year"].includes(period)) {
      return res.status(400).json({
        success: false,
        error: "Invalid period",
        code: "INVALID_PERIOD",
      });
    }

    // Build query
    let query = {};
    if (userId) query.userId = userId;

    // Group by category and calculate percentages
    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          name: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          amount: 1,
          count: 1,
        },
      },
    ];

    const expenses = await Expense.aggregate(pipeline);

    // Calculate total and percentages
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const data = expenses.map((exp) => ({
      name: exp.name,
      value: Math.round((exp.amount / totalAmount) * 100),
    }));

    res.json({
      success: true,
      data,
      metadata: {
        totalAmount,
        totalExpenses: expenses.length,
        period,
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
```

---

## Category Validation

Valid expense categories:
- `Rent/Mortgage` → Color: #1D4ED8
- `Business Expenses` → Color: #10B981
- `Utilities` → Color: #F59E0B
- `Food` → Color: #EF4444
- `Other` → Color: #8B5CF6

---

## Response Caching Strategy

For optimal performance, implement response caching:

```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.get("/api/expenses/breakdown", (req, res) => {
  const cacheKey = `expense_breakdown_${req.query.period}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  // Fetch and cache
  const data = fetchExpenses(req.query);
  cache.set(cacheKey, { data, timestamp: Date.now() });

  res.json(data);
});
```

---

## Rate Limiting

Recommended rate limits:
- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute
- **Export endpoints**: 10 requests/minute

---

## Authentication

All endpoints support:
- **JWT Bearer Token** in Authorization header
- **API Key** in x-api-key header (optional)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "x-api-key: YOUR_API_KEY" \
     http://localhost:5000/api/expenses/breakdown?period=month
```

---

## Data Schema

### Expense Transaction Schema
```javascript
{
  _id: ObjectId,
  userId: String,
  category: String,  // One of the 5 categories
  amount: Number,
  description: String,
  date: Date,
  merchant: String,
  tags: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing with cURL

```bash
# Get monthly breakdown
curl http://localhost:5000/api/expenses/breakdown?period=month

# Get weekly breakdown
curl http://localhost:5000/api/expenses/breakdown?period=week

# Get yearly breakdown
curl http://localhost:5000/api/expenses/breakdown?period=year

# Get specific category
curl http://localhost:5000/api/expenses/category/Rent%2FMortgage?period=month

# Get total expenses
curl http://localhost:5000/api/expenses/total?period=month

# Export as CSV
curl http://localhost:5000/api/expenses/export/csv?period=month \
     -o expenses.csv
```

---

## Frontend Integration

### Using the API Service
```javascript
import { fetchExpenseBreakdownCached } from "../services/expenseBreakdownAPI";

// Fetch with automatic caching
const data = await fetchExpenseBreakdownCached("month");
```

### Integration in Component
```jsx
import ExpenseBreakdownCard from "../components/ExpenseBreakdownCard";

function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpenseBreakdownCached("month")
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ExpenseBreakdownCard 
      data={data}
      isLoading={isLoading}
    />
  );
}
```

See [ExpenseBreakdownCard.md](../components/ExpenseBreakdownCard.md) for component documentation.
