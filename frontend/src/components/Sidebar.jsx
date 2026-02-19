import { useState } from 'react';
import UserProfile from './UserProfile';
import './Sidebar.css';

function Sidebar() {
  const [user] = useState({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    initials: 'AM',
  });

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    // Navigate to settings page
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    // Handle logout
  };

  return (
    <div className="sidebar">
      {/* Top Section: Logo & Menu */}
      <div className="sidebar-top">
        <div className="sidebar-logo">TaxPal</div>

        <div className="sidebar-menu">
          <div className="sidebar-menu-item active">Dashboard</div>
          <div className="sidebar-menu-item">Transactions</div>
          <div className="sidebar-menu-item">Budgets</div>
          <div className="sidebar-menu-item">Tax Estimator</div>
          <div className="sidebar-menu-item">Reports</div>
        </div>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="sidebar-bottom">
        <UserProfile
          user={user}
          onSettingsClick={handleSettingsClick}
          onLogoutClick={handleLogoutClick}
        />
      </div>
    </div>
  );
}

export default Sidebar;