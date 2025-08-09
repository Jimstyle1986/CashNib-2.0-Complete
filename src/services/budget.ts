import { apiService } from './api';
import { Budget, BudgetCategories } from '../types';

class BudgetService {
  // Get all budgets for the current user
  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await apiService.get<{ budgets: Budget[] }>('/budgets');
      return response.budgets;
    } catch (error) {
      console.error('Get budgets error:', error);
      throw error;
    }
  }

  // Get a specific budget by ID
  async getBudgetById(budgetId: string): Promise<Budget> {
    try {
      const response = await apiService.get<{ budget: Budget }>(`/budgets/${budgetId}`);
      return response.budget;
    } catch (error) {
      console.error('Get budget by ID error:', error);
      throw error;
    }
  }

  // Create a new budget
  async createBudget(budgetData: {
    name: string;
    totalAmount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    categories: BudgetCategories;
    description?: string;
    currency?: string;
  }): Promise<Budget> {
    try {
      const response = await apiService.post<{ budget: Budget }>('/budgets', budgetData);
      return response.budget;
    } catch (error) {
      console.error('Create budget error:', error);
      throw error;
    }
  }

  // Update an existing budget
  async updateBudget(budgetId: string, updates: Partial<Budget>): Promise<Budget> {
    try {
      const response = await apiService.patch<{ budget: Budget }>(`/budgets/${budgetId}`, updates);
      return response.budget;
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  }

  // Delete a budget
  async deleteBudget(budgetId: string): Promise<void> {
    try {
      await apiService.delete(`/budgets/${budgetId}`);
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error;
    }
  }

  // Get budget analytics
  async getBudgetAnalytics(budgetId: string, period?: string): Promise<{
    totalSpent: number;
    totalBudget: number;
    remainingBudget: number;
    spentPercentage: number;
    categoryBreakdown: Array<{
      category: string;
      budgeted: number;
      spent: number;
      remaining: number;
      percentage: number;
    }>;
    dailySpending: Array<{
      date: string;
      amount: number;
    }>;
    trends: {
      weekOverWeek?: number;
      monthOverMonth?: number;
      yearOverYear?: number;
    };
    projectedSpending: number;
    alerts: Array<{
      type: 'warning' | 'danger';
      category: string;
      message: string;
    }>;
  }> {
    try {
      const params = period ? { period } : {};
      const response = await apiService.get(`/budgets/${budgetId}/analytics`, { params });
      return response;
    } catch (error) {
      console.error('Get budget analytics error:', error);
      throw error;
    }
  }

  // Compare multiple budgets
  async compareBudgets(budgetIds: string[]): Promise<{
    budgets: Array<{
      id: string;
      name: string;
      totalAmount: number;
      totalSpent: number;
      efficiency: number;
    }>;
    insights: string[];
  }> {
    try {
      const response = await apiService.post('/budgets/compare', { budgetIds });
      return response;
    } catch (error) {
      console.error('Compare budgets error:', error);
      throw error;
    }
  }

  // Get budget recommendations
  async getBudgetRecommendations(): Promise<{
    recommendations: Array<{
      type: 'increase' | 'decrease' | 'reallocate';
      category: string;
      currentAmount: number;
      suggestedAmount: number;
      reason: string;
      impact: string;
    }>;
    insights: string[];
  }> {
    try {
      const response = await apiService.get('/budgets/recommendations');
      return response;
    } catch (error) {
      console.error('Get budget recommendations error:', error);
      throw error;
    }
  }

  // Optimize budget using AI
  async optimizeBudget(budgetId: string, preferences?: {
    priorityCategories?: string[];
    riskTolerance?: 'low' | 'medium' | 'high';
    savingsGoal?: number;
  }): Promise<{
    optimizedBudget: Budget;
    changes: Array<{
      category: string;
      oldAmount: number;
      newAmount: number;
      change: number;
      reason: string;
    }>;
    projectedSavings: number;
    confidence: number;
  }> {
    try {
      const response = await apiService.post(`/budgets/${budgetId}/optimize`, preferences);
      return response;
    } catch (error) {
      console.error('Optimize budget error:', error);
      throw error;
    }
  }

  // Copy budget with adjustments
  async copyBudget(budgetId: string, newName: string, adjustments?: {
    totalAmount?: number;
    period?: 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    categoryAdjustments?: Record<string, number>;
  }): Promise<Budget> {
    try {
      const response = await apiService.post(`/budgets/${budgetId}/copy`, {
        newName,
        ...adjustments,
      });
      return response.budget;
    } catch (error) {
      console.error('Copy budget error:', error);
      throw error;
    }
  }

  // Get budget templates
  async getBudgetTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    categories: BudgetCategories;
    targetIncome: number;
    popularity: number;
    tags: string[];
  }>> {
    try {
      const response = await apiService.get<{ templates: any[] }>('/budgets/templates');
      return response.templates;
    } catch (error) {
      console.error('Get budget templates error:', error);
      throw error;
    }
  }

  // Create budget from template
  async createBudgetFromTemplate(templateId: string, customizations: {
    name: string;
    totalAmount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    categoryAdjustments?: Record<string, number>;
  }): Promise<Budget> {
    try {
      const response = await apiService.post(`/budgets/templates/${templateId}/create`, customizations);
      return response.budget;
    } catch (error) {
      console.error('Create budget from template error:', error);
      throw error;
    }
  }

  // Get budget alerts
  async getBudgetAlerts(budgetId?: string): Promise<Array<{
    id: string;
    budgetId: string;
    budgetName: string;
    type: 'overspend' | 'approaching_limit' | 'goal_achieved';
    category?: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    createdAt: string;
    acknowledged: boolean;
  }>> {
    try {
      const params = budgetId ? { budgetId } : {};
      const response = await apiService.get('/budgets/alerts', { params });
      return response.alerts;
    } catch (error) {
      console.error('Get budget alerts error:', error);
      throw error;
    }
  }

  // Acknowledge a budget alert
  async acknowledgeBudgetAlert(alertId: string): Promise<void> {
    try {
      await apiService.patch(`/budgets/alerts/${alertId}/acknowledge`);
    } catch (error) {
      console.error('Acknowledge budget alert error:', error);
      throw error;
    }
  }

  // Set budget alert preferences
  async setBudgetAlertPreferences(preferences: {
    overspendThreshold: number; // percentage
    approachingLimitThreshold: number; // percentage
    enableEmailAlerts: boolean;
    enablePushAlerts: boolean;
    alertFrequency: 'immediate' | 'daily' | 'weekly';
    categories: string[];
  }): Promise<void> {
    try {
      await apiService.post('/budgets/alert-preferences', preferences);
    } catch (error) {
      console.error('Set budget alert preferences error:', error);
      throw error;
    }
  }

  // Get budget alert preferences
  async getBudgetAlertPreferences(): Promise<{
    overspendThreshold: number;
    approachingLimitThreshold: number;
    enableEmailAlerts: boolean;
    enablePushAlerts: boolean;
    alertFrequency: 'immediate' | 'daily' | 'weekly';
    categories: string[];
  }> {
    try {
      const response = await apiService.get('/budgets/alert-preferences');
      return response;
    } catch (error) {
      console.error('Get budget alert preferences error:', error);
      throw error;
    }
  }

  // Export budget data
  async exportBudget(budgetId: string, format: 'csv' | 'pdf' | 'excel'): Promise<Blob> {
    try {
      const response = await apiService.get(`/budgets/${budgetId}/export`, {
        params: { format },
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Export budget error:', error);
      throw error;
    }
  }

  // Import budget from file
  async importBudget(file: any): Promise<{
    budget: Budget;
    warnings: string[];
    errors: string[];
  }> {
    try {
      const response = await apiService.upload('/budgets/import', file);
      return response;
    } catch (error) {
      console.error('Import budget error:', error);
      throw error;
    }
  }

  // Get budget history/audit log
  async getBudgetHistory(budgetId: string, limit?: number): Promise<Array<{
    id: string;
    action: 'created' | 'updated' | 'deleted' | 'category_added' | 'category_removed' | 'amount_changed';
    details: Record<string, any>;
    timestamp: string;
    user: string;
  }>> {
    try {
      const params = limit ? { limit } : {};
      const response = await apiService.get(`/budgets/${budgetId}/history`, { params });
      return response.history;
    } catch (error) {
      console.error('Get budget history error:', error);
      throw error;
    }
  }

  // Share budget with others
  async shareBudget(budgetId: string, shareWith: {
    email?: string;
    userId?: string;
    permissions: 'view' | 'edit';
    expiresAt?: string;
  }): Promise<{
    shareId: string;
    shareUrl: string;
    expiresAt: string;
  }> {
    try {
      const response = await apiService.post(`/budgets/${budgetId}/share`, shareWith);
      return response;
    } catch (error) {
      console.error('Share budget error:', error);
      throw error;
    }
  }

  // Get shared budgets
  async getSharedBudgets(): Promise<Array<{
    budget: Budget;
    sharedBy: string;
    permissions: 'view' | 'edit';
    sharedAt: string;
  }>> {
    try {
      const response = await apiService.get('/budgets/shared');
      return response.sharedBudgets;
    } catch (error) {
      console.error('Get shared budgets error:', error);
      throw error;
    }
  }

  // Revoke budget share
  async revokeBudgetShare(budgetId: string, shareId: string): Promise<void> {
    try {
      await apiService.delete(`/budgets/${budgetId}/share/${shareId}`);
    } catch (error) {
      console.error('Revoke budget share error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const budgetService = new BudgetService();
export default budgetService;