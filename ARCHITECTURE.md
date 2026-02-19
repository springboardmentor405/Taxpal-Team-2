# FinancialOverviewChart - Architecture & Data Flow

## 🏗️ Component Architecture

```
FinancialOverviewChart Component
│
├── Header Section
│   ├── Title: "Income vs Expenses"
│   └── Toggle Buttons: [Month] [Quarter] [Year]
│
├── Chart Section
│   ├── RespFUnsiveContainer (Recharts)
│   │   ├── BarChart
│   │   │   ├── CartesianGrid (Light gray, no vertical lines)
│   │   │   ├── XAxis (Month labels)
│   │   │   ├── YAxis (Formatted: $0, $3k, $5k...)
│   │   │   ├── Tooltip (Custom)
│   │   │   ├── Legend (Bottom center)
│   │   │   ├── Bar(income) - Color: #10B981 (Green)
│   │   │   └── Bar(expenses) - Color: #EF4444 (Red)
│   │   │
│   │   ├── OR Loading Skeleton (animation)
│   │   └── OR Empty State (no data message)
│
└── Footer Section
    └── Summary Stats
        ├── Total Income
        ├── Total Expenses
        └── Net Profit
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│         Dashboard.jsx (Parent)                       │
└────────────────────────┬────────────────────────────┘
                         │
                         │ Props: data, isLoading
                         ↓
┌─────────────────────────────────────────────────────┐
│     FinancialOverviewChart.jsx (Component)          │
│                                                      │
│  State:                                             │
│  • timeRange: "month" | "quarter" | "year"         │
│                                                      │
│  Effects:                                           │
│  • Toggle buttons → change display                 │
│  • Data changes → re-render chart                  │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ↓               ↓               ↓
    Has Data?       Loading?        Empty?
        │              │               │
        ↓              ↓               ↓
    Show Chart    Show Skeleton   Show Message
    (Recharts)    (Animation)     (Icon + Text)
```

---

## 🔄 State Management Flow

```
User Interaction
(Click Toggle Button)
        ↓
    setTimeRange(newRange)
        ↓
    timeRange State Updates
        ↓
    useMemo Dependency Change
        ↓
    chartData Recalculates
        ↓
    Component Re-renders
        ↓
    Chart Updates with New Data
        ↓
    Smooth Animation (300ms)
```

---

## 🌐 API Integration Flow

```
┌────────────────────────────────────────────────────┐
│  Frontend Component                                 │
│  (FinancialOverviewChart)                          │
└─────────────┬──────────────────────────────────────┘
              │
              │ useEffect Hook + State
              │
         ┌────▼─────┐
         │ Trigger  │
         │ Fetch    │
         └────┬─────┘
              │
              ↓
┌────────────────────────────────────────────────────┐
│  API Service Layer                                  │
│  (financialOverviewAPI.js)                         │
│                                                     │
│  • fetchFinancialOverview(timeRange)              │
│  • fetchFinancialByDateRange(start, end)          │
│  • Cache Layer (5-min TTL)                        │
│  • Error Handling + Retry Logic                   │
└─────────────┬──────────────────────────────────────┘
              │
              ↓
    ┌─────────────────────┐
    │   HTTP Request      │
    │  GET /api/...       │
    │  +  Params          │
    │  +  Headers         │
    └─────────────┬───────┘
                  │
                  ↓
┌────────────────────────────────────────────────────┐
│  Backend Server                                    │
│  (Node.js/Express/etc.)                            │
│                                                     │
│  GET /api/financial-overview                      │
│  Query DB → Aggregate Data → Format Response      │
└─────────────┬──────────────────────────────────────┘
              │
              ↓
    ┌─────────────────────┐
    │  HTTP Response      │
    │  Status: 200        │
    │  Data: [...]        │
    └──────────┬──────────┘
               │
               ↓
┌────────────────────────────────────────────────────┐
│  Cache Storage                                      │
│  (Browser Memory)                                   │
│                                                     │
│  Key: "financial_month"                            │
│  Value: [...data...] + timestamp                   │
│  TTL: 5 minutes                                    │
└─────────────┬──────────────────────────────────────┘
              │
              ↓
┌────────────────────────────────────────────────────┐
│  Component State Update                            │
│                                                     │
│  setData(response)                                 │
│  setIsLoading(false)                               │
└─────────────┬──────────────────────────────────────┘
              │
              ↓
    ┌─────────────────────┐
    │  useState Updates   │
    │  Component Renders  │
    └─────────────┬───────┘
                  │
                  ↓
    ┌─────────────────────────┐
    │  Chart Displays Data    │
    │  with Animation         │
    │  (300ms ease)           │
    └─────────────────────────┘
```

---

## 🎯 Responsive Design Breakpoints

