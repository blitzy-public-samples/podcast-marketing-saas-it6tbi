/**
 * Human Tasks:
 * 1. Verify header accessibility with screen reader testing
 * 2. Test responsive behavior across different device sizes
 * 3. Validate keyboard navigation functionality
 * 4. Ensure proper color contrast ratios for all header elements
 * 5. Test header interactions with different user roles
 */

// React v18.0.0
import React, { useState } from 'react';

// Internal imports
import Sidebar from './sidebar';
import { colors, typography } from '../../theme/index';
import useAuth from '../../hooks/use-auth';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const headerStyles = {
  height: '64px',
  backgroundColor: colors.background.primary,
  borderBottom: `1px solid ${colors.border.light}`,
  fontFamily: typography.fontFamily.body,
};

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
  };

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-4 flex items-center justify-between"
      style={headerStyles}
      // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
      role="banner"
      aria-label="Main header"
    >
      {/* Left section with logo and sidebar toggle */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle button */}
        <Button
          label=""
          onClick={handleSidebarToggle}
          variant="ghost"
          size="small"
          className="lg:hidden"
          ariaLabel={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          icon={
            <span className="text-xl">
              {isSidebarOpen ? '✕' : '☰'}
            </span>
          }
        />

        {/* Application logo/branding */}
        <div 
          className="flex items-center gap-2"
          // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
          role="img"
          aria-label="Podcast Marketing Automation logo"
        >
          <span className="text-2xl">🎙️</span>
          <span 
            className="text-lg font-semibold hidden md:block"
            style={{ color: colors.text.primary }}
          >
            Podcast Marketing
          </span>
        </div>
      </div>

      {/* Right section with user actions */}
      <div className="flex items-center gap-4">
        {/* Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management) */}
        {isAuthenticated ? (
          <>
            {/* User profile section */}
            <div className="flex items-center gap-3">
              <span 
                className="text-sm hidden md:block"
                style={{ color: colors.text.secondary }}
              >
                {user?.email}
              </span>
              <Avatar
                src={user?.avatar}
                alt={`${user?.email}'s profile`}
                size={32}
                initials={user?.email?.charAt(0).toUpperCase()}
              />
            </div>

            {/* Logout button */}
            <Button
              label="Logout"
              onClick={handleLogout}
              variant="ghost"
              size="small"
              className="hidden md:flex"
              ariaLabel="Log out of your account"
            />
          </>
        ) : (
          // Login button for unauthenticated users
          <Button
            label="Login"
            onClick={() => window.location.href = '/login'}
            variant="primary"
            size="small"
            ariaLabel="Log in to your account"
          />
        )}
      </div>

      {/* Sidebar component */}
      <Sidebar />
    </header>
  );
};

export default Header;