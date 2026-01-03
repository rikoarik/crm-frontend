"use client"

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, MapPin, Shield, User as UserIcon, Users } from "lucide-react";
import { User } from "@/lib/types";
import { usersApi } from "@/lib/api/users";
import { toast } from "sonner";
import { UserForm } from "./user-form";
import { AssignProvinceDialog } from "./assign-province-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
}

// Generate avatar color based on username
function getAvatarColor(name: string): string {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-emerald-500 to-emerald-600",
    "from-orange-500 to-orange-600",
    "from-cyan-500 to-cyan-600",
    "from-indigo-500 to-indigo-600",
    "from-rose-500 to-rose-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Get initials from username
function getInitials(name: string): string {
  return name
    .split(/[\s_-]/)
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || name.slice(0, 2).toUpperCase();
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [assigningProvince, setAssigningProvince] = useState<User | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await usersApi.deleteUser(id);
      toast.success("User deleted successfully");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  return (
    <>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Province</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">No users found</p>
                      <p className="text-sm text-muted-foreground">
                        Get started by adding your first user
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(user.username)} text-white font-medium shadow-sm`}>
                        {getInitials(user.username)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-sm text-muted-foreground">
                          {user.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === "superadmin" ? (
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 gap-1 shadow-sm">
                        <Shield className="h-3 w-3" />
                        Superadmin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <UserIcon className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.provinces ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{user.provinces.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                      <span className={`text-sm font-medium ${user.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        {user.role === "admin" && (
                          <DropdownMenuItem
                            onClick={() => setAssigningProvince(user)}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Assign Province
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Pencil className="h-4 w-4" />
              </div>
              Edit User
            </DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              initialData={editingUser}
              onSuccess={() => {
                setEditingUser(null);
                onRefresh();
              }}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {assigningProvince && (
        <AssignProvinceDialog
          open={!!assigningProvince}
          onOpenChange={(open) => !open && setAssigningProvince(null)}
          userId={assigningProvince.id}
          currentProvinceId={assigningProvince.provinceId}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
