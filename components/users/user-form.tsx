"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, CreateUserDto, UpdateUserDto } from "@/lib/types";
import { provincesApi } from "@/lib/api/provinces";
import { Province } from "@/lib/types";
import { Loader2, Eye, EyeOff, Shield, UserIcon, Mail, Lock, MapPin } from "lucide-react";
import { toast } from "sonner";

interface UserFormProps {
  initialData?: User;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    email: initialData?.email || "",
    password: "",
    role: (initialData?.role || "admin") as "superadmin" | "admin",
    provinceId: initialData?.provinceId || "",
  });

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const data = await provincesApi.getAllProvinces();
        setProvinces(data);
      } catch (error: any) {
        toast.error("Failed to load provinces");
      }
    }
    fetchProvinces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate provinceId for admin role
    if (formData.role === "admin" && !formData.provinceId) {
      toast.error("Please select a province for admin role");
      return;
    }

    // Validate password for new user
    if (!initialData && !formData.password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const { usersApi } = await import("@/lib/api/users");

      if (initialData) {
        const updateData: UpdateUserDto = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          provinceId: formData.provinceId || undefined,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        await usersApi.updateUser(initialData.id, updateData);
        toast.success("User updated successfully");
      } else {
        const createData: CreateUserDto = {
          username: formData.username,
          email: formData.email || undefined,
          password: formData.password,
          role: formData.role,
          provinceId: formData.role === "admin" ? (formData.provinceId || undefined) : undefined,
        };

        await usersApi.createUser(createData);
        toast.success("User created successfully");
      }

      onSuccess();
    } catch (error: any) {
      console.error("User creation/update error:", error);
      toast.error(error.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <UserIcon className="h-4 w-4" />
          <span>Account Information</span>
        </div>
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
              <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
              Username <span className="text-destructive">*</span>
            </label>
            <Input
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              Password
              {initialData ? (
                <span className="text-xs text-muted-foreground">(leave empty to keep current)</span>
              ) : (
                <span className="text-destructive">*</span>
              )}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={initialData ? "••••••••" : "Enter password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!initialData}
                minLength={6}
                className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Access Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Role & Access</span>
        </div>
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
              Role <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.role}
              onValueChange={(value: "superadmin" | "admin") =>
                setFormData({ ...formData, role: value, provinceId: value === "superadmin" ? "" : formData.provinceId })
              }
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      <Shield className="h-3 w-3" />
                    </div>
                    <span>Superadmin</span>
                    <span className="text-xs text-muted-foreground">- Full access</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <UserIcon className="h-3 w-3" />
                    </div>
                    <span>Admin</span>
                    <span className="text-xs text-muted-foreground">- Province limited</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === "admin" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
              <label htmlFor="provinceId" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Province <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.provinceId}
                onValueChange={(value) => setFormData({ ...formData, provinceId: value })}
              >
                <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {province.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Admin will only be able to manage leads in this province
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[120px] gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
