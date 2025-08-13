// src/components/settings/security/loginHistoryData.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LoginHistoryCard() {
  const logins = [
    {
      id: '1',
      device: 'Windows (Firefox)',
      location: 'Marseille, France',
      ip: '192.158.1.40',
      date: '2023-10-05T16:45:00Z',
      status: 'Success'
    },
    {
      id: '2',
      device: 'Unknown',
      location: 'Berlin, Germany',
      ip: '192.158.1.41',
      date: '2023-09-28T03:20:00Z',
      status: 'Failed'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>
          Review recent login attempts to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logins.map((login) => (
              <TableRow key={login.id}>
                <TableCell>{login.device}</TableCell>
                <TableCell>{login.location}</TableCell>
                <TableCell>{login.ip}</TableCell>
                <TableCell>
                  {new Date(login.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  {login.status === 'Success' ? (
                    <Badge variant="success">Success</Badge>
                  ) : (
                    <Badge variant="destructive">Failed</Badge>
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
