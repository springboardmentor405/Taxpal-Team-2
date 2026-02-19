# FinancialOverviewChart - Testing & Debugging Guide

## Testing Setup

### Unit Tests with Vitest

Create `FinancialOverviewChart.test.jsx`:

```javascript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "@testing-library/react";
import FinancialOverviewChart from "./FinancialOverviewChart";

describe("FinancialOverviewChart", () => {
  const mockData = [
    { label: "Jan", income: 8200, expenses: 3500 },
    { label: "Feb", income: 6700, expenses: 3000 },
    { label: "Mar", income: 8800, expenses: 3600 },
  ];

  describe("Rendering", () => {
    it("should render the component with title", () => {
      render(<FinancialOverviewChart data={mockData} />);
      expect(screen.getByText("Income vs Expenses")).toBeInTheDocument();
    });

    it("should render toggle buttons", () => {
      render(<FinancialOverviewChart data={mockData} />);
      expect(screen.getByLabelText(/Month/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Quarter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    });

    it("should render chart with data", () => {
      render(<FinancialOverviewChart data={mockData} />);
      expect(screen.getByLabelText(/Income and Expenses/i)).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should display skeleton when loading", () => {
      render(<FinancialOverviewChart isLoading={true} />);
      expect(screen.getByRole("status", { busy: true })).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should display empty state when no data", () => {
      render(<FinancialOverviewChart data={[]} />);
      expect(screen.getByText(/No transactions yet/i)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should toggle time range on button click", async () => {
      const user = userEvent.setup();
      render(<FinancialOverviewChart data={mockData} />);

      const quarterBtn = screen.getByLabelText(/View by Quarter/i);
      await user.click(quarterBtn);

      expect(quarterBtn).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Dark Mode", () => {
    it("should apply dark mode class when isDarkMode is true", () => {
      const { container } = render(
        <FinancialOverviewChart data={mockData} isDarkMode={true} />
      );
      expect(container.querySelector(".dark-mode")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<FinancialOverviewChart data={mockData} />);
      expect(screen.getByRole("group", { name: /Time range selection/i }))
        .toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<FinancialOverviewChart data={mockData} />);
      const heading = screen.getByText("Income vs Expenses");
      expect(heading.tagName).toBe("H2");
    });
  });

  describe("Summary Stats", () => {
    it("should display total income, expenses, and profit", () => {
      render(<FinancialOverviewChart data={mockData} />);
      expect(screen.getByText(/Total Income:/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Expenses:/i)).toBeInTheDocument();
      expect(screen.getByText(/Net Profit:/i)).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

```javascript
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, userEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BasicFinancialOverviewExample } from "./FinancialOverviewChart.examples";

vi.mock("axios");

