import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryBreakdownEntry } from '../services/api';
import { useMemo, useState } from 'react';

interface CategoryPieChartProps {
  breakdown?: CategoryBreakdownEntry[];
  isLoading?: boolean;
}

const fallbackBreakdown: Array<CategoryBreakdownEntry & { color: string }> = [
  { category: 'Housing', amount: 1850, percent: 34.5, color: '#dc2626' },
  { category: 'Food', amount: 892, percent: 16.6, color: '#10b981' },
  { category: 'Transportation', amount: 534, percent: 10, color: '#f97316' },
  { category: 'Utilities', amount: 425, percent: 7.9, color: '#eab308' },
  { category: 'Insurance', amount: 650, percent: 12.1, color: '#a855f7' },
  { category: 'Medical & Healthcare', amount: 285, percent: 5.3, color: '#ef4444' },
  { category: 'Personal', amount: 340, percent: 6.3, color: '#ec4899' },
  { category: 'Recreation and Entertainment', amount: 278, percent: 5.2, color: '#6366f1' },
  { category: 'Miscellaneous', amount: 106, percent: 2, color: '#6b7280' },
];

const colorPalette = ['#dc2626', '#10b981', '#f97316', '#eab308', '#a855f7', '#ef4444', '#ec4899', '#6366f1', '#6b7280'];

export default function CategoryPieChart({ breakdown, isLoading = false }: CategoryPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = useMemo(() => {
    const source = breakdown && breakdown.length > 0 ? breakdown : fallbackBreakdown;
    return [...source]
      .map((entry, index) => ({
        name: entry.category,
        value: entry.amount,
        color: entry.color ?? colorPalette[index % colorPalette.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [breakdown]);

  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0) || 1, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="text-sm text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            ${payload[0].value.toLocaleString()} ({((payload[0].value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Spending Distribution</CardTitle>
        <CardDescription className="text-sm">
          {isLoading && breakdown?.length ? 'Live data from backend' : 'October 2025'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={70}
                  outerRadius={170}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                  paddingAngle={3}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                      style={{
                        filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center space-y-2">
            {data.map((entry, index) => (
              <div 
                key={entry.name} 
                className="flex items-center space-x-2 cursor-pointer transition-opacity duration-300"
                style={{ opacity: activeIndex === null || activeIndex === index ? 1 : 0.3 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0 transition-transform duration-300" 
                  style={{ 
                    backgroundColor: entry.color,
                    transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)'
                  }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">${entry.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
