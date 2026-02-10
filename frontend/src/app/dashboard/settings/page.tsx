"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { User, Mail, Save, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>({ username: "", email: "", id: "", created_at: "" });
    const [form, setForm] = useState({ username: "", email: "" });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get("/auth/me");
            setUser(response.data);
            setForm({
                username: response.data.username,
                email: response.data.email,
            });
        } catch (error: any) {
            console.error("Failed to fetch user data", error);
            if (error.response?.status === 401) {
                router.push("/login");
            } else {
                toast.error("Failed to load profile data");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.username.trim() || !form.email.trim()) {
            toast.error("Both username and email are required");
            return;
        }

        if (form.username === user.username && form.email === user.email) {
            toast.success("No changes detected");
            return;
        }

        setSaving(true);
        try {
            const response = await api.patch("/auth/me", form);
            setUser(response.data);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const message = error.response?.data?.detail || "Failed to update profile";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex items-center gap-3">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    <span className="text-lg text-muted-foreground">Loading settings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
                        Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and profile information
                    </p>
                </div>
                <Link href="/dashboard">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tasks
                    </Button>
                </Link>
            </div>

            <div className="grid gap-8">
                {/* Profile Information */}
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-accent" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            Update your display name and email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Display Name
                                </Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-focus-within:text-accent" />
                                    <Input
                                        id="username"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        className="h-12 pl-12 bg-background/50"
                                        placeholder="Your username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Email Address
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-focus-within:text-accent" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="h-12 pl-12 bg-background/50"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security / Account Details (Read-only for now) */}
                <Card className="border-border bg-card/50 backdrop-blur-sm opacity-80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Security & Account
                        </CardTitle>
                        <CardDescription>
                            Account status and security details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">Account Status</span>
                            <span className="text-sm font-medium text-emerald-500">Active</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">User ID</span>
                            <span className="text-xs font-mono text-muted-foreground/50">{user.id ? user.id.substring(0, 8) + '...' : 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Member Since</span>
                            <span className="text-sm text-muted-foreground">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 px-6 py-4 rounded-b-xl">
                        <p className="text-xs text-muted-foreground">
                            Password change and two-factor authentication coming soon.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
