import { apiService } from './api';
import { Notification } from '../types';

class NotificationsService {
  // Get all notifications
  async getNotifications(params?: {
    type?: 'budget_alert' | 'goal_milestone' | 'investment_alert' | 'transaction_anomaly' | 'bill_reminder' | 'system' | 'promotional';
    status?: 'unread' | 'read' | 'archived';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'created_at' | 'priority' | 'type';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    summary: {
      total: number;
      unread: number;
      urgent: number;
      byType: Record<string, number>;
    };
  }> {
    try {
      const response = await apiService.get('/notifications', { params });
      return response;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  // Get notification by ID
  async getNotificationById(notificationId: string): Promise<Notification> {
    try {
      const response = await apiService.get<{ notification: Notification }>(`/notifications/${notificationId}`);
      return response.notification;
    } catch (error) {
      console.error('Get notification by ID error:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await apiService.patch<{ notification: Notification }>(`/notifications/${notificationId}/read`);
      return response.notification;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds: string[]): Promise<{
    updated: number;
    failed: string[];
  }> {
    try {
      const response = await apiService.patch('/notifications/bulk-read', { notificationIds });
      return response;
    } catch (error) {
      console.error('Mark multiple as read error:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(filters?: {
    type?: string;
    beforeDate?: string;
  }): Promise<{
    updated: number;
  }> {
    try {
      const response = await apiService.patch('/notifications/mark-all-read', filters);
      return response;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  // Archive notification
  async archiveNotification(notificationId: string): Promise<void> {
    try {
      await apiService.patch(`/notifications/${notificationId}/archive`);
    } catch (error) {
      console.error('Archive notification error:', error);
      throw error;
    }
  }

  // Archive multiple notifications
  async archiveMultiple(notificationIds: string[]): Promise<{
    archived: number;
    failed: string[];
  }> {
    try {
      const response = await apiService.patch('/notifications/bulk-archive', { notificationIds });
      return response;
    } catch (error) {
      console.error('Archive multiple error:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiService.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  // Delete multiple notifications
  async deleteMultiple(notificationIds: string[]): Promise<{
    deleted: number;
    failed: string[];
  }> {
    try {
      const response = await apiService.post('/notifications/bulk-delete', { notificationIds });
      return response;
    } catch (error) {
      console.error('Delete multiple error:', error);
      throw error;
    }
  }

  // Create custom notification
  async createNotification(notificationData: {
    title: string;
    message: string;
    type: 'budget_alert' | 'goal_milestone' | 'investment_alert' | 'transaction_anomaly' | 'bill_reminder' | 'system' | 'promotional';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledFor?: string;
    actionUrl?: string;
    actionText?: string;
    data?: Record<string, any>;
    expiresAt?: string;
    channels?: ('push' | 'email' | 'sms' | 'in_app')[];
  }): Promise<Notification> {
    try {
      const response = await apiService.post<{ notification: Notification }>('/notifications', notificationData);
      return response.notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Get notification settings
  async getNotificationSettings(): Promise<{
    settings: {
      pushNotifications: {
        enabled: boolean;
        budgetAlerts: boolean;
        goalMilestones: boolean;
        investmentAlerts: boolean;
        transactionAnomalies: boolean;
        billReminders: boolean;
        promotional: boolean;
        quietHours: {
          enabled: boolean;
          startTime: string;
          endTime: string;
        };
      };
      emailNotifications: {
        enabled: boolean;
        weeklyDigest: boolean;
        monthlyReport: boolean;
        importantAlerts: boolean;
        promotional: boolean;
        frequency: 'immediate' | 'daily' | 'weekly';
      };
      smsNotifications: {
        enabled: boolean;
        urgentOnly: boolean;
        phoneNumber?: string;
        verified: boolean;
      };
      inAppNotifications: {
        enabled: boolean;
        showBadges: boolean;
        autoMarkRead: boolean;
        retentionDays: number;
      };
    };
  }> {
    try {
      const response = await apiService.get('/notifications/settings');
      return response;
    } catch (error) {
      console.error('Get notification settings error:', error);
      throw error;
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings: {
    pushNotifications?: {
      enabled?: boolean;
      budgetAlerts?: boolean;
      goalMilestones?: boolean;
      investmentAlerts?: boolean;
      transactionAnomalies?: boolean;
      billReminders?: boolean;
      promotional?: boolean;
      quietHours?: {
        enabled?: boolean;
        startTime?: string;
        endTime?: string;
      };
    };
    emailNotifications?: {
      enabled?: boolean;
      weeklyDigest?: boolean;
      monthlyReport?: boolean;
      importantAlerts?: boolean;
      promotional?: boolean;
      frequency?: 'immediate' | 'daily' | 'weekly';
    };
    smsNotifications?: {
      enabled?: boolean;
      urgentOnly?: boolean;
      phoneNumber?: string;
    };
    inAppNotifications?: {
      enabled?: boolean;
      showBadges?: boolean;
      autoMarkRead?: boolean;
      retentionDays?: number;
    };
  }): Promise<void> {
    try {
      await apiService.patch('/notifications/settings', { settings });
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  }

  // Verify phone number for SMS notifications
  async verifyPhoneNumber(phoneNumber: string): Promise<{
    verificationId: string;
    message: string;
  }> {
    try {
      const response = await apiService.post('/notifications/verify-phone', { phoneNumber });
      return response;
    } catch (error) {
      console.error('Verify phone number error:', error);
      throw error;
    }
  }

  // Confirm phone number verification
  async confirmPhoneVerification(verificationId: string, code: string): Promise<{
    verified: boolean;
    phoneNumber: string;
  }> {
    try {
      const response = await apiService.post('/notifications/confirm-phone', { verificationId, code });
      return response;
    } catch (error) {
      console.error('Confirm phone verification error:', error);
      throw error;
    }
  }

  // Schedule notification
  async scheduleNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledFor: string;
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      endDate?: string;
      count?: number;
    };
    actionUrl?: string;
    actionText?: string;
    data?: Record<string, any>;
    channels?: ('push' | 'email' | 'sms' | 'in_app')[];
  }): Promise<{
    scheduledNotification: {
      id: string;
      scheduledFor: string;
      status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
    };
  }> {
    try {
      const response = await apiService.post('/notifications/schedule', notificationData);
      return response;
    } catch (error) {
      console.error('Schedule notification error:', error);
      throw error;
    }
  }

  // Get scheduled notifications
  async getScheduledNotifications(params?: {
    status?: 'scheduled' | 'sent' | 'failed' | 'cancelled';
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    scheduledNotifications: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      scheduledFor: string;
      status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
      recurring?: {
        frequency: string;
        nextScheduled?: string;
        endDate?: string;
        remainingCount?: number;
      };
      createdAt: string;
    }>;
  }> {
    try {
      const response = await apiService.get('/notifications/scheduled', { params });
      return response;
    } catch (error) {
      console.error('Get scheduled notifications error:', error);
      throw error;
    }
  }

  // Cancel scheduled notification
  async cancelScheduledNotification(scheduledNotificationId: string): Promise<void> {
    try {
      await apiService.delete(`/notifications/scheduled/${scheduledNotificationId}`);
    } catch (error) {
      console.error('Cancel scheduled notification error:', error);
      throw error;
    }
  }

  // Update scheduled notification
  async updateScheduledNotification(scheduledNotificationId: string, updates: {
    title?: string;
    message?: string;
    scheduledFor?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    actionUrl?: string;
    actionText?: string;
    channels?: ('push' | 'email' | 'sms' | 'in_app')[];
  }): Promise<void> {
    try {
      await apiService.patch(`/notifications/scheduled/${scheduledNotificationId}`, updates);
    } catch (error) {
      console.error('Update scheduled notification error:', error);
      throw error;
    }
  }

  // Get notification templates
  async getNotificationTemplates(type?: string): Promise<{
    templates: Array<{
      id: string;
      name: string;
      type: string;
      title: string;
      message: string;
      priority: string;
      variables: string[];
      description: string;
      category: string;
    }>;
  }> {
    try {
      const response = await apiService.get('/notifications/templates', { params: { type } });
      return response;
    } catch (error) {
      console.error('Get notification templates error:', error);
      throw error;
    }
  }

  // Create notification from template
  async createFromTemplate(templateId: string, variables: Record<string, any>, options?: {
    scheduledFor?: string;
    channels?: ('push' | 'email' | 'sms' | 'in_app')[];
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<Notification> {
    try {
      const response = await apiService.post<{ notification: Notification }>(`/notifications/templates/${templateId}/create`, {
        variables,
        ...options,
      });
      return response.notification;
    } catch (error) {
      console.error('Create from template error:', error);
      throw error;
    }
  }

  // Get notification analytics
  async getNotificationAnalytics(params?: {
    period?: 'week' | 'month' | 'quarter' | 'year';
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<{
    analytics: {
      totalSent: number;
      totalRead: number;
      totalClicked: number;
      readRate: number;
      clickRate: number;
      byType: Record<string, {
        sent: number;
        read: number;
        clicked: number;
        readRate: number;
        clickRate: number;
      }>;
      byChannel: Record<string, {
        sent: number;
        delivered: number;
        read: number;
        clicked: number;
        deliveryRate: number;
        readRate: number;
        clickRate: number;
      }>;
      trends: Array<{
        date: string;
        sent: number;
        read: number;
        clicked: number;
      }>;
    };
    insights: string[];
  }> {
    try {
      const response = await apiService.get('/notifications/analytics', { params });
      return response;
    } catch (error) {
      console.error('Get notification analytics error:', error);
      throw error;
    }
  }

  // Register device for push notifications
  async registerDevice(deviceData: {
    deviceToken: string;
    platform: 'ios' | 'android' | 'web';
    deviceId: string;
    appVersion: string;
    osVersion: string;
  }): Promise<{
    registered: boolean;
    deviceId: string;
  }> {
    try {
      const response = await apiService.post('/notifications/register-device', deviceData);
      return response;
    } catch (error) {
      console.error('Register device error:', error);
      throw error;
    }
  }

  // Unregister device
  async unregisterDevice(deviceId: string): Promise<void> {
    try {
      await apiService.delete(`/notifications/devices/${deviceId}`);
    } catch (error) {
      console.error('Unregister device error:', error);
      throw error;
    }
  }

  // Test notification
  async testNotification(testData: {
    type: 'push' | 'email' | 'sms';
    title: string;
    message: string;
    recipient?: string; // email or phone number for email/sms
  }): Promise<{
    sent: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const response = await apiService.post('/notifications/test', testData);
      return response;
    } catch (error) {
      console.error('Test notification error:', error);
      throw error;
    }
  }

  // Get notification delivery status
  async getDeliveryStatus(notificationId: string): Promise<{
    status: {
      push?: {
        sent: boolean;
        delivered: boolean;
        read: boolean;
        error?: string;
      };
      email?: {
        sent: boolean;
        delivered: boolean;
        opened: boolean;
        clicked: boolean;
        bounced: boolean;
        error?: string;
      };
      sms?: {
        sent: boolean;
        delivered: boolean;
        error?: string;
      };
      inApp?: {
        created: boolean;
        read: boolean;
        clicked: boolean;
      };
    };
    timeline: Array<{
      timestamp: string;
      event: string;
      channel: string;
      details?: string;
    }>;
  }> {
    try {
      const response = await apiService.get(`/notifications/${notificationId}/delivery-status`);
      return response;
    } catch (error) {
      console.error('Get delivery status error:', error);
      throw error;
    }
  }

  // Snooze notification
  async snoozeNotification(notificationId: string, snoozeUntil: string): Promise<void> {
    try {
      await apiService.patch(`/notifications/${notificationId}/snooze`, { snoozeUntil });
    } catch (error) {
      console.error('Snooze notification error:', error);
      throw error;
    }
  }

  // Unsnooze notification
  async unsnoozeNotification(notificationId: string): Promise<void> {
    try {
      await apiService.patch(`/notifications/${notificationId}/unsnooze`);
    } catch (error) {
      console.error('Unsnooze notification error:', error);
      throw error;
    }
  }

  // Get snoozed notifications
  async getSnoozedNotifications(): Promise<{
    notifications: Array<Notification & {
      snoozedUntil: string;
    }>;
  }> {
    try {
      const response = await apiService.get('/notifications/snoozed');
      return response;
    } catch (error) {
      console.error('Get snoozed notifications error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const notificationsService = new NotificationsService();
export default notificationsService;