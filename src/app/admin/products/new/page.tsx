'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

type ImageField = { id: string; url: string };
type TagField = { id: string; value: string };

export default function AdminNewProductPage() {
  const [images, setImages] = useState<ImageField[]>([
    { id: crypto.randomUUID(), url: '' },
  ]);

  const [tags, setTags] = useState<TagField[]>([]);

  const addImage = () =>
    setImages((prev) => [...prev, { id: crypto.randomUUID(), url: '' }]);

  const removeImage = (id: string) =>
    setImages((prev) => prev.filter((i) => i.id !== id));

  const updateImage = (id: string, url: string) =>
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, url } : i)));

  const addTag = (value: string) => {
    const v = value.trim();

    if (!v) {
      return;
    }
    setTags((prev) =>
      prev.some((t) => t.value.toLowerCase() === v.toLowerCase())
        ? prev
        : [...prev, { id: crypto.randomUUID(), value: v }]
    );
  };

  const removeTag = (id: string) =>
    setTags((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Card className="rounded-none xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Add new product</CardTitle>
          <CardDescription>
            Provide product details. This is static UI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs" htmlFor="name">
                Name
              </Label>
              <Input
                className="rounded-none"
                id="name"
                placeholder="e.g. Crimson Scallop Plate"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs" htmlFor="sku">
                SKU
              </Label>
              <Input
                className="rounded-none"
                id="sku"
                placeholder="e.g. CRIMSON-PLATE-001"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label
                className="text-muted-foreground text-xs"
                htmlFor="description"
              >
                Description
              </Label>
              <Textarea
                className="min-h-28 rounded-none"
                id="description"
                placeholder="Short description"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs" htmlFor="price">
                Selling price
              </Label>
              <Input
                className="rounded-none"
                id="price"
                min="0"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs" htmlFor="cost">
                Cost price
              </Label>
              <Input
                className="rounded-none"
                id="cost"
                min="0"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label
                className="text-muted-foreground text-xs"
                htmlFor="discount"
              >
                Discount %
              </Label>
              <Input
                className="rounded-none"
                id="discount"
                max="90"
                min="0"
                placeholder="0"
                step="1"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs" htmlFor="stock">
                Stock
              </Label>
              <Input
                className="rounded-none"
                id="stock"
                min="0"
                placeholder="e.g. 25"
                step="1"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Category</Label>
              <Select defaultValue="chinaware">
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chinaware">Chinaware</SelectItem>
                  <SelectItem value="cutleries">Cutleries</SelectItem>
                  <SelectItem value="glassware">Glassware</SelectItem>
                  <SelectItem value="kitchen-utensils">
                    Kitchen utensils
                  </SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Brand</Label>
              <Input className="rounded-none" placeholder="e.g. Oryx" />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">
                Images (URLs)
              </Label>
              <div className="space-y-2">
                {images.map((img, idx) => (
                  <div className="flex items-center gap-2" key={img.id}>
                    <Input
                      className="rounded-none"
                      onChange={(e) => updateImage(img.id, e.target.value)}
                      placeholder={`https://.../image-${idx + 1}.png`}
                      value={img.url}
                    />
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          className="rounded-none"
                          size="sm"
                          variant="outline"
                        >
                          Preview
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="rounded-none" side="right">
                        <SheetHeader>
                          <SheetTitle>Image preview</SheetTitle>
                        </SheetHeader>
                        <div className="px-4 py-2 text-muted-foreground text-sm">
                          {img.url ? (
                            // biome-ignore lint/nursery/useImageSize: WILL REPLACE
                            // biome-ignore lint/performance/noImgElement: WILL REPLACE
                            <img
                              alt="preview"
                              className="mt-2 w-full border"
                              src={img.url}
                            />
                          ) : (
                            'Provide an image URL to preview.'
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                    {images.length > 1 && (
                      <Button
                        className="rounded-none"
                        onClick={() => removeImage(img.id)}
                        size="sm"
                        variant="outline"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  className="rounded-none"
                  onClick={addImage}
                  size="sm"
                  variant="outline"
                >
                  Add image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="rounded-none"
                  id="new-tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  placeholder="e.g. featured"
                />
                <Button
                  className="rounded-none"
                  onClick={() => {
                    const el = document.getElementById(
                      'new-tag'
                    ) as HTMLInputElement | null;
                    if (el) {
                      addTag(el.value);
                      el.value = '';
                    }
                  }}
                  size="sm"
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 && (
                  <span className="text-muted-foreground text-xs">
                    No tags yet
                  </span>
                )}
                {tags.map((tag) => (
                  <Badge
                    className="rounded-none"
                    key={tag.id}
                    variant="secondary"
                  >
                    <span>{tag.value}</span>
                    <button
                      className="ml-2 text-xs underline"
                      onClick={() => removeTag(tag.id)}
                      type="button"
                    >
                      remove
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button className="rounded-none" variant="outline">
            Discard
          </Button>
          <Button className="rounded-none">Save draft</Button>
          <Button className="rounded-none">Publish</Button>
        </CardFooter>
      </Card>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-base">Advanced</CardTitle>
          <CardDescription>Dimensions, warranty, material</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label
                  className="text-muted-foreground text-xs"
                  htmlFor="length"
                >
                  Length (cm)
                </Label>
                <Input
                  className="rounded-none"
                  id="length"
                  min="0"
                  step="0.1"
                  type="number"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-muted-foreground text-xs"
                  htmlFor="width"
                >
                  Width (cm)
                </Label>
                <Input
                  className="rounded-none"
                  id="width"
                  min="0"
                  step="0.1"
                  type="number"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-muted-foreground text-xs"
                  htmlFor="height"
                >
                  Height (cm)
                </Label>
                <Input
                  className="rounded-none"
                  id="height"
                  min="0"
                  step="0.1"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs" htmlFor="weight">
                Weight (kg)
              </Label>
              <Input
                className="rounded-none"
                id="weight"
                min="0"
                step="0.01"
                type="number"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="text-muted-foreground text-xs"
                htmlFor="material"
              >
                Material
              </Label>
              <Input
                className="rounded-none"
                id="material"
                placeholder="e.g. Porcelain"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="text-muted-foreground text-xs"
                htmlFor="warranty"
              >
                Warranty
              </Label>
              <Input
                className="rounded-none"
                id="warranty"
                placeholder="e.g. 3 years"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
