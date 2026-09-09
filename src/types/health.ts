/**
 * Health and Wearable Integration Types (Apple HealthKit & Google Health Connect)
 */

export interface DailyHealthSummary {
  date: string;
  steps: number;
  stepGoal: number;
  activeCaloriesBurned: number;
  restingHeartRate: number;
  avgHeartRate: number;
  hrvMs: number;
  sleepHours: number;
  sleepQualityScore: number; // 0 - 100
  recoveryScore: number;     // 0 - 100
  trainingLoadScore: number; // 0 - 100
}

export interface HealthServiceConnection {
  appleHealthKit: boolean;
  googleHealthConnect: boolean;
  whoop: boolean;
  oura: boolean;
  garmin: boolean;
  fitbit: boolean;
  lastSyncTimestamp?: string;
}

export interface HealthSyncStatus {
  service: 'apple_health' | 'google_fit' | 'garmin' | 'whoop' | 'oura';
  isConnected: boolean;
  lastSync?: string;
  batteryPercent?: number;
}

export interface ConnectedWearable {
  id: string;
  name: string;
  platform: 'apple_health' | 'google_fit' | 'garmin' | 'whoop' | 'oura';
  connected: boolean;
  lastSync: string;
  batteryLevel?: number;
}
