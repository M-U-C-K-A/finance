"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Coins, Plus, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: {
    balance: number;
    monthlyCredits: number;
    lastRecharge: Date | null;
  } | null;
  subscription: {
    plan: string;
    isActive: boolean;
    apiAccess: boolean;
  } | null;
}

export default function AdminCreditsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/credits");
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

  const handleAddCredits = async () => {
    if (!selectedUser || !creditAmount || parseInt(creditAmount) <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseInt(creditAmount),
          description: description || undefined,
        }),
      });

      if (response.ok) {
        toast.success(`Added ${creditAmount} credits to ${selectedUser.name}`);
        setDialogOpen(false);
        setCreditAmount("");
        setDescription("");
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add credits");
      }
    } catch {
      toast.error("Error adding credits");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Credit Management</h1>
        <p className="text-muted-foreground">Manage user credits and balances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            User Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Monthly Credits</TableHead>
                <TableHead>Last Recharge</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.subscription?.isActive ? 'default' : 'secondary'}>
                      {user.subscription?.plan || 'FREE'}
                    </Badge>
                    {user.subscription?.apiAccess && (
                      <Badge variant="outline" className="ml-1">API</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-lg">
                      {user.credits?.balance || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.credits?.monthlyCredits || 0}
                  </TableCell>
                  <TableCell>
                    {user.credits?.lastRecharge 
                      ? new Date(user.credits.lastRecharge).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <Dialog open={dialogOpen && selectedUser?.id === user.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Credits
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Credits to {user.name}</DialogTitle>
                          <DialogDescription>
                            Add credits to {user.email}. Current balance: {user.credits?.balance || 0} credits.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="credit-amount">Credit Amount</Label>
                            <Input
                              id="credit-amount"
                              type="number"
                              placeholder="Enter amount"
                              value={creditAmount}
                              onChange={(e) => setCreditAmount(e.target.value)}
                              min="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                              id="description"
                              placeholder="e.g., Admin bonus, promotional credits"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddCredits} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Add Credits
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