describe("FinancialOverviewChart Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display data on mount", async () => {
    const mockData = [
      { label: "Jan", income: 8200, expenses: 3500 },
    ];

    axios.get.mockResolvedValueOnce({
      data: { data: mockData },
    });

    render(<BasicFinancialOverviewExample />);

    await waitFor(() => {
      expect(screen.queryByRole("status", { busy: true })).not.toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    axios.get.mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<BasicFinancialOverviewExample />);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it("should refetch data when time range changes", async () => {
    const mockData = [
      { label: "Jan", income: 8200, expenses: 3500 },
    ];

    axios.get.mockResolvedValue({
      data: { data: mockData },
    });

    const { rerender } = render(<BasicFinancialOverviewExample />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Simulate time range change (in real scenario)
    rerender(<BasicFinancialOverviewExample />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});
```

---

## Manual Testing Checklist

### Desktop Testing
- [ ] Component renders without errors
- [ ] All toggle buttons are clickable
- [ ] Chart updates when time range changes
- [ ] Tooltip appears on hover with correct data
- [ ] Summary stats calculate correctly
- [ ] Loading skeleton displays
- [ ] Empty state displays when no data
- [ ] Dark mode applies correctly
- [ ] Responsive padding and spacing

### Mobile Testing (< 640px width)
- [ ] Toggle buttons stack properly
- [ ] Chart height reduced appropriately
- [ ] Legend displays vertically
- [ ] Touch events work correctly
- [ ] Heading remains visible and readable
- [ ] Stats stack vertically (no separators)
- [ ] Tooltip doesn't overflow screen
- [ ] Performance is acceptable

### Accessibility Testing
- [ ] Keyboard navigation works (Tab/Shift+Tab)
- [ ] Toggle buttons focusable and clickable with keyboard
- [ ] Enter/Space activates buttons
- [ ] Screen reader reads all labels correctly
- [ ] High contrast visible in dark mode
- [ ] Focus indicators visible
- [ ] Motion respects prefers-reduced-motion

### Browser Compatibility
- [ ] Chrome 90+ ✓
- [ ] Firefox 88+ ✓
- [ ] Safari 14+ ✓
- [ ] Edge 90+ ✓
- [ ] Mobile browsers ✓

---

## Debugging Guide

### Common Issues & Solutions

#### Issue: Chart Not Displaying

**Symptoms:**
- White space where chart should be
- No error in console

**Debugging Steps:**
```javascript
// 1. Check if data is passed correctly
console.log("Chart data:", data);

// 2. Verify data structure
console.log("Data structure:", JSON.stringify(data, null, 2));

// 3. Check if ResponsiveContainer has a parent with height
console.log("Container height:", container.offsetHeight);
```

**Solution:**
- Ensure parent container has fixed height
- Verify data array is not empty
- Check Recharts is installed: `npm list recharts`

---

#### Issue: Toggle Buttons Not Changing Chart

**Symptoms:**
- Buttons highlight but chart doesn't update
- Old data still displayed

**Debugging Steps:**
```javascript
// 1. Check if state updates
const [timeRange, setTimeRange] = useState("month");
console.log("Current time range:", timeRange);

// 2. Verify callback is triggered
onClick={() => {
  console.log("Button clicked, new range:", id);
  setTimeRange(id);
}}

// 3. Check useMemo dependency
const chartData = useMemo(() => {
  console.log("Chart data recalculated for range:", timeRange);
  return data || DATA_BY_RANGE[timeRange];
}, [timeRange, data]);
```

**Solution:**
- Ensure useEffect dependency includes timeRange
- Verify data update propagates from parent component
- Clear browser cache (hard refresh)

---

#### Issue: Loading Skeleton Never Disappears

**Symptoms:**
- Skeleton animation continues indefinitely
- Component never transitions to chart

**Debugging Steps:**
```javascript
// 1. Check loading state management
console.log("Is loading:", isLoading);

// 2. Verify API call completes
fetchData()
  .then(data => {
    console.log("Data fetched:", data);
    setData(data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  })
  .finally(() => {
    console.log("Setting isLoading to false");
    setIsLoading(false);
  });
```

**Solution:**
- Ensure API call includes `.finally()` to set isLoading
- Add error handling that still sets isLoading to false
- Check API endpoint returns correct format

---

#### Issue: Dark Mode Not Applied

**Symptoms:**
- Component still uses light theme
- CSS changes don't take effect

**Debugging Steps:**
```javascript
// 1. Verify prop is passed
console.log("isDarkMode prop:", isDarkMode);

// 2. Check if class is applied
console.log("Has dark-mode class:", 
  element.classList.contains("dark-mode"));

// 3. Inspect computed styles
const computed = window.getComputedStyle(element);
console.log("Background color:", computed.backgroundColor);
```

**Solution:**
- Ensure isDarkMode prop is passed correctly
- Clear CSS cache
- Check if parent component provides dark mode prop
- Verify CSS file is imported

---

#### Issue: Accessibility Issues Reported

**Symptoms:**
- Automated accessibility checker flags issues
- Screen reader doesn't read content correctly

**Debugging Steps:**
```javascript
// Test with screen reader (Windows Narrator)
// - Press Win + Enter to start narrator
// - Navigate with Tab key
// - Listen for labels

// Test focus indicators
// - Press Tab to navigate
// - Focus should be clearly visible

// Test ARIA labels
// - Right-click → Inspect → Check ARIA attributes
```

**Solution:**
- Add ARIA labels to interactive elements
- Use semantic HTML (buttons not divs)
- Ensure focus indicators are visible
- Test with actual screen reader software

---

## Performance Debugging

### Memory Profiling

```javascript
// In browser DevTools
1. Open Performance tab
2. Start recording
3. Interact with component
4. Stop and analyze

// Check for:
- Memory leaks (growing heap size)
- Excessive re-renders
- Long-running tasks
```

### Component Profiling

```javascript
import { Profiler } from "react";

<Profiler
  id="FinancialOverviewChart"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }}
>
  <FinancialOverviewChart />
</Profiler>
```

### Network Debugging

```javascript
// In DevTools Network tab
// Check:
- Request URL is correct
- Status code is 200
- Response format matches expected
- No waterfall delays
- Cache headers are set

// Filter by API calls
fetch(`/api/financial-overview?range=month`)
  .then(res => {
    console.log("Status:", res.status);
    console.log("Headers:", res.headers);
    return res.json();
  })
  .then(data => console.log("Data:", data))
  .catch(error => console.error("Error:", error));
```

---

## Console Logging Best Practices

```javascript
// Good logging practices
console.log("[FinancialOverviewChart]", "Component mounted");
console.log("[FinancialOverviewChart] Chart data:", chartData);
console.error("[FinancialOverviewChart] Error:", error);

// Use debug flag for conditional logging
const DEBUG = process.env.NODE_ENV === "development";
DEBUG && console.log("Debug info:", data);

// Use groups for organization
console.group("[FinancialOverviewChart]");
console.log("Data:", data);
console.log("Loading:", isLoading);
console.groupEnd();
```

---

## Browser DevTools Tips

### Performance
- Use Lighthouse audit (>90 performance score)
- Monitor FCP (First Contentful Paint)
- Check for layout shifts (CLS)

### Responsive Design
- Use Device Toolbar (Ctrl+Shift+M)
- Test at breakpoints: 640px, 1024px, 1440px
- Check touch events on mobile

### Accessibility
- Use Accessibility Inspector
- Run axe DevTools audit
- Test with keyboard only
- Test with screen reader

### Memory
- Heap snapshots before/after interactions
- Detached DOM nodes check
- Event listener cleanup verification

---

## Quick Debug Commands

```javascript
// In browser console

// Check component instance
$0  // Selected element

// Search for specific text
document.body.innerText.includes("Income vs Expenses")

// Check CSS class
document.querySelector(".financial-overview-card").classList

// Force re-render (if using React DevTools)
$r.forceUpdate?.()

// Profile a function
console.time("chart-render");
// ... code to profile
console.timeEnd("chart-render");
```

---

## Reporting Bugs

When reporting issues, include:

1. **Steps to Reproduce**
   - Exact actions that led to the issue
   - Data used (anonymized if needed)

2. **Expected Behavior**
   - What should happen

3. **Actual Behavior**
   - What actually happens

4. **Screenshots/Video**
   - Visual evidence of the issue

5. **Browser & OS**
   - Browser version
   - Operating system

6. **Console Errors**
   - Full error stack trace
   - Network errors

7. **Component Props**
   - Current prop values
   - Parent component setup

Example:
```
Bug: Chart doesn't update when time range toggles

Steps:
1. Load dashboard
2. Click "Quarter" toggle button
3. Observe chart

Expected: Chart should display quarterly data
Actual: Chart still shows monthly data

Browser: Chrome 125, Windows 11
Console: No errors

Props: isDarkMode={false}, isLoading={false}, data={mockData}
```
