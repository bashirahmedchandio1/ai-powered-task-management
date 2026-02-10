"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    CheckSquare,
    Menu,
    X,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface SidebarProps {
    className?: string;
}

export function DashboardSidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            title: "Tasks",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ];

    const handleLogout = () => {
        document.cookie = "auth_token=; path=/; max-age=0";
        toast.success("Logged out successfully");
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden bg-background/50 backdrop-blur-sm border border-border"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full",
                className
            )}>
                <div className="flex h-full flex-col px-4 py-6">
                    {/* Logo Section */}
                    <Link href="/" className="mb-10 flex items-center gap-3 px-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20">
                            <CheckSquare className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                            TaskFlow
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    <nav className="flex-1 space-y-1">
                        <div className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                            Overview
                        </div>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-accent text-accent-foreground shadow-md shadow-accent/10"
                                            : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent"
                                    )} />
                                    {item.title}
                                    {isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-foreground/50" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section / Bottom Actions */}
                    <div className="mt-auto space-y-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                                <User className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold">Workspace</p>
                                <p className="truncate text-[10px] text-muted-foreground">Free Tier</p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
                        >
                            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
