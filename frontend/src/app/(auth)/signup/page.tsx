'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const signupSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: SignupFormValues) => {
        setLoading(true);

        try {
            await api.post('/auth/signup', {
                email: values.email,
                username: values.username,
                password: values.password,
            });

            toast.success('Account created! Please sign in.');
            router.push('/login');
        } catch (err: any) {
            let message = 'Signup failed';
            if (err.response?.data?.detail) {
                if (typeof err.response.data.detail === 'string') {
                    message = err.response.data.detail;
                } else if (Array.isArray(err.response.data.detail)) {
                    message = err.response.data.detail.map((d: any) => d.msg).join(', ');
                }
            } else if (err.message) {
                message = err.message;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        "Instant cloud synchronization",
        "AI-driven task prioritization",
        "Minimalist distraction-free UI",
        "Team collaboration tools"
    ];

    if (!mounted) return null;

    return (
        <div className="relative flex min-h-screen flex-col bg-background py-10">
            <Header />

            <main className="relative flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
                <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

                <div className="relative z-10 w-full max-w-[500px] animate-fade-up">
                    <div className="mb-10 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm backdrop-blur-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                            <span className="text-muted-foreground font-medium">
                                Free Forever Tier
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
                            Start <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">Solving</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Join 50,000+ users who have regained control over their day.
                        </p>
                    </div>

                    <Card className="border-border bg-card/60 shadow-2xl backdrop-blur-md">
                        <CardHeader className="space-y-1 pb-10 pt-10 text-center">
                            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                            <CardDescription className="text-base text-muted-foreground">
                                No credit card required. Cancel anytime.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 sm:px-12">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Display Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-focus-within:text-accent group-focus-within:scale-110" />
                                                        <Input
                                                            placeholder="johndoe"
                                                            className="h-14 border-border/80 bg-background/40 pl-12 text-base transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 hover:border-accent/40 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Email Address</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-focus-within:text-accent group-focus-within:scale-110" />
                                                        <Input
                                                            type="email"
                                                            placeholder="name@example.com"
                                                            className="h-14 border-border/80 bg-background/40 pl-12 text-base transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 hover:border-accent/40 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Secret Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-focus-within:text-accent group-focus-within:scale-110" />
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            className="h-14 border-border/80 bg-background/40 pl-12 text-base transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 hover:border-accent/40 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="group h-14 w-full bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse-glow transition-all active:scale-[0.98] rounded-xl"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                                                <span className="font-bold uppercase tracking-widest">Building Account...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 font-bold uppercase tracking-widest">
                                                Create My Account
                                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-12 bg-secondary/20 p-6 rounded-2xl border border-border/30">
                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent/80 mb-4">Membership Perks</h4>
                                <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                                    {benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground/90">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-8 border-t border-border/40 bg-secondary/5 px-8 py-10 sm:px-12 rounded-b-xl">
                            <div className="text-center text-base">
                                <span className="text-muted-foreground transition-all">Already a member?</span>{' '}
                                <Link href="/login" className="font-extrabold text-accent transition-all hover:text-accent/80 hover:underline">
                                    Sign In Now
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>

                    <div className="mt-12 text-center">
                        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                            Sign up to experience the future of task management.
                            Secure, encrypted and local-first.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
