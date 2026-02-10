import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center md:p-20">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Ready to take control?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Start for free. No credit card required. Upgrade when you need
              more power.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group h-14 gap-2 bg-accent px-10 text-accent-foreground hover:bg-accent/90"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 border-border bg-transparent"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
