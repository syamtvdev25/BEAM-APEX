
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hybridapp.demo',
  appName: 'Apex-Ecom',
  webDir: 'dist',
  server: {
    // Standard androidScheme for Capacitor WebView
    androidScheme: 'http',
    allowNavigation: [
      'ecom.apexgulf.ae',
      'corsproxy.io'
    ]
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  android: {
    // Crucial for communicating with non-HTTPS endpoints in hybrid apps
    allowMixedContent: true,
  }
};

export default config;
