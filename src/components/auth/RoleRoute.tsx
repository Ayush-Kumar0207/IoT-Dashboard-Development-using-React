import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import type { UserRole } from '@/types/auth'

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { profile, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
