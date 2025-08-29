/** biome-ignore-all lint/style/noMagicNumbers: TODO Mock Data */
'use client';

import { useState } from 'react';
import { ChartAreaInteractive } from '@/components/admin/chart-area-interactive';
import { SectionCards } from '@/components/admin/section-cards';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockAdminOrders } from '@/data/admin-mock';
import { getTrendingProducts } from '@/data/mock-data';

export default function AdminOverviewPage() {
  const [loading, _setLoading] = useState(false);
  const trending = getTrendingProducts().slice(0, 4);
  const pendingOrders = mockAdminOrders.filter((o) => o.status === 'pending');

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Card className="rounded-none xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
          <CardDescription>Key metrics</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <SectionCards />
        </CardContent>
      </Card>

      <Card className="rounded-none xl:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Pending orders</CardTitle>
              <CardDescription>
                Most recent orders awaiting action
              </CardDescription>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="rounded-none" variant="outline">
                  Create manual order
                </Button>
              </SheetTrigger>
              <SheetContent className="rounded-none" side="right">
                <SheetHeader>
                  <SheetTitle>Manual order</SheetTitle>
                </SheetHeader>
                <div className="px-4 text-muted-foreground text-sm">
                  Static UI for now.
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  pendingOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{o.customerName}</span>
                          <span className="text-muted-foreground text-xs">
                            {o.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-none" variant="secondary">
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${o.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious href="#" />
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationNext href="#" />
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <ChartAreaInteractive />

      <Card className="rounded-none xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Trending showcase</CardTitle>
          <CardDescription>
            Products highlighted on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {trending.map((p) => (
              <div className="border p-3" key={p._id}>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="line-clamp-2 text-muted-foreground text-xs">
                  {p.description}
                </div>
                <Separator className="my-2" />
                <div className="text-xs">${p.sellingPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
