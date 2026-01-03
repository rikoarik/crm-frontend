"use client"

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Username</label>
                                <div className="text-sm">{user?.username || '-'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <div className="text-sm">{user?.email || '-'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <div>
                                    <Badge variant={user?.role === 'superadmin' ? 'default' : 'secondary'}>
                                        {user?.role || '-'}
                                    </Badge>
                                </div>
                            </div>
                            {user?.province && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Province</label>
                                    <div>
                                        <Badge variant="outline">
                                            {user.province.name}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Information</CardTitle>
                            <CardDescription>Application details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Version</label>
                                <div className="text-sm">1.0.0</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Environment</label>
                                <div className="text-sm">Development</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}

