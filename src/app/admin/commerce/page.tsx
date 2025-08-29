/** biome-ignore-all lint/style/noMagicNumbers: TODO Mock Data */
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockAdminOrders, mockAdminUsers } from '@/data/admin-mock';
import { mockProducts } from '@/data/mock-data';

export default function AdminCommercePage() {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const products = mockProducts;
  const users = mockAdminUsers;
  const orders = mockAdminOrders;

  const start = (page - 1) * perPage;
  const end = start + perPage;

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="rounded-none">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Users</CardTitle>
              <CardDescription>
                Manage customer and staff accounts
              </CardDescription>
            </div>
            <Button className="rounded-none">Invite user</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(start, end).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {u.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge className="rounded-none" variant="secondary">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {u.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
                {[1, 2, 3].map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink
                      href="#"
                      isActive={page === n}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(n);
                      }}
                    >
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => p + 1);
                  }}
                />
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Inventory</CardTitle>
                <CardDescription>Add or remove stock</CardDescription>
              </div>
              <Button className="rounded-none md:hidden" variant="outline">
                Adjust stock
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.slice(0, 10).map((p) => (
                    <TableRow key={p._id}>
                      <TableCell className="whitespace-nowrap font-medium">
                        {p.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.sku ?? '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {p.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        <ContextMenu>
                          <ContextMenuTrigger asChild>
                            <Button
                              className="rounded-none"
                              size="sm"
                              variant="outline"
                            >
                              Actions
                            </Button>
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem>Increase 10</ContextMenuItem>
                            <ContextMenuItem>Decrease 10</ContextMenuItem>
                            <ContextMenuItem variant="destructive">
                              Mark out of stock
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base">Orders</CardTitle>
            <CardDescription>Recent order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 10).map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="whitespace-nowrap font-medium">
                        {o.id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {o.status}
                      </TableCell>
                      <TableCell className="text-right">
                        ${o.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator />
    </div>
  );
}
