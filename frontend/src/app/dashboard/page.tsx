"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // Assuming using native textarea or shadcn one if installed, native for now
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Circle,
  Plus,
  ListTodo,
  Clock,
  Target,
  Sparkles,
  MoreVertical,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const router = useRouter();

  // Search and Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  // Editing state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, sortOrder, statusFilter]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("sort_by", sortBy);
      params.append("order", sortOrder);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error: any) {
      console.error("Failed to fetch tasks", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: number, currentCompleted: boolean) => {
    try {
      // Optimistic update
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentCompleted } : t));

      await api.patch(`/tasks/${id}`, { completed: !currentCompleted });
      toast.success("Task updated!");
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Failed to update task");
      fetchTasks(); // Revert on error
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (newTaskTitle.length > 200) {
      toast.error("Title must be less than 200 characters");
      return;
    }

    setAddingTask(true);
    try {
      const res = await api.post("/tasks", { title: newTaskTitle, description: newTaskDescription });
      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
      setNewTaskDescription("");
      toast.success("Task created!");
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task");
    } finally {
      setAddingTask(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setTasks(tasks.filter(t => t.id !== id));
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete task");
      fetchTasks(); // Revert
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditForm({ title: task.title, description: task.description || "" });
    setIsEditOpen(true);
  }

  const saveEdit = async () => {
    if (!editingTask) return;

    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (editForm.title.length > 200) {
      toast.error("Title must be less than 200 characters");
      return;
    }

    if (editForm.description.length > 1000) {
      toast.error("Description must be less than 1000 characters");
      return;
    }

    try {
      const res = await api.patch(`/tasks/${editingTask.id}`, editForm);
      setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t));
      setIsEditOpen(false);
      toast.success("Task saved");
    } catch (error) {
      console.error("Failed to save task", error);
      toast.error("Failed to save task");
    }
  }


  const completedTasksValues = tasks.filter((t) => t.completed).length; // This might be inaccurate if filtered by search, but okay for stats
  const pendingTasksValues = tasks.filter((t) => !t.completed).length;

  // We'll use the tasks returned by the backend directly now
  const displayTasks = tasks;

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="flex items-center gap-3">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="text-lg text-muted-foreground">Loading your tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />


      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back! 👋
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Here's what's on your plate today
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{completedTasksValues}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{pendingTasksValues}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {tasks.length > 0 ? Math.round((completedTasksValues / tasks.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add task form */}
        <Card className="mb-8 border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Quick Add
            </CardTitle>
            <CardDescription>
              Add a new task to your list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTask} className="flex gap-3">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="What do you need to do?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-background/50 border-border"
                  maxLength={200}
                />
                <div className="flex justify-end">
                  <span className={`text-[10px] ${newTaskTitle.length > 180 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    {newTaskTitle.length}/200
                  </span>
                </div>
                <textarea
                  placeholder="Task description (optional)"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full flex min-h-[60px] rounded-md border border-border bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={1000}
                />
                <div className="flex justify-end">
                  <span className={`text-[10px] ${newTaskDescription.length > 900 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    {newTaskDescription.length}/1000
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse-glow"
                disabled={addingTask || !newTaskTitle.trim()}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tasks Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="bg-muted/50 w-full sm:w-auto">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background/50 pl-9 border-border"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-background/50 border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="updated_at">Last Updated</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-background/50 border-border"
                title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {["all", "active", "completed"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-0">
              <Card className="border-border bg-card/50 backdrop-blur-sm min-h-[300px]">
                <CardContent className="pt-6">
                  {displayTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                        <ListTodo className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold">No tasks found</h3>
                      <p className="mt-1 text-muted-foreground">
                        {searchQuery ? "No tasks matching your search." : tabValue === "all" ? "Create your first task to get started!" : `No ${tabValue} tasks found.`}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {displayTasks.map((task) => (
                        <li
                          key={task.id}
                          className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:border-accent/50 hover:bg-accent/5 ${task.completed
                            ? "border-accent/30 bg-accent/5"
                            : "border-border bg-background/50"
                            }`}
                        >
                          <div className="mt-0.5 cursor-pointer" onClick={() => toggleTask(task.id, task.completed)}>
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-accent" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground group-hover:text-accent" />
                            )}
                          </div>

                          <div className="flex-1 cursor-pointer" onClick={() => openEditDialog(task)}>
                            <h3
                              className={`font-medium transition-all ${task.completed
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                                }`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Created {formatDate(task.created_at)}</span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(task)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteTask(task.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <div className="space-y-1">
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="col-span-3"
                  maxLength={200}
                />
                <div className="flex justify-end mr-1">
                  <span className={`text-[10px] ${editForm.title.length > 180 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    {editForm.title.length}/200
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <div className="space-y-1">
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  maxLength={1000}
                />
                <div className="flex justify-end mr-1">
                  <span className={`text-[10px] ${editForm.description.length > 950 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    {editForm.description.length}/1000
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={saveEdit} className="bg-accent text-accent-foreground hover:bg-accent/90">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Chat Button - Premium Version */}
      <Link
        href="/chat"
        className="group fixed bottom-8 right-8 z-50 flex h-14 items-center gap-3 overflow-hidden rounded-full bg-accent pr-1 shadow-2xl shadow-accent/40 transition-all duration-500 hover:pr-6 active:scale-95 animate-pulse-glow"
        title="Ask AI Assistant"
      >
        <div className="flex h-14 w-14 items-center justify-center shrink-0">
          <Sparkles className="h-6 w-6 text-accent-foreground transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold uppercase tracking-widest text-accent-foreground transition-all duration-500 group-hover:max-w-[120px]">
          Ask Assistant
        </span>
      </Link>
    </div>
  );
}
