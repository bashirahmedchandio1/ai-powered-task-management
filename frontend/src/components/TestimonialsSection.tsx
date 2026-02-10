import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "Finally, a task app that doesn't try to do everything. It does one thing perfectly - help me focus.",
    author: "Sarah Chen",
    role: "Product Designer at Stripe",
    avatar: "/professional-woman-headshot.png",
  },
  {
    content:
      "The AI suggestions are surprisingly good. It feels like having a personal productivity assistant.",
    author: "Marcus Johnson",
    role: "Engineering Lead at Vercel",
    avatar: "/professional-man-headshot.png",
  },
  {
    content:
      "I've tried every task app out there. Taskflow is the only one that stuck. Simple yet powerful.",
    author: "Emily Rodriguez",
    role: "Founder at Nimble",
    avatar: "/professional-woman-entrepreneur-headshot.png",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="border-y border-border bg-secondary/20 py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by productive people
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join thousands of professionals who have transformed their workflow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-6 text-lg leading-relaxed">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full bg-secondary object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
