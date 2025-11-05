import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartComponentProps {
  data: any[];
  xKey: string;
  yKeys: {
    key: string;
    color: string;
    name: string;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  curve?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
}

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  xKey,
  yKeys,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  curve = 'monotone',
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          {yKeys.map((yKey) => (
            <linearGradient key={yKey.key} id={`color-${yKey.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={yKey.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={yKey.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />}
        <XAxis
          dataKey={xKey}
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB',
          }}
          labelStyle={{ color: '#F9FAFB' }}
        />
        {showLegend && <Legend wrapperStyle={{ color: '#9CA3AF' }} />}
        {yKeys.map((yKey) => (
          <Area
            key={yKey.key}
            type={curve}
            dataKey={yKey.key}
            stroke={yKey.color}
            fill={`url(#color-${yKey.key})`}
            name={yKey.name}
            stackId={stacked ? 'stack' : undefined}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
