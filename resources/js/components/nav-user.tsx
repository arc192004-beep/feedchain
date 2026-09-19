import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
    super_admin: 'Super Administrator',
    administrator: 'Administrator',
    production_manager: 'Production Manager',
};

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const getInitials = useInitials();

    const user = auth.user;
    const roleLabel = (user.role && ROLE_LABELS[user.role]) || 'User';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            tooltip={user.name}
                            className="data-[state=open]:bg-sidebar-accent group h-14 rounded-xl data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="relative shrink-0">
                                <Avatar className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-sidebar-primary/20">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="border-sidebar-background absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-emerald-500" />
                            </div>
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-semibold">{user.name}</span>
                                <span className="text-sidebar-foreground/55 truncate text-[11px] font-medium">
                                    {roleLabel} · Online
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 opacity-60" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}