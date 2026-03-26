import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllUsers, updateUserRole } from '@/services/admin'
import { useToast } from '@/hooks/use-toast'
import type { UserRole, UserProfile } from '@/types/auth'

export function useUsers() {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) => 
      updateUserRole(userId, newRole),
    onMutate: async ({ userId, newRole }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['adminUsers'] })

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<UserProfile[]>(['adminUsers'])

      // Optimistically update to the new value
      if (previousUsers) {
        queryClient.setQueryData<UserProfile[]>(['adminUsers'], (old) => {
          if (!old) return old
          return old.map((u) => 
            u.id === userId ? { ...u, role: newRole } : u
          )
        })
      }

      return { previousUsers }
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['adminUsers'], context.previousUsers)
      }
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role.',
        variant: 'destructive',
      })
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User role updated successfully.',
      })
    },
  })
}
