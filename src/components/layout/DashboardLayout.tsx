import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { fetchAllUsers } from '@/services/admin'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'
import { LogOut, Users, LayoutDashboard, Shield, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function DashboardLayout() {
  const { profile, signOut } = useAuthStore()
  const location = useLocation()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (profile?.role === 'ADMIN') {
      queryClient.prefetchQuery({
        queryKey: ['adminUsers'],
        queryFn: fetchAllUsers,
      })
    }
  }, [profile, queryClient])

  const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    ...(profile?.role === 'ADMIN' 
      ? [{ name: 'User Management', href: '/admin', icon: Users }] 
      : []),
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <div className="flex items-center gap-2 px-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">IoT Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onMouseEnter={() => {
                if (item.href === '/admin') {
                  queryClient.prefetchQuery({
                    queryKey: ['adminUsers'],
                    queryFn: fetchAllUsers,
                  })
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="px-3 py-2 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</p>
          <p className="text-sm font-medium truncate">{profile?.email}</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <p className="text-xs text-muted-foreground capitalize">{profile?.role?.toLowerCase()}</p>
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to enter your credentials again to access your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => signOut()} className="bg-red-600 hover:bg-red-700">
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Nav */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">IoT Admin</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
