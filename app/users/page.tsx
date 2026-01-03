"use client"

import { useEffect, useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserTable } from "@/components/users/user-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Shield, UserCheck, UserX } from "lucide-react";
import { usersApi } from "@/lib/api/users";
import { User } from "@/lib/types";
import { toast } from "sonner";
import { UserForm } from "@/components/users/user-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const superadmins = users.filter(u => u.role === "superadmin").length;
    const admins = users.filter(u => u.role === "admin").length;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = users.filter(u => !u.isActive).length;

    return { totalUsers, superadmins, admins, activeUsers, inactiveUsers };
  }, [users]);

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
    },
    {
      title: "Superadmins",
      value: stats.superadmins,
      icon: Shield,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/10",
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      icon: UserX,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/10 to-orange-600/10",
    },
  ];

  return (
    <ProtectedRoute requiredRole="superadmin">
      <div className="flex-1 space-y-6 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <Users className="h-5 w-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                User Management
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage system users and assign provinces to administrators
            </p>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Add User button clicked');
              setCreateDialogOpen(true);
            }}
            className="gap-2 shadow-md hover:shadow-lg transition-shadow relative z-10"
            size="lg"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Loading skeleton for stats
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
                <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Users Table Card */}
        <Card className="shadow-md">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">All Users</CardTitle>
              <span className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `${users.length} users`}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              // Loading skeleton for table
              <div className="space-y-4 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <UserTable users={users} onRefresh={fetchUsers} />
            )}
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plus className="h-4 w-4" />
                </div>
                Create New User
              </DialogTitle>
            </DialogHeader>
            <UserForm
              onSuccess={() => {
                setCreateDialogOpen(false);
                fetchUsers();
              }}
              onCancel={() => setCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
