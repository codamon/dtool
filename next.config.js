const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

module.exports = withNextIntl({
  // 移除 i18n 配置
}); 