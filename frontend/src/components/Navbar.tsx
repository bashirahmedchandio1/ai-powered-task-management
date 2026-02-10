"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/next.svg"
              alt="Logo"
              width={40}
              height={40}
              className="dark:invert"
            />
            <span className="font-bold text-xl hidden md:block dark:text-white">
              TodoAdmin
            </span>
          </Link>
        </div>

        <MenuItem setActive={setActive} active={active} item="Features">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/#features">Real-time Tasks</HoveredLink>
            <HoveredLink href="/#features">Team Collaboration</HoveredLink>
            <HoveredLink href="/#features">Smart Insights</HoveredLink>
            <HoveredLink href="/#features">Security</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="https://nextjs.org/docs">
              Next.js Docs
            </HoveredLink>
            <HoveredLink href="https://ui.shadcn.com">Shadcn UI</HoveredLink>
            <HoveredLink href="https://ui.aceternity.com">
              Aceternity UI
            </HoveredLink>
          </div>
        </MenuItem>

        <div className="flex items-center space-x-4 ml-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-black dark:text-white hover:opacity-70 transition duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition duration-200"
          >
            Sign Up
          </Link>
        </div>
      </Menu>
    </div>
  );
}