```
Mobile                Tablet               Desktop
(<640px)              (640-1024px)         (>1024px)
│                     │                    │
├─ 12px Padding      ├─ 16px Padding      ├─ 24px Padding
├─ 280px Height      ├─ 300px Height      ├─ 380px Height
├─ Stacked Layout    ├─ Adjusted Layout   ├─ Full Layout
├─ Vertical Legend   ├─ Horizontal Legend ├─ Horizontal Legend
├─ Vertical Stats    ├─ Horizontal Stats  ├─ Horizontal Stats
└─ Touch Optimized   └─ Balanced          └─ Full Featured
```

---

## 🎨 Styling Architecture

```
FinancialOverviewChart.css
│
├── Base Styles
│   ├── .financial-overview-card (Light mode)
│   └── .financial-overview-card.dark-mode
│
├── Header Section
│   ├── .chart-header
│   ├── .chart-title
│   ├── .toggle-group
│   ├── .toggle-btn (active)
│   └── .toggle-btn (inactive)
│
├── Chart Section
│   ├── .chart-content
│   ├── .custom-tooltip
│   ├── .chart-skeleton (Loading)
│   └── .empty-state (Empty)
│
├── Footer Section
│   ├── .chart-footer
│   ├── .stat-item
│   ├── .stat-label
│   ├── .stat-value (income/expense/profit)
│   └── .stat-divider
│
├── Animations
│   ├── @keyframes loading (Skeleton)
│   └── transition: all 0.3s ease
│
├── Media Queries
│   ├── @media (max-width: 1024px)
│   ├── @media (max-width: 640px)
│   ├── @media (prefers-reduced-motion: reduce)
│   └── @media print
│
└── Accessibility
    ├── :focus-visible (Focus states)
    ├── ARIA labels
    └── High contrast colors
```

---

## 🔌 Component Integration Points

```
App.jsx (Root)
│
├── Sidebar
├── Dashboard.jsx
│   │
│   ├── SummaryCards
│   │
│   ├── Charts Section
│   │   ├── FinancialOverviewChart ← NEW!
│   │   │   └── Uses: financialOverviewAPI.js
│   │   └── ExpensePieChart
│   │
│   └── TransactionsTable
│
└── ... other pages/components
```

---

## 📦 File Dependencies

```
FinancialOverviewChart.jsx
├── Imports
│   ├── react (useState, useEffect, useMemo)
│   ├── recharts (BarChart, Bar, XAxis, YAxis, etc.)
│   └── FinancialOverviewChart.css
│
├── Exports
│   └── FinancialOverviewChart (default)
│
├── Contains
│   ├── CustomTooltip Component
│   ├── ChartSkeleton Component
│   ├── EmptyState Component
│   └── formatYAxis Function
│
└── Uses Props
    ├── isDarkMode?: boolean
    ├── data?: Array<{label, income, expenses}>
    └── isLoading?: boolean
```

---

## 🔄 Component Lifecycle

```
Mount
  ├── Constructor/State Init
  │   ├── timeRange = "month"
  │   └── data = null
  │
  ├── Render
  │   ├── Render Header
  │   ├── Render Chart/Skeleton/Empty
  │   └── Render Footer (if data exists)
  │
  └── Effect
      └── (From parent) Load initial data

Update (Toggle Button Click)
  ├── State Update
  │   └── setTimeRange(newRange)
  │
  ├── Re-compute
  │   ├── useMemo recalculates chartData
  │   └── useMemo calculates maxValue
  │
  ├── Animation
  │   ├── CSS transition: 300ms ease
  │   └── Recharts animation
  │
  └── Render
      └── New chart displayed

Unmount
  ├── Component removed
  ├── Event listeners cleaned
  └── Memory freed
```

---

## 🧠 State & Props Relationship

```
Parent Component (Dashboard)
│
├─ State: fetchedData
├─ State: isLoading
└─ State: isDarkMode
    │
    ↓
Pass to FinancialOverviewChart
│
├─ Props: data = fetchedData
├─ Props: isLoading
└─ Props: isDarkMode
    │
    ↓
FinancialOverviewChart
│
├─ Local State: timeRange
│
├─ useMemo: chartData
│   (depends on: timeRange, data)
│
├─ useMemo: maxValue
│   (depends on: chartData, hasData)
│
├─ Conditional Render
│   ├─ if (isLoading) → Skeleton
│   ├─ if (!hasData) → EmptyState
│   └─ if (hasData) → Chart
│
└─ Apply Theme
    └─ if (isDarkMode) → Dark styles
```

---

## 🎯 Decision Tree - What to Render

```
Start: FinancialOverviewChart
│
├─ Is isLoading true?
│   ├─ YES → Show ChartSkeleton
│   └─ NO → Continue
│
├─ Does data exist and have length > 0?
│   ├─ NO → Show EmptyState
│   └─ YES → Show BarChart
│
├─ Chart Renderered?
│   └─ YES → Show Footer Stats
│
└─ Always Show:
    ├─ Header (Title + Toggle Buttons)
    └─ Apply isDarkMode styling
```

---

## 🔐 Error Handling Flow

