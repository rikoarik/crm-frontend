"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Users,
    LayoutDashboard,
    Settings,
    PieChart,
    Menu,
    LogOut,
    UserCog,
    MapPin,
    FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

const baseSidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Leads",
        href: "/leads",
        icon: Users,
    },
    {
        title: "Proposals",
        href: "/proposals",
        icon: FileText,
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: PieChart,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

const superadminItems = [
    {
        title: "Users",
        href: "/users",
        icon: UserCog,
    },
    {
        title: "Provinces",
        href: "/provinces",
        icon: MapPin,
    },
];

export function AppSidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth()

    const sidebarItems = [
        ...baseSidebarItems,
        ...(user?.role === 'superadmin' ? superadminItems : [])
    ];

    const baseItemsCount = baseSidebarItems.length;

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-sidebar md:block md:w-[240px] md:shrink-0 md:fixed md:inset-y-0 z-30">
                <SidebarContent pathname={pathname} setIsOpen={setIsOpen} user={user} onLogout={logout} sidebarItems={sidebarItems} baseItemsCount={baseItemsCount} />
            </div>

            {/* Mobile Topbar & Sheet */}
            <div className="md:hidden flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 fixed top-0 left-0 right-0 z-40">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[240px]">
                        <SidebarContent pathname={pathname} setIsOpen={setIsOpen} user={user} onLogout={logout} sidebarItems={sidebarItems} baseItemsCount={baseItemsCount} />
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2 font-bold text-lg">
                    <img 
                        src="/logo.png" 
                        alt="SaeProject" 
                        className="h-7 w-auto object-contain"
                    />
                    <span className="hidden sm:inline">SaeProject</span>
                </div>
            </div>
        </>
    )
}

function SidebarContent({ 
    pathname, 
    setIsOpen, 
    user, 
    onLogout,
    sidebarItems,
    baseItemsCount
}: { 
    pathname: string
    setIsOpen: (open: boolean) => void
    user: any
    onLogout: () => void | Promise<void>
    sidebarItems: typeof baseSidebarItems
    baseItemsCount: number
}) {
    // Check if current item is first superadmin item to show divider
    const shouldShowDivider = (index: number) => index === baseItemsCount && user?.role === 'superadmin';
    
    return (
        <div className="flex bg-sidebar h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sidebar-primary hover:opacity-80 transition-opacity">
                    <img 
                        src="/logo.png" 
                        alt="SaeProject" 
                        className="h-8 w-auto object-contain"
                    />
                    <span className="hidden sm:inline">SaeProject</span>
                </Link>
                <ThemeToggle />
            </div>
            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium lg:px-6 space-y-1">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        
                        return (
                            <div key={item.href}>
                                {shouldShowDivider(index) && (
                                    <div className="h-px bg-sidebar-border my-2 mx-3" />
                                )}
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    <span>{item.title}</span>
                                </Link>
                            </div>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t border-sidebar-border">
                {user ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="h-9 w-9 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-xs font-bold overflow-hidden">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-medium truncate" title={user.username}>
                                    {user.username}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Badge variant={user.role === 'superadmin' ? 'default' : 'secondary'} className="text-xs">
                                        {user.role}
                                    </Badge>
                                    {user.province && (
                                        <Badge variant="outline" className="text-xs">
                                            {user.province.name}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" 
                            onClick={() => {
                                onLogout();
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent rounded-md">
                        Login
                    </Link>
                )}
            </div>
        </div>
    )
}

