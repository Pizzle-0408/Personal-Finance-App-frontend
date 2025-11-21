import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import TransactionList from './TransactionList';
import SpendingChart from './SpendingChart';
import CategoryPieChart from './CategoryPieChart';
import MonthlyOverview from './MonthlyOverview';
import IncomeVsExpenses from './IncomeVsExpenses';
import NeedsVsWantsBarChart from './NeedsVsWantsBarChart';
import ChatBot from './ChatBot';
import { Bell, LogOut, Settings, Moon, Sun, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  getTransactions,
  getDailyAnalytics,
  getMonthlyAnalytics,
  uploadTransactions,
  Transaction,
  DailyAnalyticsEntry,
  MonthlyAnalyticsResponse,
  CategoryBreakdownEntry,
} from '../services/api';

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const fallbackCategoryBreakdown: CategoryBreakdownEntry[] = [
  { category: 'Housing', amount: 1850, percent: 35, color: '#dc2626', accentClass: 'bg-red-600', recommended: 30, recommendedAmount: 1608 },
  { category: 'Food', amount: 892, percent: 17, color: '#10b981', accentClass: 'bg-green-500', recommended: 15, recommendedAmount: 804 },
  { category: 'Transportation', amount: 534, percent: 10, color: '#f97316', accentClass: 'bg-orange-500', recommended: 15, recommendedAmount: 804 },
  { category: 'Utilities', amount: 425, percent: 8, color: '#eab308', accentClass: 'bg-yellow-500', recommended: 10, recommendedAmount: 536 },
  { category: 'Insurance', amount: 650, percent: 12, color: '#a855f7', accentClass: 'bg-purple-500', recommended: 10, recommendedAmount: 536 },
  { category: 'Medical & Healthcare', amount: 285, percent: 5, color: '#ef4444', accentClass: 'bg-red-500', recommended: 5, recommendedAmount: 268 },
  { category: 'Personal', amount: 340, percent: 6, color: '#ec4899', accentClass: 'bg-pink-500', recommended: 5, recommendedAmount: 268 },
  { category: 'Recreation and Entertainment', amount: 278, percent: 5, color: '#6366f1', accentClass: 'bg-indigo-500', recommended: 5, recommendedAmount: 268 },
  { category: 'Miscellaneous', amount: 106, percent: 2, color: '#6b7280', accentClass: 'bg-gray-500', recommended: 5, recommendedAmount: 268 },
];

