import { useQuery, useMutation } from '@tanstack/react-query'
import { 
  getDeviceStatus, 
  getLatestTelemetry, 
  getHistoricalData, 
  sendRelayCommand 
} from '@/services/anedya'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook to monitor device online/offline status
 * Polling interval: 10 seconds
 */
export function useDeviceStatus() {
  return useQuery({
    queryKey: ['deviceStatus'],
    queryFn: getDeviceStatus,
    refetchInterval: 10000,
    retry: 2,
    staleTime: 8000,
  })
}

/**
 * Hook to monitor live temperature and humidity
 * Polling interval: 5 seconds
 */
export function useTelemetry() {
  return useQuery({
    queryKey: ['telemetry'],
    queryFn: getLatestTelemetry,
    refetchInterval: 5000,
    retry: 2,
    staleTime: 4000,
  })
}

/**
 * Hook to fetch historical data for the last 24 hours
 * Automatically polls for updates every 15 seconds
 */
export function useHistoricalData() {
  return useQuery({
    queryKey: ['historicalTelemetry'],
    queryFn: async () => {
      // Fetch last 1 hour for visible real-time updates
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);

      const [tempData, humData] = await Promise.all([
        getHistoricalData('temperature', oneHourAgo, now),
        getHistoricalData('humidity', oneHourAgo, now),
      ]);

      return {
        temperature: tempData,
        humidity: humData,
      };
    },
    refetchInterval: 15000,
    staleTime: 0, // Always refetch fresh data from cloud
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

/**
 * Hook to control the device relay
 */
export function useRelayControl() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (state: boolean) => sendRelayCommand(state),
    onSuccess: () => {
      toast({
        title: 'Command Sent',
        description: 'The relay control command was successfully dispatched to the device.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Command Failed',
        description: error.message || 'Failed to send command to the device.',
        variant: 'destructive',
      })
    },
  })
}
