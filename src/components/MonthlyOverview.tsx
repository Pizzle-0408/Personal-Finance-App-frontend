import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MonthlySummary } from '../services/api';
import { TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface MonthlyOverviewProps {
  summary?: MonthlySummary;
  isLoading?: boolean;
}

const emptySummary: MonthlySummary = {
  totalSpending: 0,
  lastMonthTotal: 0,
  differenceAmount: 0,
  differencePercent: 0,
  dailyAverage: 0,
  dailyAverageChange: 0,
  topCategory: {
    name: 'N/A',
    amount: 0,
    percent: 0,
  },
};

export default function MonthlyOverview({ summary, isLoading = false }: MonthlyOverviewProps) {
  const data = summary ?? emptySummary;
  const differenceIsIncrease = data.differenceAmount >= 0;
  const differenceClass = differenceIsIncrease ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400';
  const dailyChangeClass = data.dailyAverageChange <= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:row-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Total Spending</CardTitle>
            {isLoading && <p className="text-xs text-muted-foreground">Syncing latest data…</p>}
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-red-600 dark:text-red-500" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-[calc(100%-76px)]">
          <div className="text-7xl text-foreground mb-8">${data.totalSpending.toLocaleString()}</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Month</span>
              <span className="text-foreground">${data.lastMonthTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Difference</span>
              <span className={differenceClass}>
                {differenceIsIncrease ? '+' : '-'}${Math.abs(data.differenceAmount).toLocaleString()} ({data.differencePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Daily Average</CardTitle>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl text-foreground">${data.dailyAverage.toLocaleString()}</div>
          <p className={`text-sm mt-2 ${dailyChangeClass}`}>
            {data.dailyAverageChange > 0 ? '+' : ''}
            {data.dailyAverageChange.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Highest Category</CardTitle>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
            <TrendingDown className="w-5 h-5 text-purple-600 dark:text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl text-foreground">{data.topCategory.name}</div>
          <p className="text-sm mt-2 text-muted-foreground">
            ${data.topCategory.amount.toLocaleString()} ({data.topCategory.percent.toFixed(1)}%)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
