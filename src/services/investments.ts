import { apiService } from './api';
import { Investment, Portfolio, InvestmentRecommendation } from '../types';

class InvestmentsService {
  // Get user's portfolio overview
  async getPortfolio(): Promise<Portfolio> {
    try {
      const response = await apiService.get<{ portfolio: Portfolio }>('/investments/portfolio');
      return response.portfolio;
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  }

  // Get all investments
  async getInvestments(params?: {
    type?: 'stocks' | 'bonds' | 'etf' | 'mutual_funds' | 'crypto' | 'real_estate';
    status?: 'active' | 'sold' | 'pending';
    sortBy?: 'value' | 'performance' | 'date_added' | 'symbol';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    investments: Investment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary: {
      totalValue: number;
      totalCost: number;
      totalGainLoss: number;
      totalGainLossPercentage: number;
      dayChange: number;
      dayChangePercentage: number;
    };
  }> {
    try {
      const response = await apiService.get('/investments', { params });
      return response;
    } catch (error) {
      console.error('Get investments error:', error);
      throw error;
    }
  }

  // Get specific investment by ID
  async getInvestmentById(investmentId: string): Promise<Investment> {
    try {
      const response = await apiService.get<{ investment: Investment }>(`/investments/${investmentId}`);
      return response.investment;
    } catch (error) {
      console.error('Get investment by ID error:', error);
      throw error;
    }
  }

  // Add new investment
  async addInvestment(investmentData: {
    symbol: string;
    name: string;
    type: 'stocks' | 'bonds' | 'etf' | 'mutual_funds' | 'crypto' | 'real_estate';
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
    broker?: string;
    fees?: number;
    notes?: string;
    tags?: string[];
  }): Promise<Investment> {
    try {
      const response = await apiService.post<{ investment: Investment }>('/investments', investmentData);
      return response.investment;
    } catch (error) {
      console.error('Add investment error:', error);
      throw error;
    }
  }

  // Update investment
  async updateInvestment(investmentId: string, updates: Partial<Investment>): Promise<Investment> {
    try {
      const response = await apiService.patch<{ investment: Investment }>(`/investments/${investmentId}`, updates);
      return response.investment;
    } catch (error) {
      console.error('Update investment error:', error);
      throw error;
    }
  }

  // Remove investment (sell)
  async removeInvestment(investmentId: string, sellData: {
    quantity: number;
    sellPrice: number;
    sellDate: string;
    fees?: number;
    reason?: string;
    notes?: string;
  }): Promise<{
    transaction: {
      id: string;
      type: 'sell';
      quantity: number;
      price: number;
      totalValue: number;
      fees: number;
      netAmount: number;
      gainLoss: number;
      gainLossPercentage: number;
    };
    updatedInvestment?: Investment;
  }> {
    try {
      const response = await apiService.post(`/investments/${investmentId}/sell`, sellData);
      return response;
    } catch (error) {
      console.error('Remove investment error:', error);
      throw error;
    }
  }

  // Get investment performance
  async getInvestmentPerformance(investmentId: string, period?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'): Promise<{
    performance: {
      currentValue: number;
      totalCost: number;
      gainLoss: number;
      gainLossPercentage: number;
      dayChange: number;
      dayChangePercentage: number;
      annualizedReturn: number;
    };
    priceHistory: Array<{
      date: string;
      price: number;
      volume?: number;
    }>;
    dividends: Array<{
      date: string;
      amount: number;
      type: 'dividend' | 'split' | 'bonus';
    }>;
    transactions: Array<{
      id: string;
      type: 'buy' | 'sell';
      quantity: number;
      price: number;
      date: string;
      fees: number;
    }>;
  }> {
    try {
      const response = await apiService.get(`/investments/${investmentId}/performance`, { params: { period } });
      return response;
    } catch (error) {
      console.error('Get investment performance error:', error);
      throw error;
    }
  }

  // Get market data for a symbol
  async getMarketData(symbol: string, period?: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercentage: number;
    volume: number;
    marketCap?: number;
    peRatio?: number;
    dividendYield?: number;
    high52Week: number;
    low52Week: number;
    priceHistory: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>;
    news: Array<{
      title: string;
      summary: string;
      url: string;
      publishedAt: string;
      source: string;
    }>;
  }> {
    try {
      const response = await apiService.get(`/investments/market-data/${symbol}`, { params: { period } });
      return response;
    } catch (error) {
      console.error('Get market data error:', error);
      throw error;
    }
  }

  // Search for investment symbols
  async searchSymbols(query: string, type?: 'stocks' | 'etf' | 'mutual_funds' | 'crypto'): Promise<{
    results: Array<{
      symbol: string;
      name: string;
      type: string;
      exchange: string;
      currency: string;
      currentPrice?: number;
      marketCap?: number;
    }>;
  }> {
    try {
      const response = await apiService.get('/investments/search', { params: { query, type } });
      return response;
    } catch (error) {
      console.error('Search symbols error:', error);
      throw error;
    }
  }

  // Get investment recommendations
  async getRecommendations(params?: {
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentAmount?: number;
    timeHorizon?: 'short' | 'medium' | 'long';
    goals?: string[];
    excludeSymbols?: string[];
    sectors?: string[];
  }): Promise<{
    recommendations: InvestmentRecommendation[];
    portfolioSuggestions: {
      conservative: {
        allocation: Record<string, number>;
        expectedReturn: number;
        riskLevel: number;
      };
      moderate: {
        allocation: Record<string, number>;
        expectedReturn: number;
        riskLevel: number;
      };
      aggressive: {
        allocation: Record<string, number>;
        expectedReturn: number;
        riskLevel: number;
      };
    };
    insights: string[];
  }> {
    try {
      const response = await apiService.post('/investments/recommendations', params);
      return response;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }

  // Get portfolio analysis
  async getPortfolioAnalysis(): Promise<{
    allocation: {
      byType: Record<string, number>;
      bySector: Record<string, number>;
      byRegion: Record<string, number>;
    };
    diversification: {
      score: number;
      analysis: string;
      suggestions: string[];
    };
    risk: {
      level: 'low' | 'medium' | 'high';
      score: number;
      factors: string[];
    };
    performance: {
      totalReturn: number;
      annualizedReturn: number;
      volatility: number;
      sharpeRatio: number;
      maxDrawdown: number;
    };
    rebalancing: {
      needed: boolean;
      suggestions: Array<{
        action: 'buy' | 'sell';
        symbol: string;
        currentWeight: number;
        targetWeight: number;
        amount: number;
      }>;
    };
  }> {
    try {
      const response = await apiService.get('/investments/portfolio/analysis');
      return response;
    } catch (error) {
      console.error('Get portfolio analysis error:', error);
      throw error;
    }
  }

  // Rebalance portfolio
  async rebalancePortfolio(strategy: {
    targetAllocation: Record<string, number>;
    rebalanceThreshold?: number;
    cashToInvest?: number;
    sellToRebalance?: boolean;
  }): Promise<{
    plan: Array<{
      action: 'buy' | 'sell';
      symbol: string;
      quantity: number;
      estimatedPrice: number;
      estimatedValue: number;
    }>;
    summary: {
      totalTransactions: number;
      estimatedCost: number;
      estimatedFees: number;
      newAllocation: Record<string, number>;
    };
    executeUrl: string;
  }> {
    try {
      const response = await apiService.post('/investments/portfolio/rebalance', strategy);
      return response;
    } catch (error) {
      console.error('Rebalance portfolio error:', error);
      throw error;
    }
  }

  // Execute rebalancing plan
  async executeRebalancing(planId: string, confirmations: {
    confirmRisks: boolean;
    confirmFees: boolean;
    confirmTaxImplications: boolean;
  }): Promise<{
    executedTransactions: Array<{
      id: string;
      symbol: string;
      action: 'buy' | 'sell';
      quantity: number;
      price: number;
      status: 'completed' | 'pending' | 'failed';
    }>;
    summary: {
      successful: number;
      failed: number;
      totalCost: number;
      totalFees: number;
    };
  }> {
    try {
      const response = await apiService.post(`/investments/portfolio/rebalance/${planId}/execute`, confirmations);
      return response;
    } catch (error) {
      console.error('Execute rebalancing error:', error);
      throw error;
    }
  }

  // Get watchlist
  async getWatchlist(): Promise<{
    watchlist: Array<{
      id: string;
      symbol: string;
      name: string;
      currentPrice: number;
      change: number;
      changePercentage: number;
      addedAt: string;
      alerts: Array<{
        type: 'price_above' | 'price_below' | 'volume_spike' | 'news';
        value?: number;
        isActive: boolean;
      }>;
    }>;
  }> {
    try {
      const response = await apiService.get('/investments/watchlist');
      return response;
    } catch (error) {
      console.error('Get watchlist error:', error);
      throw error;
    }
  }

  // Add to watchlist
  async addToWatchlist(symbol: string, alerts?: Array<{
    type: 'price_above' | 'price_below' | 'volume_spike' | 'news';
    value?: number;
  }>): Promise<{
    watchlistItem: {
      id: string;
      symbol: string;
      addedAt: string;
    };
  }> {
    try {
      const response = await apiService.post('/investments/watchlist', { symbol, alerts });
      return response;
    } catch (error) {
      console.error('Add to watchlist error:', error);
      throw error;
    }
  }

  // Remove from watchlist
  async removeFromWatchlist(watchlistItemId: string): Promise<void> {
    try {
      await apiService.delete(`/investments/watchlist/${watchlistItemId}`);
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      throw error;
    }
  }

  // Update watchlist alerts
  async updateWatchlistAlerts(watchlistItemId: string, alerts: Array<{
    type: 'price_above' | 'price_below' | 'volume_spike' | 'news';
    value?: number;
    isActive: boolean;
  }>): Promise<void> {
    try {
      await apiService.patch(`/investments/watchlist/${watchlistItemId}/alerts`, { alerts });
    } catch (error) {
      console.error('Update watchlist alerts error:', error);
      throw error;
    }
  }

  // Get investment news
  async getInvestmentNews(params?: {
    symbols?: string[];
    categories?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{
    news: Array<{
      id: string;
      title: string;
      summary: string;
      content: string;
      url: string;
      publishedAt: string;
      source: string;
      symbols: string[];
      sentiment: 'positive' | 'neutral' | 'negative';
      impact: 'low' | 'medium' | 'high';
    }>;
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    try {
      const response = await apiService.get('/investments/news', { params });
      return response;
    } catch (error) {
      console.error('Get investment news error:', error);
      throw error;
    }
  }

  // Get market indices
  async getMarketIndices(): Promise<{
    indices: Array<{
      symbol: string;
      name: string;
      value: number;
      change: number;
      changePercentage: number;
      lastUpdated: string;
    }>;
  }> {
    try {
      const response = await apiService.get('/investments/market-indices');
      return response;
    } catch (error) {
      console.error('Get market indices error:', error);
      throw error;
    }
  }

  // Get sector performance
  async getSectorPerformance(period?: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
    sectors: Array<{
      name: string;
      performance: number;
      topPerformers: Array<{
        symbol: string;
        name: string;
        change: number;
      }>;
      worstPerformers: Array<{
        symbol: string;
        name: string;
        change: number;
      }>;
    }>;
  }> {
    try {
      const response = await apiService.get('/investments/sectors', { params: { period } });
      return response;
    } catch (error) {
      console.error('Get sector performance error:', error);
      throw error;
    }
  }

  // Get investment education content
  async getEducationContent(topic?: string): Promise<{
    articles: Array<{
      id: string;
      title: string;
      summary: string;
      content: string;
      topic: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      readTime: number;
      publishedAt: string;
      tags: string[];
    }>;
    courses: Array<{
      id: string;
      title: string;
      description: string;
      modules: number;
      duration: number;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      rating: number;
    }>;
  }> {
    try {
      const response = await apiService.get('/investments/education', { params: { topic } });
      return response;
    } catch (error) {
      console.error('Get education content error:', error);
      throw error;
    }
  }

  // Calculate investment scenarios
  async calculateScenarios(params: {
    initialInvestment: number;
    monthlyContribution: number;
    timeHorizon: number; // years
    expectedReturn: number;
    inflationRate?: number;
    scenarios?: Array<{
      name: string;
      returnRate: number;
      volatility?: number;
    }>;
  }): Promise<{
    baseScenario: {
      finalValue: number;
      totalContributions: number;
      totalGains: number;
      realValue: number; // adjusted for inflation
    };
    scenarios: Array<{
      name: string;
      finalValue: number;
      probability: number;
      yearlyBreakdown: Array<{
        year: number;
        value: number;
        contributions: number;
        gains: number;
      }>;
    }>;
    insights: string[];
  }> {
    try {
      const response = await apiService.post('/investments/scenarios', params);
      return response;
    } catch (error) {
      console.error('Calculate scenarios error:', error);
      throw error;
    }
  }

  // Export investment data
  async exportInvestments(format: 'csv' | 'pdf' | 'excel', options?: {
    includePerformance?: boolean;
    includeTransactions?: boolean;
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<Blob> {
    try {
      const params = { format, ...options };
      const response = await apiService.downloadFile('/investments/export', { params });
      return response;
    } catch (error) {
      console.error('Export investments error:', error);
      throw error;
    }
  }

  // Import investment data
  async importInvestments(file: any, options?: {
    format: 'csv' | 'broker_statement';
    broker?: string;
    skipDuplicates?: boolean;
  }): Promise<{
    imported: number;
    skipped: number;
    errors: Array<{
      row: number;
      error: string;
    }>;
    investments: Investment[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
      }

      const response = await apiService.post('/investments/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Import investments error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const investmentsService = new InvestmentsService();
export default investmentsService;