```
fetchFinancialOverview()
  │
  ├─ Try
  │   ├─ Build params
  │   ├─ Make axios request
  │   ├─ Validate response
  │   └─ Return data
  │
  ├─ Catch
  │   ├─ Log error
  │   ├─ Extract message
  │   └─ Throw formatted error
  │
  └─ In Component
      ├─ setError(message)
      ├─ Display error UI
      ├─ Show retry button
      └─ onChange → Clear error & retry
```

---

## 🚀 Performance Optimization Points

```
1. Memoization
   └─ useMemo for: chartData, maxValue
      (Avoid recalculation on every render)

2. Lazy Loading
   └─ Chart renders only if data exists
      (Skeleton shown during loading)

3. Caching
   └─ API Service caches for 5 minutes
      (Reduce backend requests)

4. CSS Optimization
   ├─ Hardware-accelerated transitions
   ├─ Minimal repaints
   └─ Optimized animations

5. Component Splitting
   ├─ CustomTooltip (isolated)
   ├─ ChartSkeleton (isolated)
   └─ EmptyState (isolated)

6. Bundle Size
   └─ Uses Recharts (already in project)
      (No new heavy dependencies)
```

---

## 📱 Responsive Rendering Logic

```
const screenWidth = window.innerWidth

if (screenWidth < 640)
  ├─ Mobile Mode
  ├─ Stack toggle horizontally with flex: 1
  ├─ Reduce padding to 12px
  ├─ Chart height: 280px
  ├─ Legend: vertical (display: block)
  └─ Stats: no dividers

else if (screenWidth < 1024)
  ├─ Tablet Mode
  ├─ Adjust header to column layout
  ├─ Padding: 16px
  ├─ Chart height: 300px
  ├─ Legend: horizontal
  └─ Stats: horizontal with dividers

else (screenWidth >= 1024)
  ├─ Desktop Mode
  ├─ Full featured layout
  ├─ Padding: 24px
  ├─ Chart height: 380px
  ├─ Legend: horizontal centered
  └─ Stats: horizontal with dividers
```

---

## 🎨 Color Scheme Architecture

```
Light Mode (default)
├─ Background: #FFFFFF
├─ Text Primary: #111827
├─ Text Secondary: #6B7280
├─ Borders/Grid: #E5E7EB
├─ Input Bg: #F3F4F6
├─ Income: #10B981 (Green)
└─ Expenses: #EF4444 (Red)

Dark Mode (isDarkMode=true)
├─ Background: #1F2937
├─ Text Primary: #F3F4F6
├─ Text Secondary: #D1D5DB
├─ Borders/Grid: #4B5563
├─ Input Bg: #374151
├─ Income: #10B981 (Green) - same
└─ Expenses: #EF4444 (Red) - same
```

---

## 📊 Data Aggregation Pipeline

```
Raw Transaction Data (Database)
  ↓
Filter by Date Range & User
  ↓
Group by Period (Month/Quarter/Year)
  ↓
Aggregate Amounts
  ├─ Sum income by period
  └─ Sum expenses by period
  ↓
Calculate Totals
  ├─ Total income across periods
  ├─ Total expenses across periods
  └─ Net profit (income - expenses)
  ↓
Format for Display
  ├─ Label: "Jan", "Q1", "2025"
  ├─ Income: 8200
  └─ Expenses: 3500
  ↓
FinancialOverviewChart
  └─ Display with Recharts
```

---

## 🔍 Debugging Architecture

```
Issue Detection
  ├─ Browser Console (Errors)
  ├─ React DevTools (Component Tree)
  ├─ Network Tab (API Calls)
  └─ Lighthouse (Performance)

Component Logging
  ├─ Mount: [FinancialOverviewChart] mounted
  ├─ State: timeRange = "month"
  ├─ Data: chartData = [...]
  └─ Effect: Data updated

API Logging
  ├─ Request: GET /api/financial-overview?range=month
  ├─ Response: 200 OK, 6 items
  ├─ Cache: Using cached data
  └─ Error: Network error, retrying...

Performance Profiling
  ├─ Mount time: 45ms
  ├─ Chart render: 230ms
  ├─ Re-render on toggle: 150ms
  └─ Memory: 2.3MB
```

---

## 📋 Use Case Architecture

```
Use Case 1: View Monthly Overview
  User Clicks "Dashboard"
    ↓
  Component loads with mock data
    ↓
  Displays June & previous months
    ↓
  User can toggle Month/Quarter/Year

Use Case 2: Export Data
  User Clicks "Export CSV"
    ↓
  API fetches fresh data
    ↓
  Formats as CSV
    ↓
  Browser downloads file

Use Case 3: Real-time Updates
  WebSocket connects
    ↓
  New transaction event received
    ↓
  Component re-fetches data
    ↓
  Chart updates with animation

Use Case 4: Dark Mode
  User toggles dark mode in settings
    ↓
  isDarkMode prop passed down
    ↓
  .dark-mode class applied
    ↓
  All colors adjust automatically
```

---

This architecture provides a scalable, maintainable foundation for the FinancialOverviewChart component while supporting future enhancements and integrations.
