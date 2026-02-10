'use client';

import { useState, useEffect } from 'react';
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
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setLoading(true);

        try {
            const res = await api.post('/auth/login', {
                email: values.email,
                password: values.password,
            });

            const data = res.data;

            // Set cookie for middleware access
            document.cookie = `auth_token=${data.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=lax`;

            toast.success('Logged in successfully!');
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            let message = 'Login failed';
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

    if (!mounted) return null;

    return (
        <div className="relative flex min-h-screen flex-col bg-background py-10">
            <Header />

            <main className="relative flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
                {/* Background effects matching homepage Hero */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
                <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

                <div className="relative z-10 w-full max-w-[450px] animate-fade-up">
                    <div className="mb-10 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm backdrop-blur-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                            <span className="text-muted-foreground font-medium">
                                Secure Access
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
                            Welcome <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">Back</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Enter your credentials to continue managing your tasks.
                        </p>
                    </div>

                    <Card className="border-border bg-card/60 shadow-2xl backdrop-blur-md">
                        <CardHeader className="space-y-1 pb-10 pt-10 text-center">
                            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
                            <CardDescription className="text-base text-muted-foreground">
                                Use your email and password to log in
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 sm:px-12">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                                <FormMessage className="font-medium text-destructive/90" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Password</FormLabel>
                                                    <Link href="#" className="text-xs font-bold text-accent transition-all hover:text-accent/80 hover:underline">
                                                        Forgot?
                                                    </Link>
                                                </div>
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
                                                <FormMessage className="font-medium text-destructive/90" />
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
                                                <span className="font-bold uppercase tracking-widest">Verifying...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 font-bold uppercase tracking-widest">
                                                Sign In
                                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                        <CardFooter className="flex-col gap-8 border-t border-border/40 bg-secondary/5 px-8 py-10 sm:px-12 rounded-b-xl">
                            <div className="text-center text-base">
                                <span className="text-muted-foreground">New to TaskFlow?</span>{' '}
                                <Link href="/signup" className="font-extrabold text-accent transition-all hover:text-accent/80 hover:underline">
                                    Create Free Account
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>

                    <div className="mt-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            Protected by industry-standard encryption.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
