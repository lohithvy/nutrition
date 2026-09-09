import { Platform } from 'react-native';
import { HealthSyncStatus, ConnectedWearable } from '../../types/health';

export interface HealthBiometrics {
  activeEnergyBurnedKcal: number;
  restingHeartRateBpm: number;
  stepCount: number;
  sleepDurationHours: number;
  bodyWeightKg: number;
  lastSyncTimestamp: string;
}

export interface HealthIntegrationAdapter {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  fetchDailyBiometrics(dateKey: string): Promise<HealthBiometrics>;
  writeDietaryEnergy(calories: number, dateKey: string): Promise<boolean>;
}

// Apple HealthKit Mock Adapter
class AppleHealthKitAdapter implements HealthIntegrationAdapter {
  async isAvailable(): Promise<boolean> {
    return Platform.OS === 'ios';
  }

  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async fetchDailyBiometrics(dateKey: string): Promise<HealthBiometrics> {
    return {
      activeEnergyBurnedKcal: 540,
      restingHeartRateBpm: 58,
      stepCount: 9420,
      sleepDurationHours: 7.8,
      bodyWeightKg: 68.4,
      lastSyncTimestamp: new Date().toISOString(),
    };
  }

  async writeDietaryEnergy(calories: number, dateKey: string): Promise<boolean> {
    return true;
  }
}

// Google Health Connect Mock Adapter
class GoogleHealthConnectAdapter implements HealthIntegrationAdapter {
  async isAvailable(): Promise<boolean> {
    return Platform.OS === 'android';
  }

  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async fetchDailyBiometrics(dateKey: string): Promise<HealthBiometrics> {
    return {
      activeEnergyBurnedKcal: 510,
      restingHeartRateBpm: 60,
      stepCount: 8850,
      sleepDurationHours: 7.5,
      bodyWeightKg: 68.5,
      lastSyncTimestamp: new Date().toISOString(),
    };
  }

  async writeDietaryEnergy(calories: number, dateKey: string): Promise<boolean> {
    return true;
  }
}

// Factory to select active platform health adapter
export function getHealthAdapter(): HealthIntegrationAdapter {
  if (Platform.OS === 'ios') {
    return new AppleHealthKitAdapter();
  }
  return new GoogleHealthConnectAdapter();
}

export const healthService = {
  adapter: getHealthAdapter(),

  async getConnectedWearables(): Promise<ConnectedWearable[]> {
    return [
      {
        id: 'apple-watch',
        name: Platform.OS === 'ios' ? 'Apple Watch Ultra 2' : 'Pixel Watch 2',
        platform: Platform.OS === 'ios' ? 'apple_health' : 'google_fit',
        connected: true,
        lastSync: '12 mins ago',
        batteryLevel: 84,
      },
    ];
  },
};
