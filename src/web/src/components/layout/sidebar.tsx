/**
 * Human Tasks:
 * 1. Verify sidebar navigation items match the application's routing structure
 * 2. Test keyboard navigation and screen reader compatibility
 * 3. Validate sidebar responsiveness across different breakpoints
 * 4. Ensure proper ARIA labels and roles are implemented
 * 5. Test sidebar interactions with different user roles and permissions
 */

// tailwindcss v3.3.0
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Internal imports
import { Button } from '../ui/button';
import store from '../../store/index';
import { theme } from '../../theme/index';
import { formatError } from '../../lib/utils';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Navigation items configuration based on user roles
const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '📊',
    roles: ['user', 'admin'],
  },
  {
    label: 'Episodes',
    path: '/episodes',
    icon: '🎙️',
    roles: ['user', 'admin'],
  },
  {
    label: 'Marketing',
    path: '/marketing',
    icon: '📢',
    roles: ['admin', 'marketing'],
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: '📈',
    roles: ['admin', 'analyst'],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: '⚙️',
    roles: ['user', 'admin'],
  },
];

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get user authentication state and roles
  useEffect(() => {
    try {
      const state = store.getState();
      const user = state.auth?.user;
      if (user?.roles) {
        setUserRoles(user.roles);
      }
    } catch (err) {
      const formattedError = formatError(err);
      setError(formattedError);
      console.error('Sidebar auth error:', formattedError);
    }
  }, []);

  // Filter navigation items based on user roles
  const filteredNavItems = navigationItems.filter(item =>
    item.roles.some(role => userRoles.includes(role))
  );

  // Handle navigation item click
  const handleNavClick = (path: string) => {
    try {
      router.push(path);
    } catch (err) {
      const formattedError = formatError(err);
      setError(formattedError);
      console.error('Navigation error:', formattedError);
    }
  };

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  return (
    <aside
      className={`
        fixed left-0 top-0 h-full
        bg-white dark:bg-gray-800
        transition-all duration-300 ease-in-out
        shadow-lg
        ${isOpen ? 'w-64' : 'w-20'}
        z-40
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Toggle button */}
      <Button
        label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="small"
        className="absolute right-4 top-4"
        ariaLabel={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      />

      {/* Navigation list */}
      <nav className="mt-16 p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <Button
                label={isOpen ? item.label : ''}
                onClick={() => handleNavClick(item.path)}
                variant={router.pathname === item.path ? 'primary' : 'ghost'}
                size="medium"
                className={`
                  w-full text-left
                  ${isOpen ? 'justify-start' : 'justify-center'}
                  ${router.pathname === item.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                icon={<span className="text-xl">{item.icon}</span>}
                iconPosition="left"
                ariaLabel={item.label}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Error display */}
      {error && (
        <div
          className="absolute bottom-4 left-4 right-4 p-4 bg-red-100 text-red-700 rounded-md"
          role="alert"
        >
          {error}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;