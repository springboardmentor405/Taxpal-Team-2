import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">TaxPal</div>

      <div className="sidebar-menu">
        <div className="sidebar-menu-item active">Dashboard</div>
        <div className="sidebar-menu-item">Transactions</div>
        <div className="sidebar-menu-item">Budgets</div>
        <div className="sidebar-menu-item">Tax Estimator</div>
        <div className="sidebar-menu-item">Reports</div>
      </div>
    </div>
  );
}

export default Sidebar;