// components/ActiveSessionsCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ActiveSessionsCard() {
  const sessions = [
    {
      id: '1',
      device: 'MacBook Pro (Chrome)',
      location: 'Paris, France',
      ip: '192.158.1.38',
      lastActive: '2023-10-12T14:30:00Z',
      current: true
    },
    {
      id: '2',
      device: 'iPhone 13 (Safari)',
      location: 'Lyon, France',
      ip: '192.158.1.39',
      lastActive: '2023-10-10T09:15:00Z',
      current: false
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage and review devices that are currently or recently logged in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.device}</TableCell>
                <TableCell>{session.location}</TableCell>
                <TableCell>
                  {new Date(session.lastActive).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {session.current ? (
                    <Badge variant="default">Current</Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Revoke
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
