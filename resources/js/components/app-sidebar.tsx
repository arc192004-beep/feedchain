import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ChartNoAxesCombined,
    Factory,
    FileBarChart,
    LayoutDashboard,
    LogOut,
    Settings,
    ShoppingCart,
    TrendingUp,
    Truck,
    Users,
    Warehouse,
} from 'lucide-react';
import AppLogo from './app-logo';

function getNavForRole(role?: string): NavGroup[] {
    const platform = (items: NavItem[]): NavGroup[] => [{ title: 'Platform', items }];

    if (!role) {
        return platform([{ title: 'Dashboard', url: route('feedchain.dashboard'), icon: LayoutDashboard }]);
    }

    if (role === 'super_admin') {
        return [
            {
                title: 'Platform',
                items: [
                    { title: 'System Dashboard', url: route('dashboard.super_admin'), icon: LayoutDashboard },
                    { title: 'User & Role Management', url: route('users.index'), icon: Users },
                ],
            },
            {
                title: 'System',
                items: [{ title: 'Settings', url: '/settings', icon: Settings }],
            },
        ];
    }

    if (role === 'administrator') {
        return [
            {
                title: 'Platform',
                items: [{ title: 'Dashboard', url: route('feedchain.dashboard'), icon: LayoutDashboard }],
            },
            {
                title: 'Analytics',
                items: [
                    { title: 'Analytics', url: route('feedchain.dashboard', { tab: 'analytics' }), icon: ChartNoAxesCombined },
                    { title: 'Reports', url: route('feedchain.dashboard', { tab: 'reports' }), icon: FileBarChart },
                ],
            },
        ];
    }

    if (role === 'production_manager') {
        return [
            {
                title: 'Platform',
                items: [
                    { title: 'Dashboard', url: route('feedchain.dashboard'), icon: LayoutDashboard },
                    { title: 'Production', url: route('feedchain.dashboard', { tab: 'production' }), icon: Factory },
                    { title: 'Inventory', url: route('feedchain.dashboard', { tab: 'inventory' }), icon: Warehouse },
                    { title: 'Distribution', url: route('feedchain.dashboard', { tab: 'distribution' }), icon: Truck },
                    { title: 'Customer Sales', url: route('feedchain.dashboard', { tab: 'customer_sales' }), icon: ShoppingCart },
                ],
            },
            {
                title: 'Analytics',
                items: [
                    { title: 'Forecast', url: route('feedchain.dashboard', { tab: 'forecast' }), icon: TrendingUp },
                    { title: 'Reports', url: route('feedchain.dashboard', { tab: 'reports' }), icon: FileBarChart },
                    { title: 'Analytics', url: route('feedchain.dashboard', { tab: 'analytics' }), icon: ChartNoAxesCombined },
                ],
            },
            {
                title: 'System',
                items: [{ title: 'Settings', url: '/settings', icon: Settings }],
            },
        ];
    }

    return platform([{ title: 'Dashboard', url: route('feedchain.dashboard'), icon: LayoutDashboard }]);
}

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role: string | undefined = auth?.user?.role;
    // Preserve existing role-based visibility: administrators do not see the profile block.
    const isMonitoringAdmin = role === 'administrator';
    const navGroups = getNavForRole(role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-sidebar-border/60 border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={route('feedchain.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => (
                    <NavMain key={group.title} items={group.items} label={group.title} />
                ))}
            </SidebarContent>

            <SidebarFooter className="border-sidebar-border/60 border-t">
                {!isMonitoringAdmin && <NavUser />}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Log out"
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
                        >
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