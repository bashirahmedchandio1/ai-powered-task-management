"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Toaster } from "react-hot-toast";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            <Toaster position="top-right" />
            {/* Sidebar - Fixed width on Desktop */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <div className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
                {children}
            </div>
        </div>
    );
}
