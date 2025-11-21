import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

export interface NeedsWantsPoint {
  month: string;
  needs: number;
  wants: number;
}

interface NeedsVsWantsBarChartProps {
  data: NeedsWantsPoint[];
  isLoading?: boolean;
}

export default function NeedsVsWantsBarChart({ data, isLoading = false }: NeedsVsWantsBarChartProps) {
  // Calculate total needs and wants
  const totalNeeds = data.reduce((sum, month) => sum + month.needs, 0);
  const totalWants = data.reduce((sum, month) => sum + month.wants, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Needs vs Wants</CardTitle>
            <CardDescription>Monthly breakdown of essential vs discretionary spending</CardDescription>
          </div>
          <div className="text-right space-y-1">
            <div>
              <p className="text-xs text-muted-foreground">Total Needs</p>
              <p className="text-lg font-semibold text-green-600">${totalNeeds.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Wants</p>
              <p className="text-lg font-semibold text-red-600">${totalWants.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
            <Tooltip />
            <Legend iconType="circle" />
            <Bar dataKey="needs" name="Needs" radius={[4, 4, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={`cell-needs-${idx}`} fill="#10b981" />
              ))}
            </Bar>
            <Bar dataKey="wants" name="Wants" radius={[4, 4, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={`cell-wants-${idx}`} fill="#ef4444" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
