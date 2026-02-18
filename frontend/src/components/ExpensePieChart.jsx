import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Rent", value: 32 },
  { name: "Business", value: 28 },
  { name: "Food", value: 15 },
  { name: "Other", value: 13 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function ExpensePieChart() {
  return (
    <div className="chart-card">
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={100}>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpensePieChart;