'use client';

import { FileTextIcon, HomeIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionQuery } from '@/lib/session-query';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}): React.JSX.Element {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="rounded-none"
        isActive={pathname === href}
      >
        <Link className="flex items-center gap-2" href={href}>
          <Icon className="size-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, isPending } = useSessionQuery();
  const router = useRouter();
  useEffect(() => {
    document.body.classList.add('is-admin');
    return () => document.body.classList.remove('is-admin');
  }, []);

  useEffect(() => {
    if (!(isPending || session)) {
      router.replace('/auth/login');
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="p-6">
        <div className="h-6 w-24 animate-pulse bg-gray-200" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar className="top-16 border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="font-semibold text-sm">Oryx Admin</span>
            <SidebarMenuBadge className="top-2 right-2">v1</SidebarMenuBadge>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem
                  href="/admin/overview"
                  icon={HomeIcon}
                  label="Overview"
                />
                <NavItem
                  href="/admin/content"
                  icon={FileTextIcon}
                  label="Content"
                />
                <NavItem
                  href="/admin/commerce"
                  icon={ShoppingCartIcon}
                  label="Commerce"
                />
                <NavItem
                  href="/admin/products/new"
                  icon={FileTextIcon}
                  label="Add Product"
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <div className="px-2 pb-2 text-muted-foreground text-xs">
            Minimal, square-corner UI
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="overflow-hidden">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3">
          <SidebarTrigger />
          <Separator className="mx-2 h-6" orientation="vertical" />
          <div className="flex w-full items-center justify-between">
            <div className="line-clamp-1 font-medium text-sm">
              {breadcrumbFromPath(pathname)}
            </div>
            <Menubar className="hidden rounded-none md:flex">
              <MenubarMenu>
                <MenubarTrigger>Quick Actions</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>New banner (Sheet)</MenubarItem>
                  <MenubarItem>Invite admin</MenubarItem>
                  <MenubarItem>Export CSV</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Settings</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Preferences</MenubarItem>
                  <MenubarItem>Appearance</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </header>
        <ScrollArea className="h-[calc(100svh-7.5rem)]">
          <div className="container mx-auto px-3 py-4">{children}</div>
        </ScrollArea>
        <Toaster position="bottom-right" richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}

function breadcrumbFromPath(path: string | null): string {
  if (!path) {
    return 'Admin';
  }
  if (path === '/admin') {
    return 'Admin';
  }
  const parts = path.replace(/^\/+|\/+$/g, '').split('/');
  return parts.map(capitalize).join(' / ');
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
