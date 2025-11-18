import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IncomeVsExpensesPoint } from '../services/api';

interface IncomeVsExpensesProps {
  data?: IncomeVsExpensesPoint[];
  isLoading?: boolean;
}

const fallbackData: IncomeVsExpensesPoint[] = [
  { month: 'Apr', income: 6500, expenses: 4850 },
  { month: 'May', income: 6500, expenses: 5120 },
  { month: 'Jun', income: 6500, expenses: 4680 },
  { month: 'Jul', income: 6500, expenses: 5340 },
  { month: 'Aug', income: 6500, expenses: 4920 },
  { month: 'Sep', income: 6500, expenses: 4956 },
  { month: 'Oct', income: 6500, expenses: 5360 },
];

export default function IncomeVsExpenses({ data, isLoading = false }: IncomeVsExpensesProps) {
  const chartData = data && data.length > 0 ? data : fallbackData;

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
              fill="url(#colorIncome)"
              radius={[4, 4, 0, 0]}
              name="Income"
            />
            <Bar 
              dataKey="expenses" 
              fill="url(#colorExpenses)"
              radius={[4, 4, 0, 0]}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Average Net Income</p>
            <p className="text-2xl text-green-600 dark:text-green-500">$1,301</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className="text-2xl text-red-600 dark:text-red-500">20.0%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
