import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { IncomeVsExpensesPoint } from '../services/api';

interface IncomeVsExpensesProps {
  data?: IncomeVsExpensesPoint[];
  isLoading?: boolean;
}

const placeholderData: IncomeVsExpensesPoint[] = [
  { month: 'Jan', income: 1, expenses: 1 },
  { month: 'Feb', income: 1, expenses: 1 },
  { month: 'Mar', income: 1, expenses: 1 },
  { month: 'Apr', income: 1, expenses: 1 },
  { month: 'May', income: 1, expenses: 1 },
  { month: 'Jun', income: 1, expenses: 1 },
  { month: 'Jul', income: 1, expenses: 1 },
];

export default function IncomeVsExpenses({ data, isLoading = false }: IncomeVsExpensesProps) {
  const chartData = data && data.length > 0 ? data : placeholderData;

  // Calculate average net income and savings rate from actual data
  const avgNetIncome = chartData.length > 0
    ? chartData.reduce((sum, point) => sum + (point.income - point.expenses), 0) / chartData.length
    : 0;
  
  const avgIncome = chartData.length > 0
    ? chartData.reduce((sum, point) => sum + point.income, 0) / chartData.length
    : 0;
  
  const savingsRate = avgIncome > 0 ? (avgNetIncome / avgIncome) * 100 : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="text-sm text-foreground mb-2">{payload[0].payload.month}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Income:</span>
              <span className="text-xs text-green-600 dark:text-green-500">${payload[0].payload.income.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Expenses:</span>
              <span className="text-xs text-red-600 dark:text-red-500">${payload[0].payload.expenses.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground">Net:</span>
              <span className="text-xs text-red-600 dark:text-red-500">
                ${(payload[0].payload.income - payload[0].payload.expenses).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Income vs Expenses</CardTitle>
        <CardDescription className="text-sm">
          {isLoading && data?.length ? 'Updating with backend…' : 'Last 7 months'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="month" 
              className="text-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              className="text-muted-foreground"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="income" 
              name="Income"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-income-${index}`} fill={entry.income > 0 ? "#10b981" : "#ef4444"} />
              ))}
            </Bar>
            <Bar 
              dataKey="expenses" 
              name="Expenses"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-expense-${index}`} fill={entry.expenses > 0 ? "#ef4444" : "#10b981"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Average Net Income</p>
            <p className="text-2xl text-green-600 dark:text-green-500">
              ${Math.round(avgNetIncome).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className="text-2xl text-red-600 dark:text-red-500">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
