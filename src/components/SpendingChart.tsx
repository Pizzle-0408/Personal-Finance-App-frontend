import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MonthlyTrendPoint } from '../services/api';
import { useMemo, useState } from 'react';

interface SpendingChartProps {
  data?: MonthlyTrendPoint[];
  isLoading?: boolean;
}

const fallbackData: MonthlyTrendPoint[] = [
  { month: 'Apr', total: 4850, housing: 1800, food: 820, transportation: 490, utilities: 400, insurance: 650, medical: 260, personal: 310, recreation: 250, miscellaneous: 120 },
  { month: 'May', total: 5120, housing: 1850, food: 910, transportation: 520, utilities: 410, insurance: 650, medical: 180, personal: 380, recreation: 310, miscellaneous: 110 },
  { month: 'Jun', total: 4680, housing: 1850, food: 760, transportation: 480, utilities: 390, insurance: 650, medical: 220, personal: 290, recreation: 180, miscellaneous: 60 },
  { month: 'Jul', total: 5340, housing: 1850, food: 980, transportation: 610, utilities: 450, insurance: 650, medical: 340, personal: 290, recreation: 280, miscellaneous: 90 },
  { month: 'Aug', total: 4920, housing: 1850, food: 840, transportation: 510, utilities: 420, insurance: 650, medical: 190, personal: 330, recreation: 220, miscellaneous: 110 },
  { month: 'Sep', total: 4956, housing: 1850, food: 850, transportation: 530, utilities: 415, insurance: 650, medical: 240, personal: 295, recreation: 218, miscellaneous: 108 },
  { month: 'Oct', total: 5360, housing: 1850, food: 892, transportation: 534, utilities: 425, insurance: 650, medical: 285, personal: 340, recreation: 278, miscellaneous: 106 },
];

