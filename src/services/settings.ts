import { apiService } from './api';
import { SettingsState } from '../types';

class SettingsService {
  // Get user settings
  async getSettings(): Promise<SettingsState> {
    try {
      const response = await apiService.get<{ settings: SettingsState }>('/settings');
      return response.settings;
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  }

  // Update user settings
  async updateSettings(settings: Partial<SettingsState>): Promise<SettingsState> {
    try {
      const response = await apiService.put<{ settings: SettingsState }>('/settings', settings);
      return response.settings;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  // Update notification settings
  async updateNotificationSettings(notificationSettings: any): Promise<void> {
    try {
      await apiService.put('/settings/notifications', notificationSettings);
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  }

  // Update privacy settings
  async updatePrivacySettings(privacySettings: any): Promise<void> {
    try {
      await apiService.put('/settings/privacy', privacySettings);
    } catch (error) {
      console.error('Update privacy settings error:', error);
      throw error;
    }
  }

  // Update security settings
  async updateSecuritySettings(securitySettings: any): Promise<void> {
    try {
      await apiService.put('/settings/security', securitySettings);
    } catch (error) {
      console.error('Update security settings error:', error);
      throw error;
    }
  }

  // Reset settings to default
  async resetSettings(): Promise<SettingsState> {
    try {
      const response = await apiService.post<{ settings: SettingsState }>('/settings/reset');
      return response.settings;
    } catch (error) {
      console.error('Reset settings error:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
export default settingsService;