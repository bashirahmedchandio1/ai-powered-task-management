import Link from "next/link";
import { CheckSquare, Github, Twitter } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press", "Contact"],
  Resources: ["Documentation", "Help Center", "API", "Status", "Community"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <CheckSquare className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-semibold">Taskflow</span>
            </Link>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
              The minimalist task management app for people who ship.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Taskflow. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with focus in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
