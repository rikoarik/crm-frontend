"use client"

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/leads/data-table";
import { columns } from "@/components/leads/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { leadsApi, StatsResponse, LeadsResponse } from "@/lib/api/leads";
import { analyticsApi } from "@/lib/api/analytics";
import { Lead } from "@/lib/types";
import { useAuth } from "@/lib/auth/auth-context";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AdvancedFilters, FilterState } from "@/components/dashboard/advanced-filters";
import { BusinessInsights } from "@/components/dashboard/business-insights";

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ cities: string[]; categories: string[] }>({ cities: [], categories: [] });
  const [filters, setFilters] = useState<FilterState>({});
  const [businessInsights, setBusinessInsights] = useState<any[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, leadsData, metaData] = await Promise.all([
        leadsApi.getStats(),
        leadsApi.getLeads({ limit: 5 }),
        leadsApi.getMeta(),
      ]);
      setStats(statsData);
      setLeads(leadsData.data);
      setMeta(metaData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const allLeads = await leadsApi.getLeads({ limit: 10000 });
      const csvContent = [
        ['Name', 'City', 'Category', 'Phone', 'Status', 'Created At'].join(','),
        ...allLeads.data.map((lead) =>
          [
            `"${lead.name}"`,
            `"${lead.city}"`,
            `"${lead.category}"`,
            `"${lead.phone || ''}"`,
            `"${lead.status}"`,
            `"${lead.created_at || ''}"`,
          ].join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Export error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBusinessInsights();
  }, []);

  const fetchBusinessInsights = async () => {
    try {
      setInsightsLoading(true);
      const insights = await analyticsApi.getBusinessInsights();
      setBusinessInsights(insights);
    } catch (err: any) {
      console.error("Failed to load business insights:", err);
    } finally {
      setInsightsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of your lead generation and conversion pipeline.
            </p>
            {user && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === 'superadmin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                {user.province && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="outline">{user.province.name}</Badge>
                  </>
                )}
                {user.role === 'superadmin' && (
                  <span className="text-sm text-muted-foreground">(All data)</span>
                )}
                {user.role === 'admin' && user.province && (
                  <span className="text-sm text-muted-foreground">
                    (Showing data for {user.province.name})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <QuickActions onExport={handleExport} />
          <AdvancedFilters
            categories={meta.categories}
            cities={meta.cities}
            onFilterChange={setFilters}
            initialFilters={filters}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error: {error}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats ? ((stats.total * 0.1).toFixed(0)) : 0} from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.contacted || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats && stats.total > 0 ? ((stats.contacted / stats.total) * 100).toFixed(1) : 0}% Coverage rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interested</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.interested || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Active opportunities
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.deal || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Revenue generated (Est.)
                  </p>
                </CardContent>
              </Card>
            </div>

            <BusinessInsights insights={businessInsights} loading={insightsLoading} />

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Leads (Last 5)</h3>
            </div>
            <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border shadow-sm">
              <DataTable
                columns={columns}
                data={leads}
                onRefresh={fetchData}
              />
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

