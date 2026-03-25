import { useDeviceStatus } from '@/hooks/useIoTData'
import TelemetryCards from '@/components/dashboard/TelemetryCards'
import RelayControl from '@/components/dashboard/RelayControl'
import HistoricalChart from '@/components/dashboard/HistoricalChart'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'

export default function Dashboard() {
  const { data: isOnline, isLoading: isStatusLoading } = useDeviceStatus()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">IoT Device Overview</h1>
          <p className="text-muted-foreground">Monitor and control your connected hardware in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border shadow-sm">
            <Activity className={`h-4 w-4 ${isOnline ? 'text-green-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-sm font-medium text-slate-600 italic">Device Status:</span>
            {!isStatusLoading ? (
              <Badge 
                variant={isOnline ? 'default' : 'secondary'} 
                className={isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-200 text-slate-600'}
              >
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </Badge>
            ) : (
              <div className="h-5 w-16 bg-slate-100 animate-pulse rounded" />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TelemetryCards />
        </div>
        <div className="lg:col-span-1">
          <RelayControl />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <HistoricalChart />
        </div>
      </div>
    </div>
  )
}
