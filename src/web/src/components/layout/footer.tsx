// React and i18next v21.6.16, v11.18.6
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Internal imports
import { colors, typography } from '../../theme/index';
import { APP_NAME, SUPPORTED_LANGUAGES } from '../../lib/constants';
import { initializeI18n } from '../../i18n/config';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Footer container styles using theme configuration
const footerStyles = {
  container: `
    w-full
    bg-${colors.background.secondary}
    py-8
    px-4
    md:px-6
    mt-auto
  `,
  content: `
    max-w-7xl
    mx-auto
    flex
    flex-col
    md:flex-row
    justify-between
    items-center
    gap-6
  `,
  branding: `
    flex
    flex-col
    items-center
    md:items-start
    gap-2
  `,
  navigation: `
    flex
    flex-wrap
    justify-center
    gap-6
  `,
  languageSelector: `
    flex
    items-center
    gap-2
  `
};

// Requirement: Multi-language Support (1.3 Scope/In-Scope Elements/Implementation Boundaries)
// Footer component with language selection and navigation
const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentYear] = useState(new Date().getFullYear());

  // Handle language change with i18n initialization
  const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    initializeI18n();
  }, [i18n]);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Navigation links with ARIA labels and keyboard navigation
  const navigationLinks = [
    { href: '/privacy', label: t('navigation.privacy') },
    { href: '/terms', label: t('navigation.terms') },
    { href: '/contact', label: t('navigation.contact') },
    { href: '/help', label: t('navigation.help') }
  ];

  return (
    <footer className={footerStyles.container} role="contentinfo">
      <div className={footerStyles.content}>
        {/* Branding Section */}
        <div className={footerStyles.branding}>
          <span className={`text-${colors.text.primary} font-${typography.fontWeight.bodyMedium}`}>
            {APP_NAME}
          </span>
          <span className={`text-${colors.text.secondary} text-sm`}>
            &copy; {currentYear} {t('footer.rights_reserved')}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className={footerStyles.navigation} aria-label={t('footer.navigation_aria_label')}>
          {navigationLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`
                text-${colors.text.secondary}
                hover:text-${colors.text.primary}
                transition-colors
                duration-200
              `}
              aria-label={label}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Language Selection */}
        <div className={footerStyles.languageSelector}>
          <label
            htmlFor="language-select"
            className={`text-${colors.text.secondary} text-sm`}
          >
            {t('preferences.language')}:
          </label>
          <select
            id="language-select"
            value={i18n.language}
            onChange={handleLanguageChange}
            className={`
              bg-${colors.background.primary}
              border
              border-${colors.border.light}
              rounded
              px-2
              py-1
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-${colors.primary[400]}
            `}
            aria-label={t('preferences.language_selector_aria_label')}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {t(`meta.language_name`, { lng: lang })}
              </option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  );
};

export default Footer;