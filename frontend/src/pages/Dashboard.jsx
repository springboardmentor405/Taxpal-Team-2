import Sidebar from "../components/Sidebar";
import SummaryCards from "../components/SummaryCards";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import ExpensePieChart from "../components/ExpensePieChart";
import TransactionsTable from "../components/TransactionsTable";
import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <SummaryCards />

        <div className="charts-section">
          <IncomeExpenseChart />
          <ExpensePieChart />
        </div>

        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;