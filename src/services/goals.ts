import { apiService } from './api';
import { FinancialGoal } from '../types';

class GoalsService {
  // Get all financial goals
  async getGoals(params?: {
    status?: 'active' | 'completed' | 'paused' | 'cancelled';
    type?: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund' | 'custom';
    sortBy?: 'created_date' | 'target_date' | 'progress' | 'target_amount';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    goals: FinancialGoal[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    summary: {
      totalGoals: number;
      activeGoals: number;
      completedGoals: number;
      totalTargetAmount: number;
      totalCurrentAmount: number;
      overallProgress: number;
    };
  }> {
    try {
      const response = await apiService.get('/goals', { params });
      return response;
    } catch (error) {
      console.error('Get goals error:', error);
      throw error;
    }
  }

  // Get a specific goal by ID
  async getGoalById(goalId: string): Promise<FinancialGoal> {
    try {
      const response = await apiService.get<{ goal: FinancialGoal }>(`/goals/${goalId}`);
      return response.goal;
    } catch (error) {
      console.error('Get goal by ID error:', error);
      throw error;
    }
  }

  // Create a new financial goal
  async createGoal(goalData: {
    name: string;
    description?: string;
    type: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund' | 'custom';
    targetAmount: number;
    currentAmount?: number;
    targetDate: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    autoContribute?: {
      enabled: boolean;
      amount: number;
      frequency: 'daily' | 'weekly' | 'monthly';
      sourceAccount?: string;
    };
    milestones?: Array<{
      name: string;
      amount: number;
      reward?: string;
    }>;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<FinancialGoal> {
    try {
      const response = await apiService.post<{ goal: FinancialGoal }>('/goals', goalData);
      return response.goal;
    } catch (error) {
      console.error('Create goal error:', error);
      throw error;
    }
  }

  // Update an existing goal
  async updateGoal(goalId: string, updates: Partial<FinancialGoal>): Promise<FinancialGoal> {
    try {
      const response = await apiService.patch<{ goal: FinancialGoal }>(`/goals/${goalId}`, updates);
      return response.goal;
    } catch (error) {
      console.error('Update goal error:', error);
      throw error;
    }
  }

  // Delete a goal
  async deleteGoal(goalId: string): Promise<void> {
    try {
      await apiService.delete(`/goals/${goalId}`);
    } catch (error) {
      console.error('Delete goal error:', error);
      throw error;
    }
  }

  // Add contribution to a goal
  async addContribution(goalId: string, contributionData: {
    amount: number;
    description?: string;
    date?: string;
    source?: 'manual' | 'automatic' | 'transfer';
    sourceAccount?: string;
  }): Promise<{
    contribution: {
      id: string;
      amount: number;
      date: string;
      description?: string;
      source: string;
    };
    updatedGoal: FinancialGoal;
    milestoneReached?: {
      name: string;
      amount: number;
      reward?: string;
    };
  }> {
    try {
      const response = await apiService.post(`/goals/${goalId}/contributions`, contributionData);
      return response;
    } catch (error) {
      console.error('Add contribution error:', error);
      throw error;
    }
  }

  // Remove/Withdraw from a goal
  async removeContribution(goalId: string, withdrawalData: {
    amount: number;
    reason: string;
    date?: string;
  }): Promise<{
    withdrawal: {
      id: string;
      amount: number;
      date: string;
      reason: string;
    };
    updatedGoal: FinancialGoal;
  }> {
    try {
      const response = await apiService.post(`/goals/${goalId}/withdrawals`, withdrawalData);
      return response;
    } catch (error) {
      console.error('Remove contribution error:', error);
      throw error;
    }
  }

  // Get goal contributions history
  async getContributions(goalId: string, params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: 'contribution' | 'withdrawal';
  }): Promise<{
    transactions: Array<{
      id: string;
      type: 'contribution' | 'withdrawal';
      amount: number;
      date: string;
      description?: string;
      source?: string;
      reason?: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary: {
      totalContributions: number;
      totalWithdrawals: number;
      netAmount: number;
      averageContribution: number;
    };
  }> {
    try {
      const response = await apiService.get(`/goals/${goalId}/contributions`, { params });
      return response;
    } catch (error) {
      console.error('Get contributions error:', error);
      throw error;
    }
  }

  // Pause a goal
  async pauseGoal(goalId: string, reason?: string): Promise<FinancialGoal> {
    try {
      const response = await apiService.post<{ goal: FinancialGoal }>(`/goals/${goalId}/pause`, { reason });
      return response.goal;
    } catch (error) {
      console.error('Pause goal error:', error);
      throw error;
    }
  }

  // Resume a paused goal
  async resumeGoal(goalId: string): Promise<FinancialGoal> {
    try {
      const response = await apiService.post<{ goal: FinancialGoal }>(`/goals/${goalId}/resume`);
      return response.goal;
    } catch (error) {
      console.error('Resume goal error:', error);
      throw error;
    }
  }

  // Mark goal as completed
  async completeGoal(goalId: string, completionData?: {
    actualAmount?: number;
    completionDate?: string;
    notes?: string;
    celebrationMessage?: string;
  }): Promise<FinancialGoal> {
    try {
      const response = await apiService.post<{ goal: FinancialGoal }>(`/goals/${goalId}/complete`, completionData);
      return response.goal;
    } catch (error) {
      console.error('Complete goal error:', error);
      throw error;
    }
  }

  // Generate savings plan for a goal
  async generateSavingsPlan(goalId: string, preferences?: {
    monthlyBudget?: number;
    riskTolerance?: 'low' | 'medium' | 'high';
    preferredFrequency?: 'weekly' | 'monthly';
    includeInvestments?: boolean;
    considerInflation?: boolean;
  }): Promise<{
    plan: {
      recommendedMonthlyAmount: number;
      recommendedFrequency: 'weekly' | 'monthly';
      estimatedCompletionDate: string;
      totalMonths: number;
      strategies: Array<{
        name: string;
        description: string;
        monthlyAmount: number;
        expectedReturn?: number;
        riskLevel: 'low' | 'medium' | 'high';
      }>;
    };
    milestones: Array<{
      month: number;
      targetAmount: number;
      description: string;
    }>;
    tips: string[];
    warnings?: string[];
  }> {
    try {
      const response = await apiService.post(`/goals/${goalId}/savings-plan`, preferences);
      return response;
    } catch (error) {
      console.error('Generate savings plan error:', error);
      throw error;
    }
  }

  // Get goal analytics and insights
  async getGoalAnalytics(goalId: string, period?: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    progress: {
      currentAmount: number;
      targetAmount: number;
      progressPercentage: number;
      remainingAmount: number;
      daysRemaining: number;
      onTrack: boolean;
    };
    trends: {
      averageMonthlyContribution: number;
      contributionGrowth: number;
      projectedCompletionDate: string;
      velocityScore: number;
    };
    milestones: {
      reached: number;
      total: number;
      next?: {
        name: string;
        amount: number;
        remainingAmount: number;
      };
    };
    insights: string[];
    recommendations: Array<{
      type: 'increase_contribution' | 'adjust_timeline' | 'change_strategy';
      title: string;
      description: string;
      impact: string;
      priority: 'low' | 'medium' | 'high';
    }>;
  }> {
    try {
      const response = await apiService.get(`/goals/${goalId}/analytics`, { params: { period } });
      return response;
    } catch (error) {
      console.error('Get goal analytics error:', error);
      throw error;
    }
  }

  // Get goal recommendations based on user profile
  async getGoalRecommendations(params?: {
    income?: number;
    expenses?: number;
    riskTolerance?: 'low' | 'medium' | 'high';
    timeHorizon?: 'short' | 'medium' | 'long';
    currentGoals?: string[];
  }): Promise<{
    recommendations: Array<{
      type: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund';
      title: string;
      description: string;
      suggestedAmount: number;
      suggestedTimeline: number; // months
      priority: 'low' | 'medium' | 'high';
      reasoning: string;
      benefits: string[];
      steps: string[];
    }>;
    insights: string[];
  }> {
    try {
      const response = await apiService.post('/goals/recommendations', params);
      return response;
    } catch (error) {
      console.error('Get goal recommendations error:', error);
      throw error;
    }
  }

  // Setup automatic contributions
  async setupAutoContribution(goalId: string, autoContributionData: {
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    sourceAccount: string;
    startDate?: string;
    endDate?: string;
    conditions?: {
      minAccountBalance?: number;
      maxMonthlyAmount?: number;
      pauseOnGoalCompletion?: boolean;
    };
  }): Promise<{
    autoContribution: {
      id: string;
      amount: number;
      frequency: string;
      nextDate: string;
      isActive: boolean;
    };
    updatedGoal: FinancialGoal;
  }> {
    try {
      const response = await apiService.post(`/goals/${goalId}/auto-contribution`, autoContributionData);
      return response;
    } catch (error) {
      console.error('Setup auto contribution error:', error);
      throw error;
    }
  }

  // Update automatic contributions
  async updateAutoContribution(goalId: string, autoContributionId: string, updates: {
    amount?: number;
    frequency?: 'daily' | 'weekly' | 'monthly';
    sourceAccount?: string;
    isActive?: boolean;
    conditions?: any;
  }): Promise<void> {
    try {
      await apiService.patch(`/goals/${goalId}/auto-contribution/${autoContributionId}`, updates);
    } catch (error) {
      console.error('Update auto contribution error:', error);
      throw error;
    }
  }

  // Cancel automatic contributions
  async cancelAutoContribution(goalId: string, autoContributionId: string): Promise<void> {
    try {
      await apiService.delete(`/goals/${goalId}/auto-contribution/${autoContributionId}`);
    } catch (error) {
      console.error('Cancel auto contribution error:', error);
      throw error;
    }
  }

  // Share goal publicly or with specific users
  async shareGoal(goalId: string, shareData: {
    type: 'public' | 'private';
    users?: string[]; // user IDs for private sharing
    message?: string;
    allowContributions?: boolean;
    allowComments?: boolean;
  }): Promise<{
    shareId: string;
    shareUrl: string;
    expiresAt?: string;
  }> {
    try {
      const response = await apiService.post(`/goals/${goalId}/share`, shareData);
      return response;
    } catch (error) {
      console.error('Share goal error:', error);
      throw error;
    }
  }

  // Get shared goals (goals shared with current user)
  async getSharedGoals(): Promise<{
    goals: Array<FinancialGoal & {
      owner: {
        id: string;
        name: string;
        avatar?: string;
      };
      shareSettings: {
        allowContributions: boolean;
        allowComments: boolean;
      };
    }>;
  }> {
    try {
      const response = await apiService.get('/goals/shared');
      return response;
    } catch (error) {
      console.error('Get shared goals error:', error);
      throw error;
    }
  }

  // Contribute to someone else's shared goal
  async contributeToSharedGoal(shareId: string, contributionData: {
    amount: number;
    message?: string;
    anonymous?: boolean;
  }): Promise<{
    contribution: {
      id: string;
      amount: number;
      message?: string;
      contributor: string;
      date: string;
    };
  }> {
    try {
      const response = await apiService.post(`/goals/shared/${shareId}/contribute`, contributionData);
      return response;
    } catch (error) {
      console.error('Contribute to shared goal error:', error);
      throw error;
    }
  }

  // Get goal templates
  async getGoalTemplates(category?: string): Promise<{
    templates: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      type: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund';
      suggestedAmount?: number;
      suggestedTimeline?: number;
      milestones: Array<{
        name: string;
        percentage: number;
        reward?: string;
      }>;
      tips: string[];
      popularity: number;
    }>;
  }> {
    try {
      const response = await apiService.get('/goals/templates', { params: { category } });
      return response;
    } catch (error) {
      console.error('Get goal templates error:', error);
      throw error;
    }
  }

  // Create goal from template
  async createGoalFromTemplate(templateId: string, customizations: {
    name?: string;
    targetAmount?: number;
    targetDate?: string;
    customMilestones?: Array<{
      name: string;
      amount: number;
      reward?: string;
    }>;
  }): Promise<FinancialGoal> {
    try {
      const response = await apiService.post<{ goal: FinancialGoal }>(`/goals/templates/${templateId}/create`, customizations);
      return response.goal;
    } catch (error) {
      console.error('Create goal from template error:', error);
      throw error;
    }
  }

  // Export goals data
  async exportGoals(format: 'csv' | 'pdf' | 'excel', goalIds?: string[]): Promise<Blob> {
    try {
      const params = { format, goalIds: goalIds?.join(',') };
      const response = await apiService.downloadFile('/goals/export', { params });
      return response;
    } catch (error) {
      console.error('Export goals error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const goalsService = new GoalsService();
export default goalsService;