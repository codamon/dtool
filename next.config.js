const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

module.exports = withNextIntl({
  // Remove i18n configuration
}); 