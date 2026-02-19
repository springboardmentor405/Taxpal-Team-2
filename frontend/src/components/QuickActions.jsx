import React from 'react';
import './QuickActions.css';

function QuickActions({ onRecordIncome, onRecordExpense }) {
  const handleRecordIncome = () => {
    onRecordIncome();
  };

  const handleRecordExpense = () => {
    onRecordExpense();
  };

  return (
    <div className="quick-actions">
      <button 
        className="action-btn income-btn"
        onClick={handleRecordIncome}
      >
        <span className="btn-icon">💰</span>
        <span className="btn-text">Record Income</span>
      </button>
      
      <button 
        className="action-btn expense-btn"
        onClick={handleRecordExpense}
      >
        <span className="btn-icon">💸</span>
        <span className="btn-text">Record Expense</span>
      </button>
    </div>
  );
}

export default QuickActions;
