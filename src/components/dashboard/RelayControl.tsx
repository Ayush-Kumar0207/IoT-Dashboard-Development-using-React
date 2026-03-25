import { useState } from 'react'
import { useRelayControl } from '@/hooks/useIoTData'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Power, ShieldAlert } from 'lucide-react'

export default function RelayControl() {
  const [isOn, setIsOn] = useState(false)
  const { profile } = useAuthStore()
  const { mutate: controlRelay, isPending } = useRelayControl()

  const isViewer = profile?.role === 'VIEWER'

  const handleToggle = (checked: boolean) => {
    setIsOn(checked)
    controlRelay(checked)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Power className={`h-5 w-5 ${isOn ? 'text-green-500' : 'text-muted-foreground'}`} />
          <CardTitle>Remote Relay Control</CardTitle>
        </div>
        <CardDescription>
          Switch the connected device relay ON or OFF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
          <div className="space-y-0.5">
            <Label htmlFor="relay-switch" className="text-base font-semibold text-slate-900">
              Relay Status
            </Label>
            <p className="text-sm text-muted-foreground">
              {isOn ? 'The relay is currently ACTIVE' : 'The relay is currently INACTIVE'}
            </p>
          </div>
          <Switch
            id="relay-switch"
            checked={isOn}
            onCheckedChange={handleToggle}
            disabled={isViewer || isPending}
          />
        </div>

        {isViewer && (
          <div className="flex items-start gap-2 p-3 text-sm text-orange-800 bg-orange-50 border border-orange-200 rounded-md">
            <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              <strong>Access Restricted:</strong> Viewers cannot control devices. 
              Contact an administrator to upgrade your permissions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
