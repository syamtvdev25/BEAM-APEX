
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hybridapp.demo',
  appName: 'Apex-Ecom',
  webDir: 'dist',
  server: {
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
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#003366",
      androidScaleType: "CENTER_INSIDE",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  android: {
    allowMixedContent: true,
  }
};

export default config;
