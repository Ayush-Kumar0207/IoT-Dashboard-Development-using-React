import { useUsers, useUpdateRole } from '@/hooks/useAdminUsers'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { UserRole } from '@/types/auth'

export default function Admin() {
  const { data: users, isLoading } = useUsers()
  const { mutate: updateRole } = useUpdateRole()
  const { user: currentUser } = useAuthStore()

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded"></div>
        <div className="h-96 w-full bg-slate-100 rounded"></div>
      </div>
    )
  }

  // Filter out the currently logged-in admin user
  const otherUsers = users?.filter((u) => u.id !== currentUser?.id) || []

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'OPERATOR':
        return 'default'
      case 'VIEWER':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions.</p>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {otherUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value: UserRole) => 
                      updateRole({ userId: user.id, newRole: value })
                    }
                  >
                    <SelectTrigger className="w-[130px] ml-auto">
                      <SelectValue placeholder="Update Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="OPERATOR">OPERATOR</SelectItem>
                      <SelectItem value="VIEWER">VIEWER</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {otherUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No other users found. Invite someone to join!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
