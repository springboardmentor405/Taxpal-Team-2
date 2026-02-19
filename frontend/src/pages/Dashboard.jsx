import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import QuickActions from "../components/QuickActions";
import TransactionModal from "../components/TransactionModal";
import SummaryCards from "../components/SummaryCards";
import FinancialOverviewChart from "../components/FinancialOverviewChart";
import ExpenseBreakdownCard from "../components/ExpenseBreakdownCard";
import TransactionsTable from "../components/TransactionsTable";
import "./dashboard.css";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');

  const handleRecordIncome = () => {
    setModalType('income');
    setIsModalOpen(true);
  };

  const handleRecordExpense = () => {
    setModalType('expense');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTransaction = (formData) => {
    console.log(`${modalType} transaction saved:`, formData);
    // TODO: Send to backend API
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        <QuickActions 
          onRecordIncome={handleRecordIncome}
          onRecordExpense={handleRecordExpense}
        />
        <SummaryCards />

        <div className="charts-section">
          <FinancialOverviewChart />
          <ExpenseBreakdownCard />
        </div>

        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          <TransactionsTable />
        </div>
      </div>

      {/* Modal rendered at root level via Radix Portal */}
      <TransactionModal 
        isOpen={isModalOpen}
        type={modalType}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}

export default Dashboard;