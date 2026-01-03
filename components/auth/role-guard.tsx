"use client"

import { useAuth } from '@/lib/auth/auth-context';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('superadmin' | 'admin')[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

