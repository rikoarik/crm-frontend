"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { provincesApi } from "@/lib/api/provinces";
import { usersApi } from "@/lib/api/users";
import { Province } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AssignProvinceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentProvinceId?: string;
  onSuccess: () => void;
}

export function AssignProvinceDialog({
  open,
  onOpenChange,
  userId,
  currentProvinceId,
  onSuccess,
}: AssignProvinceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(currentProvinceId || "");

  useEffect(() => {
    if (open) {
      async function fetchProvinces() {
        try {
          const data = await provincesApi.getAllProvinces();
          setProvinces(data);
          setSelectedProvinceId(currentProvinceId || "");
        } catch (error: any) {
          toast.error("Failed to load provinces");
        }
      }
      fetchProvinces();
    }
  }, [open, currentProvinceId]);

  const handleAssign = async () => {
    if (!selectedProvinceId) {
      toast.error("Please select a province");
      return;
    }

    setLoading(true);
    try {
      await usersApi.assignProvince(userId, selectedProvinceId);
      toast.success("Province assigned successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to assign province");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Province</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Province</label>
            <Select
              value={selectedProvinceId}
              onValueChange={setSelectedProvinceId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={loading || !selectedProvinceId}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

