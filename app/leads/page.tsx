"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/leads/data-table";
import { columns } from "@/components/leads/columns";
import { AddLeadButton } from "@/components/leads/add-lead-button";
import { ViewToggle } from "@/components/leads/view-toggle";
import { KanbanBoard } from "@/components/leads/kanban-board";
import { Badge } from "@/components/ui/badge";
import { leadsApi, LeadsResponse } from "@/lib/api/leads";
import { Lead } from "@/lib/types";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

import { Suspense } from "react";

function LeadsContent() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'table';
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const { user } = useAuth();

    useEffect(() => {
        fetchLeads();
    }, [selectedProvince]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const params: any = {};

            // For superadmin, add province filter if selected
            if (user?.role === 'superadmin' && selectedProvince) {
                // Note: Backend will handle filtering, but we can add client-side filter too
                // For now, backend handles it automatically based on user role
            }

            const response = await leadsApi.getLeads(params);

            // Client-side filter by province if superadmin selected one
            let filteredLeads = response.data;
            if (user?.role === 'superadmin' && selectedProvince) {
                filteredLeads = response.data.filter(lead => lead.provinceId === selectedProvince);
            }

            setLeads(filteredLeads);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load leads");
            console.error("Leads error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await fetchLeads();
    };

    if (loading) {
        return (
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading leads...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-center h-64">
                    <p className="text-destructive">Error: {error}</p>
                    <button onClick={handleRefresh} className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads Management</h2>
                    <p className="text-muted-foreground">
                        View, filter, and manage your leads database.
                    </p>
                    {user && (
                        <div className="flex items-center gap-2 mt-2">
                            {user.role === 'admin' && user.province && (
                                <Badge variant="outline">
                                    Showing data for {user.province.name}
                                </Badge>
                            )}
                            {user.role === 'superadmin' && (
                                <Badge variant="outline">
                                    Showing all data
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <ViewToggle />
                    <AddLeadButton onSuccess={handleRefresh} />
                </div>
            </div>

            {view === 'board' ? (
                <KanbanBoard leads={leads} onUpdate={handleRefresh} />
            ) : (
                <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border shadow-sm">
                    <DataTable
                        columns={columns}
                        data={leads}
                        onRefresh={handleRefresh}
                        selectedProvince={selectedProvince}
                        onProvinceChange={setSelectedProvince}
                    />
                </div>
            )}
        </div>
    );
}

export default function LeadsPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }>
                <LeadsContent />
            </Suspense>
        </ProtectedRoute>
    );
}

