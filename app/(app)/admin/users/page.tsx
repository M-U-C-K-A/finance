"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, Search, Filter, UserCheck, UserX, Shield, Loader2 } from "lucide-react";

//export const metadata = {
//  title: 'User Management - FinAnalytics Admin',
//  description: 'Manage user accounts, roles, and permissions.',
//};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  credits: {
    balance: number;
    monthlyCredits: number;
  } | null;
  subscription: {
    plan: string;
    isActive: boolean;
    apiAccess: boolean;
  } | null;
  _count: {
    reports: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [, setSelectedUser] = useState<User | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId: string, newRole: string) => {
    setIsPromoting(true);
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
        setSelectedUser(null);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update user role");
      }
    } catch {
      toast.error("Error updating user role");
    } finally {
      setIsPromoting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          User Management
        </h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({filteredUsers.length})</span>
            <Badge variant="secondary">
              {users.filter(u => u.role === 'ADMIN').length} Admins
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role === 'ADMIN' ? <Shield className="h-3 w-3 mr-1" /> : null}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.subscription ? (
                      <div>
                        <Badge variant={user.subscription.isActive ? 'default' : 'secondary'}>
                          {user.subscription.plan}
                        </Badge>
                        {user.subscription.apiAccess && (
                          <Badge variant="outline" className="ml-1 text-xs">API</Badge>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary">FREE</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">
                      {user.credits?.balance || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user._count.reports}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.emailVerified ? "default" : "destructive"} className="text-xs">
                      {user.emailVerified ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          Edit Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage User Role</DialogTitle>
                          <DialogDescription>
                            Change role for {user.name} ({user.email})
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">Current Role</div>
                              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Change to:</label>
                            <div className="flex gap-2">
                              <Button
                                variant={user.role === 'USER' ? 'secondary' : 'outline'}
                                onClick={() => handlePromoteUser(user.id, 'USER')}
                                disabled={isPromoting || user.role === 'USER'}
                              >
                                User
                              </Button>
                              <Button
                                variant={user.role === 'ADMIN' ? 'secondary' : 'outline'}
                                onClick={() => handlePromoteUser(user.id, 'ADMIN')}
                                disabled={isPromoting || user.role === 'ADMIN'}
                              >
                                {isPromoting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Admin
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedUser(null)}>
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
