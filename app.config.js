const fs = require('fs');
const path = require('path');

/**
 * Konfigurasi Dinamis Expo (app.config.js)
 * Otomatis mendeteksi keberadaan google-services.json (Android) dan GoogleService-Info.plist (iOS).
 * Jika file belum tersedia, build di GitHub Actions tetap berjalan mulus tanpa error.
 */
module.exports = ({ config }) => {
  const googleServicesPath = path.resolve(__dirname, 'google-services.json');
  const hasGoogleServices = fs.existsSync(googleServicesPath);

  const iosGoogleServicesPath = path.resolve(__dirname, 'GoogleService-Info.plist');
  const hasIosGoogleServices = fs.existsSync(iosGoogleServicesPath);

  return {
    ...config,
    android: {
      ...config.android,
      ...(hasGoogleServices
        ? { googleServicesFile: './google-services.json' }
        : {}),
    },
    ios: {
      ...config.ios,
      ...(hasIosGoogleServices
        ? { googleServicesFile: './GoogleService-Info.plist' }
        : {}),
    },
  };
};
