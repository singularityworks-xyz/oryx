/** biome-ignore-all lint/style/noMagicNumbers: TODO Mock Data */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockFooterLinks, mockSearchRecommendations } from '@/data/admin-mock';
import { mockProducts } from '@/data/mock-data';

export default function AdminContentPage() {
  const homepage = mockProducts
    .filter((p) => p.tags.includes('homepage'))
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-base">Homepage products</CardTitle>
          <CardDescription>
            Curate featured products for the hero & sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homepage.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>${p.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell className="space-x-1">
                      {p.tags.map((t) => (
                        <Badge
                          className="rounded-none"
                          key={t}
                          variant="secondary"
                        >
                          {t}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        className="rounded-none"
                        size="sm"
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="rounded-none">Add products</Button>
              </SheetTrigger>
              <SheetContent className="rounded-none" side="right">
                <SheetHeader>
                  <SheetTitle>Add homepage products</SheetTitle>
                </SheetHeader>
                <div className="px-4 text-muted-foreground text-sm">
                  Static UI for now.
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-base">Search recommendations</CardTitle>
          <CardDescription>Pre-fill popular searches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockSearchRecommendations.map((r, _i) => (
              <div className="flex items-center gap-2" key={r}>
                <Input className="rounded-none" defaultValue={r} />
                <Button className="rounded-none" size="sm" variant="outline">
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                className="rounded-none"
                placeholder="Add recommendation"
              />
              <Button className="rounded-none" size="sm">
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">About page</CardTitle>
          <CardDescription>Edit the about text & media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Headline</Label>
              <Input
                className="rounded-none"
                defaultValue="Crafted for timeless tables"
              />
              <Label className="text-muted-foreground text-xs">Subtitle</Label>
              <Input
                className="rounded-none"
                defaultValue="Premium dinnerware, minimal design"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Body</Label>
              <textarea
                className="min-h-32 w-full rounded-none border bg-transparent p-2 text-sm"
                defaultValue="Static mock text for about page..."
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-end gap-2">
            <Button className="rounded-none" variant="outline">
              Reset
            </Button>
            <Button className="rounded-none">Save</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Footer social links</CardTitle>
          <CardDescription>Manage social links in the footer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFooterLinks.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.label}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.url}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        className="rounded-none"
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