const formatDateLabel = (value: string) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }
  return parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function Dashboard({ onLogout, isDarkMode, onToggleDarkMode }: DashboardProps) {
  const [isUsingSampleData, setIsUsingSampleData] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyAnalytics, setDailyAnalytics] = useState<DailyAnalyticsEntry[]>([]);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<MonthlyAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.onclick = null;
    }
  }, []);

  const hydrateDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [transactionData, dailyData, monthlyData] = await Promise.all([
        getTransactions(),
        getDailyAnalytics(),
        getMonthlyAnalytics(),
      ]);
      setTransactions(transactionData);
      setDailyAnalytics(dailyData);
      setMonthlyAnalytics(monthlyData);
      setIsUsingSampleData(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrateDashboard();
  }, [hydrateDashboard]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      try {
        setIsUploading(true);
        await uploadTransactions(file);
        toast.success('CSV file uploaded successfully!');
        await hydrateDashboard();
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : 'Failed to upload CSV file');
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    } else {
      toast.error('Please upload a valid CSV file');
      e.target.value = '';
    }
  };

  const categoryBreakdownData = useMemo(() => {
    const source =
      monthlyAnalytics?.categoryBreakdown && monthlyAnalytics.categoryBreakdown.length > 0
        ? monthlyAnalytics.categoryBreakdown
        : [];

    return source.map((item, index) => {
      return {
        ...item,
        color: item.color ?? '#6b7280',
        accentClass: item.accentClass ?? 'bg-gray-500',
        recommended: item.recommended ?? 0,
        recommendedAmount: item.recommendedAmount ?? 0,
      } as CategoryBreakdownEntry;
    });
  }, [monthlyAnalytics]);

  const totalExpenses =
    monthlyAnalytics?.summary?.totalSpending ??
    categoryBreakdownData.reduce((sum, entry) => sum + entry.amount, 0);
  const dailySnapshot = dailyAnalytics.slice(0, 7);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg"></div>
              <span className="text-foreground">DISCOVER x Illinois Tech</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm text-foreground">Carlos Bernal</div>
                  <div className="text-xs text-muted-foreground">dexterthefirst112@gmail.com</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-foreground mb-2">Expense Tracker</h1>
          <p className="text-muted-foreground">Track and analyze your spending across categories</p>
        </div>

        {error && (
          <div className="mb-6">
            <Card className="border border-red-500/40 bg-red-500/5">
              <CardContent className="pt-4">
                <p className="text-sm text-red-600">Unable to sync with the backend: {error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={hydrateDashboard}
                  disabled={isLoading}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monthly Overview */}
        <MonthlyOverview summary={monthlyAnalytics?.summary} isLoading={isLoading} />

        {/* Needs vs Wants Bar Chart */}
        {monthlyAnalytics?.trend && (
          <div className="mt-6">
            <NeedsVsWantsBarChart
              data={(monthlyAnalytics?.trend ?? []).map((month) => {
                // Define needs and wants categories based on monthly trend data
                // Needs: housing, food (groceries), transportation, utilities, insurance, medical, personal, education
                // Wants: dining (restaurants/food&drink), recreation (entertainment), shopping (gifts), miscellaneous
                const needs = (month.housing ?? 0) + (month.food ?? 0) + (month.transportation ?? 0) + 
                              (month.utilities ?? 0) + (month.insurance ?? 0) + (month.medical ?? 0) + 
                              (month.personal ?? 0) + (month.education ?? 0);
                const wants = (month.dining ?? 0) + (month.recreation ?? 0) + (month.shopping ?? 0) + (month.miscellaneous ?? 0);
                return { month: month.month, needs, wants };
              })}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6" />

        {/* Monthly Spending Trend - Full Width */}
        <div>
          <SpendingChart data={monthlyAnalytics?.trend} isLoading={isLoading} />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <CategoryPieChart breakdown={categoryBreakdownData} isLoading={isLoading} />
          <IncomeVsExpenses data={monthlyAnalytics?.incomeVsExpenses} isLoading={isLoading} />
        </div>

        {/* AI Chat Assistant */}
        <div className="mt-8">
          <ChatBot />
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="mt-6">
            <TransactionList transactions={transactions} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                  {isUsingSampleData ? 'Sample guide based on mock data' : 'Live data from the backend'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBreakdownData.map((item) => {
                    const percentValue = item.percent > 1 ? item.percent : item.percent * 100;
                    const recommendedPercentRaw = item.recommended ?? 0;
                    const recommendedPercent =
                      recommendedPercentRaw > 1 ? recommendedPercentRaw : recommendedPercentRaw * 100;
                    const barPercent = Math.min(percentValue, 100);
                    const recommendedPercentClamped = Math.min(recommendedPercent, 100);
                    const isOverBudget = recommendedPercent > 0 ? percentValue > recommendedPercent : false;

                    return (
                      <div key={item.category}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color ?? '#6b7280' }}></div>
                            <span className="text-sm text-muted-foreground">{item.category}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                              {percentValue.toFixed(1)}% {isOverBudget ? '↑' : '✓'}
                            </span>
                            <span className="text-sm text-foreground min-w-[80px] text-right">
                              ${item.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 relative">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${barPercent}%`, backgroundColor: item.color ?? '#6b7280' }}
                          ></div>
                          {recommendedPercent > 0 && (
                            <div
                              className="absolute top-0 h-2 w-0.5 bg-foreground/60"
                              style={{ left: `${recommendedPercentClamped}%` }}
                              title={`Recommended: ${recommendedPercent.toFixed(1)}%${
                                item.recommendedAmount ? ` ($${item.recommendedAmount.toLocaleString()})` : ''
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            Recommended: {recommendedPercent > 0 ? `${recommendedPercent.toFixed(1)}%` : '—'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.recommendedAmount ? `$${item.recommendedAmount.toLocaleString()}` : '—'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Total Expenses</span>
                    <span className="text-2xl text-foreground">${totalExpenses.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CSV Upload Section */}
        <div className="mt-8 pb-8">
          {isUsingSampleData && (
            <div className="flex items-center justify-center gap-2 mb-4 text-amber-600 dark:text-amber-500">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">* You are currently viewing sample data</p>
            </div>
          )}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                  <h3 className="text-foreground mb-2">Import Your Banking Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a CSV file from your bank to import actual transaction data
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="default"
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isUploading}
                    onClick={() => {
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                      input?.click();
                    }}
                  >
                    <Upload className={`w-4 h-4 mr-2 ${isUploading ? 'animate-spin' : ''}`} />
                    {isUploading ? 'Uploading…' : 'Upload CSV File'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  Supported format: CSV files exported from most major banks. 
                  Your data is processed locally and never sent to external servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
