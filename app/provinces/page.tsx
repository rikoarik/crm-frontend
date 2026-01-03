"use client"

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { provincesApi } from "@/lib/api/provinces";
import { Province } from "@/lib/types";
import { toast } from "sonner";
import { Loader2, Database } from "lucide-react";

export default function ProvincesPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const data = await provincesApi.getAllProvinces();
      setProvinces(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load provinces");
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will seed 34 provinces of Indonesia. Continue?")) {
      return;
    }

    setSeeding(true);
    try {
      const result = await provincesApi.seedProvinces();
      toast.success(result.message);
      fetchProvinces();
    } catch (error: any) {
      toast.error(error.message || "Failed to seed provinces");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="superadmin">
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Provinces Management</h2>
            <p className="text-muted-foreground">
              Manage provinces data for Indonesia (34 provinces).
            </p>
          </div>
          <Button onClick={handleSeed} disabled={seeding || provinces.length > 0}>
            {seeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Database className="mr-2 h-4 w-4" />
            Seed Provinces
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading provinces...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {provinces.map((province) => (
              <Card key={province.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{province.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Code: {province.code}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {provinces.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>No provinces found. Click "Seed Provinces" to add 34 provinces of Indonesia.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}

