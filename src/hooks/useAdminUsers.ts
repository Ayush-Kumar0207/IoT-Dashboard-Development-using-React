import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllUsers, updateUserRole } from '@/services/admin'
import { useToast } from '@/hooks/use-toast'
import type { UserRole } from '@/types/auth'

export function useUsers() {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) => 
      updateUserRole(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      toast({
        title: 'Success',
        description: 'User role updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role.',
        variant: 'destructive',
      })
    },
  })
}