export default function SpendingChart({ data, isLoading = false }: SpendingChartProps) {
  const [selectedOverlay, setSelectedOverlay] = useState('all');
  const normalizedData = useMemo(() => {
    const source = data && data.length > 0 ? data : fallbackData;
    return source.map((entry) => ({
      month: entry.month,
      total: entry.total,
      housing: entry.housing ?? 0,
      food: entry.food ?? 0,
      transportation: entry.transportation ?? 0,
      utilities: entry.utilities ?? 0,
      insurance: entry.insurance ?? 0,
      medical: entry.medical ?? 0,
      personal: entry.personal ?? 0,
      recreation: entry.recreation ?? 0,
      miscellaneous: entry.miscellaneous ?? 0,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const monthData = payload[0].payload as MonthlyTrendPoint;
      const overlayValue = typeof monthData[selectedOverlay] === 'number' ? Number(monthData[selectedOverlay]) : 0;
      
      // For "all" categories view
      if (selectedOverlay === 'all') {
        return (
          <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
            <p className="text-sm text-foreground mb-1">{monthData.month}</p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Total:</span>
              <span className="text-xs text-red-600 dark:text-red-500">${monthData.total.toLocaleString()}</span>
            </div>
          </div>
        );
      }
      
      // For specific category selection (not "all" or "none")
      if (selectedOverlay !== 'none') {
        return (
          <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
            <p className="text-sm text-foreground mb-2">{monthData.month}</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">Total:</span>
                <span className="text-xs text-foreground">${monthData.total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground capitalize">{selectedOverlay}:</span>
                <span className="text-xs text-red-600 dark:text-red-500">${overlayValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      }
      
      // For "none" view (total only)
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="text-sm text-foreground">{monthData.month}</p>
          <p className="text-sm text-red-600 dark:text-red-500">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Monthly Spending Trend</CardTitle>
            <CardDescription className="text-sm">
              {isLoading && data?.length ? 'Updating with latest data…' : 'Last 7 months'}
            </CardDescription>
          </div>
          <Select value={selectedOverlay} onValueChange={setSelectedOverlay}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select overlay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="none">Total Only</SelectItem>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="medical">Medical & Healthcare</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="recreation">Recreation</SelectItem>
              <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={normalizedData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorHousing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorTransportation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorUtilities" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorInsurance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorMedical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorPersonal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorRecreation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorMiscellaneous" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
            
            {selectedOverlay === 'all' ? (
              // Stacked area chart for all categories
              <>
                <Area 
                  type="monotone"
                  dataKey="miscellaneous" 
                  stackId="1"
                  stroke="#9ca3af"
                  strokeWidth={1.5}
                  fill="url(#colorMiscellaneous)"
                />
                <Area 
                  type="monotone"
                  dataKey="recreation" 
                  stackId="1"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  fill="url(#colorRecreation)"
                />
                <Area 
                  type="monotone"
                  dataKey="personal" 
                  stackId="1"
                  stroke="#ec4899"
                  strokeWidth={1.5}
                  fill="url(#colorPersonal)"
                />
                <Area 
                  type="monotone"
                  dataKey="medical" 
                  stackId="1"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  fill="url(#colorMedical)"
                />
                <Area 
                  type="monotone"
                  dataKey="utilities" 
                  stackId="1"
                  stroke="#eab308"
                  strokeWidth={1.5}
                  fill="url(#colorUtilities)"
                />
                <Area 
                  type="monotone"
                  dataKey="transportation" 
                  stackId="1"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  fill="url(#colorTransportation)"
                />
                <Area 
                  type="monotone"
                  dataKey="insurance" 
                  stackId="1"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  fill="url(#colorInsurance)"
                />
                <Area 
                  type="monotone"
                  dataKey="food" 
                  stackId="1"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  fill="url(#colorFood)"
                />
                <Area 
                  type="monotone"
                  dataKey="housing" 
                  stackId="1"
                  stroke="#dc2626"
                  strokeWidth={1.5}
                  fill="url(#colorHousing)"
                />
              </>
            ) : selectedOverlay === 'none' ? (
              // Total only
              <Area 
                type="monotone"
                dataKey="total" 
                stroke="#6b7280"
                strokeWidth={2}
                fill="url(#colorTotal)"
                dot={{ fill: '#6b7280', r: 3 }}
                activeDot={{ r: 5 }}
              />
            ) : (
              // Individual category with total
              <>
                <Area 
                  type="monotone"
                  dataKey="total" 
                  stroke="#6b7280"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                  dot={{ fill: '#6b7280', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Area 
                  type="monotone"
                  dataKey={selectedOverlay} 
                  stroke={
                    selectedOverlay === 'housing' ? '#dc2626' :
                    selectedOverlay === 'food' ? '#10b981' :
                    selectedOverlay === 'transportation' ? '#f97316' :
                    selectedOverlay === 'utilities' ? '#eab308' :
                    selectedOverlay === 'insurance' ? '#a855f7' :
                    selectedOverlay === 'medical' ? '#ef4444' :
                    selectedOverlay === 'personal' ? '#ec4899' :
                    selectedOverlay === 'recreation' ? '#6366f1' :
                    '#9ca3af'
                  }
                  strokeWidth={2}
                  fill={
                    selectedOverlay === 'housing' ? 'url(#colorHousing)' :
                    selectedOverlay === 'food' ? 'url(#colorFood)' :
                    selectedOverlay === 'transportation' ? 'url(#colorTransportation)' :
                    selectedOverlay === 'utilities' ? 'url(#colorUtilities)' :
                    selectedOverlay === 'insurance' ? 'url(#colorInsurance)' :
                    selectedOverlay === 'medical' ? 'url(#colorMedical)' :
                    selectedOverlay === 'personal' ? 'url(#colorPersonal)' :
                    selectedOverlay === 'recreation' ? 'url(#colorRecreation)' :
                    'url(#colorMiscellaneous)'
                  }
                  dot={{ 
                    fill: selectedOverlay === 'housing' ? '#dc2626' :
                      selectedOverlay === 'food' ? '#10b981' :
                      selectedOverlay === 'transportation' ? '#f97316' :
                      selectedOverlay === 'utilities' ? '#eab308' :
                      selectedOverlay === 'insurance' ? '#a855f7' :
                      selectedOverlay === 'medical' ? '#ef4444' :
                      selectedOverlay === 'personal' ? '#ec4899' :
                      selectedOverlay === 'recreation' ? '#6366f1' :
                      '#9ca3af',
                    r: 3 
                  }}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
        {selectedOverlay === 'all' && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-xs text-muted-foreground">Housing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-xs text-muted-foreground">Food</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a855f7' }}></div>
              <span className="text-xs text-muted-foreground">Insurance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-xs text-muted-foreground">Transportation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
              <span className="text-xs text-muted-foreground">Utilities</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ec4899' }}></div>
              <span className="text-xs text-muted-foreground">Personal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-xs text-muted-foreground">Medical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6366f1' }}></div>
              <span className="text-xs text-muted-foreground">Recreation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#9ca3af' }}></div>
              <span className="text-xs text-gray-600">Misc</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
