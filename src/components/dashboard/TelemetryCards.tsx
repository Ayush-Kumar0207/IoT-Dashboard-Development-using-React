import { useTelemetry } from '@/hooks/useIoTData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Thermometer, Droplets } from 'lucide-react'

export default function TelemetryCards() {
  const { data: telemetry, isLoading } = useTelemetry()

  const cards = [
    {
      title: 'Temperature',
      value: telemetry?.temperature != null ? `${telemetry.temperature.toFixed(1)}°C` : '--',
      icon: Thermometer,
      color: telemetry?.temperature != null && telemetry.temperature > 28 ? 'text-red-500' : 'text-orange-500',
      bg: telemetry?.temperature != null && telemetry.temperature > 28 ? 'bg-red-50' : 'bg-orange-50',
    },
    {
      title: 'Humidity',
      value: telemetry?.humidity != null ? `${telemetry.humidity.toFixed(1)}%` : '--',
      icon: Droplets,
      color: telemetry?.humidity != null && telemetry.humidity > 50 ? 'text-blue-600' : 'text-blue-400',
      bg: telemetry?.humidity != null && telemetry.humidity > 50 ? 'bg-blue-100' : 'bg-blue-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-full ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{card.value}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Live updates every 5s
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
