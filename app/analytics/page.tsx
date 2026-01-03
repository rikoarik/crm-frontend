"use client"

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyticsApi, CityDistribution, CategoryDistribution, StatusDistribution, ConversionFunnel, DetailedCategoryAnalytics, TrendData, BusinessInsight } from "@/lib/api/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useAuth } from "@/lib/auth/auth-context";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
    const [cityData, setCityData] = useState<CityDistribution[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
    const [statusData, setStatusData] = useState<StatusDistribution[]>([]);
    const [funnelData, setFunnelData] = useState<ConversionFunnel | null>(null);
    const [detailedCategories, setDetailedCategories] = useState<DetailedCategoryAnalytics[]>([]);
    const [trendsData, setTrendsData] = useState<TrendData[]>([]);
    const [businessInsights, setBusinessInsights] = useState<BusinessInsight[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchAnalytics();
    }, [startDate, endDate, selectedCategory]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [cities, categories, status, funnel, detailed, trends, insights] = await Promise.all([
                analyticsApi.getCityDistribution(),
                analyticsApi.getCategoryDistribution(),
                analyticsApi.getStatusDistribution(),
                analyticsApi.getConversionFunnel(),
                analyticsApi.getDetailedCategoryAnalytics(),
                analyticsApi.getTrends(startDate || undefined, endDate || undefined, selectedCategory === "All" ? undefined : selectedCategory),
                analyticsApi.getBusinessInsights(),
            ]);
            setCityData(cities);
            setCategoryData(categories);
            setStatusData(status);
            setFunnelData(funnel);
            setDetailedCategories(detailed);
            setTrendsData(trends);
            setBusinessInsights(insights);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load analytics");
            console.error("Analytics error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">
                        Insights into your lead generation and conversion metrics.
                    </p>
                    {user && (
                        <div className="flex items-center gap-2 mt-2">
                            {user.role === 'admin' && user.province && (
                                <Badge variant="outline">
                                    Data for {user.province.name}
                                </Badge>
                            )}
                            {user.role === 'superadmin' && (
                                <Badge variant="outline">
                                    All data
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Categories</SelectItem>
                                {categoryData.map((cat) => (
                                    <SelectItem key={cat.category} value={cat.category}>
                                        {cat.category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">Loading analytics...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-destructive">Error: {error}</p>
                    </div>
                ) : (
                    <>
                        {/* Conversion Funnel */}
                        {funnelData && (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{funnelData.new}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{funnelData.contacted}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {funnelData.new > 0 ? ((funnelData.contacted / funnelData.new) * 100).toFixed(1) : 0}% contact rate
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Interested</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{funnelData.interested}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {funnelData.new > 0 ? ((funnelData.interested / funnelData.new) * 100).toFixed(1) : 0}% interest rate
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{funnelData.deal}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {funnelData.conversionRate}% conversion rate
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* City Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Leads by City</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={cityData.slice(0, 10)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="city" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" fill="#0088FE" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Category Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Leads by Category</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Leads by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={statusData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="status" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#00C49F" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Trends Chart */}
                        {trendsData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Leads Over Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={trendsData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#0088FE" name="Total Leads" />
                                            <Line type="monotone" dataKey="deal" stroke="#00C49F" name="Deals" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Detailed Category Analytics */}
                        {detailedCategories.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Category Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={detailedCategories}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="total" fill="#8884d8" name="Total" />
                                            <Bar dataKey="deal" fill="#00C49F" name="Deals" />
                                            <Bar dataKey="conversionRate" fill="#FF8042" name="Conversion %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Business Insights */}
                        {businessInsights.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Business Type Insights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {businessInsights.map((insight) => (
                                            <div key={insight.type} className="p-4 border rounded-lg">
                                                <h4 className="font-semibold mb-2">{insight.type}</h4>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Total:</span>
                                                        <span className="font-medium">{insight.total}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Deals:</span>
                                                        <span className="font-medium">{insight.deal}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Conversion:</span>
                                                        <span className="font-medium">{insight.conversionRate.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Avg Days:</span>
                                                        <span className="font-medium">{insight.avgDaysToConversion.toFixed(0)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </ProtectedRoute>
    );
}
