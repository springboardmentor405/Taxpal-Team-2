import React from 'react';
import './DashboardHeader.css';

function DashboardHeader() {
  return (
    <div className="dashboard-header">
      <div className="header-left">
        <h1 className="header-title">Financial Overview</h1>
        <p className="header-subtitle">Track your income and expenses at a glance</p>
      </div>

      <div className="header-right">
        <div className="header-stat">
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">$24,580</div>
        </div>
        <div className="header-stat">
          <div className="stat-label">This Month</div>
          <div className="stat-value green">+$3,200</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
