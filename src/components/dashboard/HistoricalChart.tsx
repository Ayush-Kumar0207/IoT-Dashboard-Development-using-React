import { Activity } from 'lucide-react'
import { useHistoricalData } from '@/hooks/useIoTData'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function HistoricalChart() {
  const { data, isLoading } = useHistoricalData()

  // Prepare chart data by merging temperature and humidity based on timestamp
  const chartData = data ? data.temperature.map((temp, index) => ({
    time: new Date(temp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: temp.value,
    humidity: data.humidity[index]?.value || 0,
  })) : []

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historical Telemetry</CardTitle>
        <CardDescription>Sensor trends for the last hour. Auto-refreshes every 15 seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] w-full flex flex-col items-center justify-center text-center space-y-2 border-2 border-dashed rounded-lg bg-slate-50/50">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Activity className="h-6 w-6 text-muted-foreground animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Waiting for device data...</p>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Connect your device or start the simulator to see sensor trends.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
