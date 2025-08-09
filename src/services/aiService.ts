import { apiService } from './api';
import { Transaction, Goal, Investment, Budget } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIInsight {
  id: string;
  type: 'spending' | 'saving' | 'investment' | 'budget';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface SpendingAnalysis {
  totalSpent: number;
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
  trends: { period: string; amount: number }[];
  insights: string[];
  recommendations: string[];
}

export interface FinancialAdvice {
  category: 'budgeting' | 'saving' | 'investing' | 'debt';
  advice: string;
  actionItems: string[];
  estimatedImpact: string;
}

class AIService {
  private chatHistory: ChatMessage[] = [];

  // Chat with AI Assistant
  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      this.chatHistory.push(userMessage);

      const response = await apiService.post('/ai/chat', {
        message,
        history: this.chatHistory.slice(-10) // Send last 10 messages for context
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      };

      this.chatHistory.push(assistantMessage);
      return assistantMessage;
    } catch (error) {
      console.error('AI chat error:', error);
      // Fallback response for demo purposes
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m currently experiencing technical difficulties. Please try again later.',
        timestamp: new Date()
      };
      this.chatHistory.push(fallbackMessage);
      return fallbackMessage;
    }
  }

  // Get chat history
  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  // Clear chat history
  clearChatHistory(): void {
    this.chatHistory = [];
  }

  // Analyze spending patterns
  async analyzeSpending(transactions: Transaction[]): Promise<SpendingAnalysis> {
    try {
      const response = await apiService.post('/ai/analyze-spending', {
        transactions
      });
      return response.data;
    } catch (error) {
      console.error('Spending analysis error:', error);
      // Fallback analysis for demo purposes
      const totalSpent = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const categoryMap = new Map<string, number>();
      
      transactions.forEach(t => {
        if (t.amount < 0) { // Only count expenses
          const current = categoryMap.get(t.category) || 0;
          categoryMap.set(t.category, current + Math.abs(t.amount));
        }
      });

      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100
      }));

      return {
        totalSpent,
        categoryBreakdown,
        trends: [],
        insights: ['Your spending patterns show room for optimization'],
        recommendations: ['Consider setting up a budget for your top spending categories']
      };
    }
  }

  // Get AI insights
  async getInsights(): Promise<AIInsight[]> {
    try {
      const response = await apiService.get('/ai/insights');
      return response.data;
    } catch (error) {
      console.error('AI insights error:', error);
      // Fallback insights for demo purposes
      return [
        {
          id: '1',
          type: 'spending',
          title: 'High Dining Expenses',
          description: 'Your dining expenses have increased by 25% this month',
          actionable: true,
          priority: 'medium',
          createdAt: new Date()
        },
        {
          id: '2',
          type: 'saving',
          title: 'Emergency Fund Goal',
          description: 'Consider increasing your emergency fund to 6 months of expenses',
          actionable: true,
          priority: 'high',
          createdAt: new Date()
        }
      ];
    }
  }

  // Get financial advice
  async getFinancialAdvice(category: string): Promise<FinancialAdvice> {
    try {
      const response = await apiService.post('/ai/advice', { category });
      return response.data;
    } catch (error) {
      console.error('Financial advice error:', error);
      // Fallback advice for demo purposes
      return {
        category: category as any,
        advice: 'Focus on creating a balanced approach to your finances',
        actionItems: [
          'Review your monthly expenses',
          'Set up automatic savings',
          'Track your progress regularly'
        ],
        estimatedImpact: 'Could save you 10-15% on monthly expenses'
      };
    }
  }

  // Generate budget recommendations
  async generateBudgetRecommendations(income: number, expenses: Transaction[]): Promise<Budget> {
    try {
      const response = await apiService.post('/ai/budget-recommendations', {
        income,
        expenses
      });
      return response.data;
    } catch (error) {
      console.error('Budget recommendations error:', error);
      throw error;
    }
  }

  // Analyze investment portfolio
  async analyzePortfolio(investments: Investment[]): Promise<any> {
    try {
      const response = await apiService.post('/ai/analyze-portfolio', {
        investments
      });
      return response.data;
    } catch (error) {
      console.error('Portfolio analysis error:', error);
      throw error;
    }
  }

  // Get goal recommendations
  async getGoalRecommendations(currentGoals: Goal[], financialProfile: any): Promise<Goal[]> {
    try {
      const response = await apiService.post('/ai/goal-recommendations', {
        currentGoals,
        financialProfile
      });
      return response.data;
    } catch (error) {
      console.error('Goal recommendations error:', error);
      throw error;
    }
  }

  // Predict future expenses
  async predictExpenses(historicalData: Transaction[]): Promise<any> {
    try {
      const response = await apiService.post('/ai/predict-expenses', {
        historicalData
      });
      return response.data;
    } catch (error) {
      console.error('Expense prediction error:', error);
      throw error;
    }
  }

  // Get personalized tips
  async getPersonalizedTips(userProfile: any): Promise<string[]> {
    try {
      const response = await apiService.post('/ai/personalized-tips', {
        userProfile
      });
      return response.data.tips;
    } catch (error) {
      console.error('Personalized tips error:', error);
      // Fallback tips
      return [
        'Review your subscriptions monthly to avoid unnecessary charges',
        'Set up automatic transfers to your savings account',
        'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings'
      ];
    }
  }
}

export const aiService = new AIService();
export default aiService;