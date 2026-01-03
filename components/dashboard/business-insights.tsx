"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BusinessInsight } from "@/lib/api/analytics"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"

interface BusinessInsightsProps {
  insights: BusinessInsight[]
  loading?: boolean
}

export function BusinessInsights({ insights, loading }: BusinessInsightsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No insights available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Business Insights by Type</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <Card key={insight.type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{insight.type}</CardTitle>
              <Badge variant={insight.conversionRate > 10 ? "default" : "secondary"}>
                {insight.conversionRate.toFixed(1)}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Leads</span>
                  <span className="text-sm font-semibold">{insight.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Deals Closed</span>
                  <span className="text-sm font-semibold">{insight.deal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Conversion Rate</span>
                  <div className="flex items-center gap-1">
                    {insight.conversionRate > 10 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-sm font-semibold">{insight.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Avg Days</span>
                  </div>
                  <span className="text-sm font-semibold">{insight.avgDaysToConversion.toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

