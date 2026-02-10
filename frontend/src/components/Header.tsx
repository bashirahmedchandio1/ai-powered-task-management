"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <CheckSquare className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Taskflow</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#showcase"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Showcase
          </Link>
          <Link
            href="#testimonials"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/login")}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => router.push("/signup")}
          >
            Get Started
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-b border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="#features" className="text-sm text-muted-foreground">
              Features
            </Link>
            <Link href="#showcase" className="text-sm text-muted-foreground">
              Showcase
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground"
            >
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground">
              Pricing
            </Link>
            <div className="flex gap-4 pt-4">
              <Button variant="ghost" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-accent text-accent-foreground"
                onClick={() => router.push("/signup")}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
