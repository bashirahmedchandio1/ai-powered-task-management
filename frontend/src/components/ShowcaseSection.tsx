import { Check, Circle, ChevronRight } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Design system update",
    project: "Website Redesign",
    completed: true,
    priority: "high",
  },
  {
    id: 2,
    title: "Review pull requests",
    project: "Development",
    completed: false,
    priority: "medium",
  },
  {
    id: 3,
    title: "Team standup meeting",
    project: "General",
    completed: false,
    priority: "low",
  },
  {
    id: 4,
    title: "Write documentation",
    project: "API v2",
    completed: false,
    priority: "medium",
  },
  {
    id: 5,
    title: "Deploy staging build",
    project: "Development",
    completed: true,
    priority: "high",
  },
];

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Experience the interface
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Clean, focused, and designed to fade into the background while you
            work.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* App mockup */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-sm text-muted-foreground">My Tasks</span>
              <div className="w-16" />
            </div>

            {/* Sidebar + Content */}
            <div className="flex min-h-[500px]">
              {/* Sidebar */}
              <div className="hidden w-56 border-r border-border bg-secondary/20 p-4 md:block">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg bg-accent/20 px-3 py-2 text-sm font-medium text-accent">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    Today
                  </div>
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                    Upcoming
                  </div>
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                    All Tasks
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Projects
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      Website Redesign
                    </div>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50">
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      Development
                    </div>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50">
                      <span className="h-2 w-2 rounded-full bg-orange-400" />
                      API v2
                    </div>
                  </div>
                </div>
              </div>

              {/* Task list */}
              <div className="flex-1 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Today</h3>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-sm text-accent">
                    {tasks.filter((t) => !t.completed).length} remaining
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center gap-4 rounded-xl border border-transparent p-4 transition-all hover:border-border hover:bg-secondary/30 ${
                        task.completed ? "opacity-50" : ""
                      }`}
                    >
                      <button className="flex-shrink-0">
                        {task.completed ? (
                          <Check className="h-5 w-5 text-accent" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {task.project}
                        </p>
                      </div>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-400"
                            : task.priority === "medium"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                      />
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-accent/20 via-transparent to-accent/20 blur-2xl -z-10" />
        </div>
      </div>
    </section>
  );
}
