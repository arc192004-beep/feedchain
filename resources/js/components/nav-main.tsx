import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

/**
 * Compares a nav item URL against the current Inertia URL (path + query),
 * tolerating both absolute and relative URLs without relying on `window`
 * (so it stays SSR-safe).
 */
function isItemActive(itemUrl: string, currentUrl: string): boolean {
    try {
        const item = new URL(itemUrl, 'http://localhost');
        const current = new URL(currentUrl, 'http://localhost');
        return item.pathname === current.pathname && item.search === current.search;
    } catch {
        return itemUrl === currentUrl;
    }
}

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[]; label?: string }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-1">
            <SidebarGroupLabel className="text-sidebar-foreground/45 px-2 text-[10.5px] font-semibold tracking-[0.14em] uppercase">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const isActive = item.isActive ?? isItemActive(item.url, page.url);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={item.title}
                                className="font-medium relative h-9 gap-3 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:before:absolute data-[active=true]:before:top-1/2 data-[active=true]:before:left-0 data-[active=true]:before:h-4 data-[active=true]:before:w-[3px] data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:content-['']"
                            >
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}