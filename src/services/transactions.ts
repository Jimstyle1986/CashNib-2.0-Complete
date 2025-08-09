import { apiService } from './api';
import { Transaction, TransactionCategory } from '../types';

class TransactionsService {
  // Get all transactions with optional filters
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: 'income' | 'expense';
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    sortBy?: 'date' | 'amount' | 'category';
    sortOrder?: 'asc' | 'desc';
    budgetId?: string;
  }): Promise<{
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    summary: {
      totalIncome: number;
      totalExpenses: number;
      netAmount: number;
      transactionCount: number;
    };
  }> {
    try {
      const response = await apiService.get('/transactions', { params });
      return response;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }

  // Get a specific transaction by ID
  async getTransactionById(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiService.get<{ transaction: Transaction }>(`/transactions/${transactionId}`);
      return response.transaction;
    } catch (error) {
      console.error('Get transaction by ID error:', error);
      throw error;
    }
  }

  // Create a new transaction
  async createTransaction(transactionData: {
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    date: string;
    budgetId?: string;
    tags?: string[];
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    receipt?: {
      url: string;
      filename: string;
    };
    notes?: string;
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      endDate?: string;
      count?: number;
    };
  }): Promise<Transaction> {
    try {
      const response = await apiService.post<{ transaction: Transaction }>('/transactions', transactionData);
      return response.transaction;
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  }

  // Update an existing transaction
  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await apiService.patch<{ transaction: Transaction }>(`/transactions/${transactionId}`, updates);
      return response.transaction;
    } catch (error) {
      console.error('Update transaction error:', error);
      throw error;
    }
  }

  // Delete a transaction
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await apiService.delete(`/transactions/${transactionId}`);
    } catch (error) {
      console.error('Delete transaction error:', error);
      throw error;
    }
  }

  // Delete multiple transactions
  async deleteTransactions(transactionIds: string[]): Promise<{
    deleted: number;
    failed: string[];
  }> {
    try {
      const response = await apiService.post('/transactions/bulk-delete', { transactionIds });
      return response;
    } catch (error) {
      console.error('Bulk delete transactions error:', error);
      throw error;
    }
  }

  // Auto-categorize a transaction using AI
  async categorizeTransaction(transactionId: string): Promise<{
    suggestedCategory: string;
    confidence: number;
    alternativeCategories: Array<{
      category: string;
      confidence: number;
    }>;
  }> {
    try {
      const response = await apiService.post(`/transactions/${transactionId}/categorize`);
      return response;
    } catch (error) {
      console.error('Categorize transaction error:', error);
      throw error;
    }
  }

  // Bulk categorize multiple transactions
  async bulkCategorizeTransactions(transactionIds: string[]): Promise<{
    categorized: Array<{
      transactionId: string;
      category: string;
      confidence: number;
    }>;
    failed: string[];
  }> {
    try {
      const response = await apiService.post('/transactions/bulk-categorize', { transactionIds });
      return response;
    } catch (error) {
      console.error('Bulk categorize transactions error:', error);
      throw error;
    }
  }

  // Auto-categorize all uncategorized transactions
  async autoCategorizeAll(): Promise<{
    categorized: number;
    failed: number;
    results: Array<{
      transactionId: string;
      category: string;
      confidence: number;
    }>;
  }> {
    try {
      const response = await apiService.post('/transactions/auto-categorize-all');
      return response;
    } catch (error) {
      console.error('Auto categorize all error:', error);
      throw error;
    }
  }

  // Get transaction categories
  async getCategories(): Promise<TransactionCategory[]> {
    try {
      const response = await apiService.get<{ categories: TransactionCategory[] }>('/transactions/categories');
      return response.categories;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // Create a new category
  async createCategory(categoryData: {
    name: string;
    type: 'income' | 'expense';
    color?: string;
    icon?: string;
    parent?: string;
    description?: string;
  }): Promise<TransactionCategory> {
    try {
      const response = await apiService.post<{ category: TransactionCategory }>('/transactions/categories', categoryData);
      return response.category;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }

  // Update a category
  async updateCategory(categoryId: string, updates: Partial<TransactionCategory>): Promise<TransactionCategory> {
    try {
      const response = await apiService.patch<{ category: TransactionCategory }>(`/transactions/categories/${categoryId}`, updates);
      return response.category;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  // Delete a category
  async deleteCategory(categoryId: string, moveToCategory?: string): Promise<void> {
    try {
      const params = moveToCategory ? { moveToCategory } : {};
      await apiService.delete(`/transactions/categories/${categoryId}`, { params });
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }

  // Get transaction analytics
  async getAnalytics(params?: {
    period?: 'week' | 'month' | 'quarter' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month' | 'category';
    categories?: string[];
  }): Promise<{
    summary: {
      totalIncome: number;
      totalExpenses: number;
      netAmount: number;
      transactionCount: number;
      averageTransaction: number;
      largestExpense: number;
      largestIncome: number;
    };
    trends: {
      incomeGrowth: number;
      expenseGrowth: number;
      netGrowth: number;
    };
    categoryBreakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
      transactionCount: number;
      averageAmount: number;
    }>;
    timeSeriesData: Array<{
      date: string;
      income: number;
      expenses: number;
      net: number;
    }>;
    insights: string[];
  }> {
    try {
      const response = await apiService.get('/transactions/analytics', { params });
      return response;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  // Detect anomalies in transactions
  async detectAnomalies(params?: {
    sensitivity?: 'low' | 'medium' | 'high';
    period?: number; // days to analyze
    categories?: string[];
  }): Promise<{
    anomalies: Array<{
      transactionId: string;
      transaction: Transaction;
      anomalyType: 'unusual_amount' | 'unusual_category' | 'unusual_frequency' | 'unusual_location';
      severity: 'low' | 'medium' | 'high';
      description: string;
      confidence: number;
    }>;
    summary: {
      totalAnomalies: number;
      highSeverity: number;
      mediumSeverity: number;
      lowSeverity: number;
    };
  }> {
    try {
      const response = await apiService.get('/transactions/anomalies', { params });
      return response;
    } catch (error) {
      console.error('Detect anomalies error:', error);
      throw error;
    }
  }

  // Mark an anomaly as reviewed
  async markAnomalyReviewed(transactionId: string, isLegitimate: boolean): Promise<void> {
    try {
      await apiService.post(`/transactions/${transactionId}/anomaly-review`, { isLegitimate });
    } catch (error) {
      console.error('Mark anomaly reviewed error:', error);
      throw error;
    }
  }

  // Export transactions
  async exportTransactions(params: {
    format: 'csv' | 'pdf' | 'excel';
    startDate?: string;
    endDate?: string;
    categories?: string[];
    includeReceipts?: boolean;
  }): Promise<Blob> {
    try {
      const response = await apiService.get('/transactions/export', {
        params,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Export transactions error:', error);
      throw error;
    }
  }

  // Import transactions from file
  async importTransactions(file: any, options?: {
    format: 'csv' | 'ofx' | 'qif';
    bankName?: string;
    accountType?: string;
    autoCategorize?: boolean;
    skipDuplicates?: boolean;
  }): Promise<{
    imported: number;
    skipped: number;
    errors: Array<{
      row: number;
      error: string;
    }>;
    transactions: Transaction[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
      }
      
      const response = await apiService.post('/transactions/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Import transactions error:', error);
      throw error;
    }
  }

  // Upload receipt for a transaction
  async uploadReceipt(transactionId: string, file: any): Promise<{
    url: string;
    filename: string;
    extractedData?: {
      amount?: number;
      merchant?: string;
      date?: string;
      items?: Array<{
        name: string;
        price: number;
        quantity?: number;
      }>;
    };
  }> {
    try {
      const response = await apiService.upload(`/transactions/${transactionId}/receipt`, file);
      return response;
    } catch (error) {
      console.error('Upload receipt error:', error);
      throw error;
    }
  }

  // Delete receipt from a transaction
  async deleteReceipt(transactionId: string): Promise<void> {
    try {
      await apiService.delete(`/transactions/${transactionId}/receipt`);
    } catch (error) {
      console.error('Delete receipt error:', error);
      throw error;
    }
  }

  // Get recurring transactions
  async getRecurringTransactions(): Promise<Array<{
    id: string;
    template: Omit<Transaction, 'id' | 'date'>;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDate: string;
    endDate?: string;
    remainingCount?: number;
    isActive: boolean;
    createdTransactions: number;
  }>> {
    try {
      const response = await apiService.get<{ recurringTransactions: any[] }>('/transactions/recurring');
      return response.recurringTransactions;
    } catch (error) {
      console.error('Get recurring transactions error:', error);
      throw error;
    }
  }

  // Create a recurring transaction
  async createRecurringTransaction(data: {
    template: Omit<Transaction, 'id' | 'date'>;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate?: string;
    count?: number;
  }): Promise<{
    id: string;
    nextDate: string;
  }> {
    try {
      const response = await apiService.post('/transactions/recurring', data);
      return response;
    } catch (error) {
      console.error('Create recurring transaction error:', error);
      throw error;
    }
  }

  // Update a recurring transaction
  async updateRecurringTransaction(recurringId: string, updates: any): Promise<void> {
    try {
      await apiService.patch(`/transactions/recurring/${recurringId}`, updates);
    } catch (error) {
      console.error('Update recurring transaction error:', error);
      throw error;
    }
  }

  // Delete a recurring transaction
  async deleteRecurringTransaction(recurringId: string): Promise<void> {
    try {
      await apiService.delete(`/transactions/recurring/${recurringId}`);
    } catch (error) {
      console.error('Delete recurring transaction error:', error);
      throw error;
    }
  }

  // Toggle recurring transaction active status
  async toggleRecurringTransaction(recurringId: string, isActive: boolean): Promise<void> {
    try {
      await apiService.patch(`/transactions/recurring/${recurringId}/toggle`, { isActive });
    } catch (error) {
      console.error('Toggle recurring transaction error:', error);
      throw error;
    }
  }

  // Get transaction suggestions based on context
  async getTransactionSuggestions(context: {
    amount?: number;
    description?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    time?: string;
  }): Promise<{
    suggestions: Array<{
      category: string;
      confidence: number;
      reason: string;
    }>;
    similarTransactions: Transaction[];
  }> {
    try {
      const response = await apiService.post('/transactions/suggestions', context);
      return response;
    } catch (error) {
      console.error('Get transaction suggestions error:', error);
      throw error;
    }
  }

  // Search transactions with advanced filters
  async searchTransactions(query: string, filters?: {
    categories?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    amountRange?: {
      min: number;
      max: number;
    };
    type?: 'income' | 'expense';
  }): Promise<{
    transactions: Transaction[];
    totalResults: number;
    searchTime: number;
  }> {
    try {
      const response = await apiService.post('/transactions/search', { query, filters });
      return response;
    } catch (error) {
      console.error('Search transactions error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const transactionsService = new TransactionsService();
export default transactionsService;