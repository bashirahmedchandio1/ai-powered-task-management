"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar - Fixed width on Desktop */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <div className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
                {children}
            </div>
        </div>
    );
}
