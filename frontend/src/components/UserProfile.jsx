import React, { useState } from 'react';
import './UserProfile.css';

/**
 * UserProfile Component
 * 
 * Displays user profile information in the sidebar bottom section:
 * - User avatar (initials)
 * - User name
 * - User email
 * - Settings & Logout buttons
 */

const UserProfile = ({
  user = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    initials: 'AM',
  },
  onSettingsClick = () => console.log('Settings clicked'),
  onLogoutClick = () => console.log('Logout clicked'),
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    setShowMenu(false);
    onLogoutClick();
  };

  const handleSettings = () => {
    setShowMenu(false);
    onSettingsClick();
  };

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header">
        {/* Avatar */}
        <div className="profile-avatar">{user.initials || 'AM'}</div>

        {/* User Info */}
        <div className="profile-info">
          <div className="profile-name">{user.name || 'User Name'}</div>
          <div className="profile-email">{user.email || 'user@example.com'}</div>
        </div>

        {/* Menu Toggle */}
        <button
          className="profile-menu-btn"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle profile menu"
          aria-expanded={showMenu}
        >
          ⋮
        </button>
      </div>

      {/* Profile Menu */}
      {showMenu && (
        <div className="profile-menu" onClick={(e) => e.stopPropagation()}>
          <button
            className="profile-menu-item"
            onClick={handleSettings}
          >
            <span className="profile-menu-icon">⚙️</span>
            <span>Settings</span>
          </button>
          <button
            className="profile-menu-item"
            onClick={handleLogout}
          >
            <span className="profile-menu-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
