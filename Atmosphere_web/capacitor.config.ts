import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'vite_react_shadcn_ts',
  webDir: 'dist',
  android: {
    gradlePlugin: {
      javaVersion: 17
    }
  }
};

export default config;
