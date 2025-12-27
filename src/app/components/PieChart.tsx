import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
}

const DEFAULT_COLORS = ['#7c3aed', '#8b5cf6', '#3b82f6', '#60a5fa', '#10b981'];

export function PieChart({ data, title }: PieChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground mb-4">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(26, 26, 28, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Legend 
            wrapperStyle={{
              color: '#9ca3af'
            }}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}
