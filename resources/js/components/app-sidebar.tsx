import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Box, Package, Truck, BarChart, Settings, Database, Coins, TrendingUp, FileSpreadsheet, BarChart3, LogOut } from 'lucide-react';
import AppLogo from './app-logo';

function getNavForRole(role?: string): NavItem[] {
    const base = [
        { title: 'Dashboard', url: route('feedchain.dashboard'), icon: LayoutGrid },
    ];

    if (!role) return base;

    if (role === 'super_admin') {
        return [
            { title: 'System Dashboard', url: route('dashboard.super_admin'), icon: LayoutGrid },
            { title: 'User & Role Management', url: route('users.index'), icon: Users },
        ];
    }

    if (role === 'administrator') {
        return [
            ...base,
            { title: 'Analytics', url: route('feedchain.dashboard', { tab: 'analytics' }), icon: BarChart },
            { title: 'Reports', url: route('feedchain.dashboard', { tab: 'reports' }), icon: FileSpreadsheet },
        ];
    }

    if (role === 'production_manager') {
        return [
            ...base,
            { title: 'Production', url: route('feedchain.dashboard', { tab: 'production' }), icon: Truck },
            { title: 'Inventory', url: route('feedchain.dashboard', { tab: 'inventory' }), icon: Database },
            { title: 'Distribution', url: route('feedchain.dashboard', { tab: 'distribution' }), icon: Truck },
            { title: 'Customer Sales', url: route('feedchain.dashboard', { tab: 'customer_sales' }), icon: Coins },
            { title: 'Forecast', url: route('feedchain.dashboard', { tab: 'forecast' }), icon: TrendingUp },
            { title: 'Reports', url: route('feedchain.dashboard', { tab: 'reports' }), icon: FileSpreadsheet },
            { title: 'Analytics', url: route('feedchain.dashboard', { tab: 'analytics' }), icon: BarChart3 },
        ];
    }

    return base;
}

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role: string | undefined = auth?.user?.role;
    const isMonitoringAdmin = role === 'administrator';
    const mainNavItems = getNavForRole(role);
    const footerNavItems: NavItem[] = [
        { title: 'Settings', url: '/settings', icon: Settings },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('feedchain.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {!isMonitoringAdmin && <NavFooter items={footerNavItems} className="mt-auto" />}
                {!isMonitoringAdmin && <NavUser />}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Log out" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30">
                            <Link href={route('logout')} method="post" as="button" className="w-full">
                                <LogOut />
                                <span>Log out</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
