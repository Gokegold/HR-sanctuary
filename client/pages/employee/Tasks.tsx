import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Home,
  Clock,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Calendar,
  Filter,
  Search,
  Plus,
  Timer,
  Activity,
  Bell,
  Settings,
  LogOut,
  User,
  MapPin,
  Flag,
  BarChart3,
  Target,
  CheckSquare,
  Circle,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronDown,
  FileText,
  Image,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import SessionTimer from "@/components/auth/SessionTimer";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "on_hold" | "cancelled";
  assignedBy: string;
  assignedTo: string;
  dueDate: Date;
  estimatedTime: number; // in minutes
  actualTime?: number;
  location?: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  timeSpent: number; // in minutes
  isTimerActive: boolean;
  lastTimerStart?: Date;
  dependencies?: string[];
  attachments?: string[];
  notes: string[];
}

interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  description: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Patient Vitals Check - Room 204",
    description:
      "Complete comprehensive vital signs assessment for patient in room 204. Include blood pressure, heart rate, temperature, and oxygen saturation.",
    priority: "high",
    status: "pending",
    assignedBy: "Dr. Smith",
    assignedTo: "current_user",
    dueDate: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    estimatedTime: 20,
    location: "Room 204, Ward B",
    category: "Patient Care",
    tags: ["vitals", "assessment", "urgent"],
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    timeSpent: 0,
    isTimerActive: false,
    notes: [],
  },
  {
    id: "2",
    title: "Lab Sample Collection - Wing B",
    description:
      "Collect blood samples from patients in Wing B for morning lab work. Ensure proper labeling and immediate delivery to lab.",
    priority: "medium",
    status: "in_progress",
    assignedBy: "Lab Coordinator",
    assignedTo: "current_user",
    dueDate: new Date(Date.now() + 45 * 60 * 1000),
    estimatedTime: 30,
    location: "Wing B",
    category: "Laboratory",
    tags: ["collection", "samples", "lab"],
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    timeSpent: 15,
    isTimerActive: true,
    lastTimerStart: new Date(Date.now() - 10 * 60 * 1000),
    notes: ["Started with rooms 201-205"],
  },
  {
    id: "3",
    title: "Equipment Maintenance - OR 3",
    description:
      "Perform routine maintenance check on surgical equipment in Operating Room 3. Complete maintenance log and report any issues.",
    priority: "low",
    status: "completed",
    assignedBy: "Maintenance Chief",
    assignedTo: "current_user",
    dueDate: new Date(Date.now() - 60 * 60 * 1000),
    estimatedTime: 45,
    actualTime: 40,
    location: "OR 3",
    category: "Maintenance",
    tags: ["equipment", "maintenance", "surgical"],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
    timeSpent: 40,
    isTimerActive: false,
    notes: ["All equipment functioning normally", "Replaced air filter"],
  },
  {
    id: "4",
    title: "Inventory Check - Pharmacy",
    description:
      "Conduct weekly inventory check of controlled substances in pharmacy. Update inventory system and report discrepancies.",
    priority: "medium",
    status: "pending",
    assignedBy: "Pharmacy Director",
    assignedTo: "current_user",
    dueDate: new Date(Date.now() + 60 * 60 * 1000),
    estimatedTime: 60,
    location: "Pharmacy",
    category: "Administration",
    tags: ["inventory", "pharmacy", "controlled substances"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    timeSpent: 0,
    isTimerActive: false,
    notes: [],
  },
];

const categories = [
  "All",
  "Patient Care",
  "Laboratory",
  "Maintenance",
  "Administration",
  "Emergency",
];
const priorities = ["All", "low", "medium", "high", "critical"];
const statuses = [
  "All",
  "pending",
  "in_progress",
  "completed",
  "on_hold",
  "cancelled",
];

export default function Tasks() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Real-time timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.isTimerActive && task.lastTimerStart) {
            const elapsed = Math.floor(
              (Date.now() - task.lastTimerStart.getTime()) / 60000,
            );
            return {
              ...task,
              timeSpent: task.timeSpent + (elapsed > 0 ? 1 : 0),
            };
          }
          return task;
        }),
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((task) => task.category === selectedCategory);
    }

    if (selectedPriority !== "All") {
      filtered = filtered.filter((task) => task.priority === selectedPriority);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, selectedCategory, selectedPriority, selectedStatus]);

  const startTimer = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map(
        (task) =>
          task.id === taskId
            ? {
                ...task,
                isTimerActive: true,
                lastTimerStart: new Date(),
                status: task.status === "pending" ? "in_progress" : task.status,
              }
            : { ...task, isTimerActive: false }, // Stop other timers
      ),
    );
  };

  const pauseTimer = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isTimerActive: false,
              timeSpent: task.lastTimerStart
                ? task.timeSpent +
                  Math.floor(
                    (Date.now() - task.lastTimerStart.getTime()) / 60000,
                  )
                : task.timeSpent,
            }
          : task,
      ),
    );
  };

  const completeTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed" as const,
              isTimerActive: false,
              actualTime: task.lastTimerStart
                ? task.timeSpent +
                  Math.floor(
                    (Date.now() - task.lastTimerStart.getTime()) / 60000,
                  )
                : task.timeSpent,
              updatedAt: new Date(),
            }
          : task,
      ),
    );
  };

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task,
      ),
    );
  };

  const addNote = (taskId: string, note: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, notes: [...task.notes, note], updatedAt: new Date() }
          : task,
      ),
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-500";
      case "on_hold":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeRemaining = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 0) return { text: "Overdue", color: "text-red-500" };
    if (minutes < 60) return { text: `${minutes}m`, color: "text-orange-500" };
    if (minutes < 1440)
      return { text: `${Math.floor(minutes / 60)}h`, color: "text-yellow-500" };
    return { text: `${Math.floor(minutes / 1440)}d`, color: "text-green-500" };
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/employee-home" className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-bold">PulseNet</span>
                <Badge variant="secondary">Task Manager</Badge>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <SessionTimer />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {tasks.filter((t) => t.status === "in_progress").length}
                  </p>
                </div>
                <Timer className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-400">
                    {tasks.filter((t) => t.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Time Today</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {formatTime(
                      tasks.reduce((total, task) => total + task.timeSpent, 0),
                    )}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Tasks</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Active Tasks Tab */}
          <TabsContent value="active" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedPriority}
                    onValueChange={setSelectedPriority}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority === "All" ? "All Priorities" : priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "All"
                            ? "All Statuses"
                            : status.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks
                .filter((task) => task.status !== "completed")
                .map((task) => {
                  const timeRemaining = getTimeRemaining(task.dueDate);

                  return (
                    <Card
                      key={task.id}
                      className={`transition-all hover:shadow-lg ${
                        task.isTimerActive
                          ? "border-blue-500 bg-blue-500/5"
                          : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold">
                                    {task.title}
                                  </h3>
                                  <Badge
                                    variant={
                                      task.priority === "critical" ||
                                      task.priority === "high"
                                        ? "destructive"
                                        : "outline"
                                    }
                                    className={getPriorityColor(task.priority)}
                                  >
                                    {task.priority}
                                  </Badge>
                                  <Badge variant="outline">
                                    {task.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {task.description}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {task.assignedBy}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {task.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Due: {timeRemaining.text}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Timer className="h-4 w-4" />
                                    {formatTime(task.timeSpent)} /{" "}
                                    {formatTime(task.estimatedTime)}
                                  </div>
                                </div>

                                {task.tags.length > 0 && (
                                  <div className="flex gap-2 mt-3">
                                    {task.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`${getStatusColor(task.status)} text-white`}
                                >
                                  {task.status.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">Progress</span>
                                <span className="text-sm">
                                  {Math.round(
                                    (task.timeSpent / task.estimatedTime) * 100,
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={Math.min(
                                  (task.timeSpent / task.estimatedTime) * 100,
                                  100,
                                )}
                                className="h-2"
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {task.isTimerActive ? (
                                <Button
                                  onClick={() => pauseTimer(task.id)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => startTimer(task.id)}
                                  variant="default"
                                  size="sm"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start
                                </Button>
                              )}

                              <Button
                                onClick={() => completeTask(task.id)}
                                variant="outline"
                                size="sm"
                                disabled={task.status === "completed"}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete
                              </Button>

                              <Select
                                value={task.status}
                                onValueChange={(value) =>
                                  updateTaskStatus(
                                    task.id,
                                    value as Task["status"],
                                  )
                                }
                              >
                                <SelectTrigger className="w-[120px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="on_hold">
                                    On Hold
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              <Button
                                onClick={() => setSelectedTask(task)}
                                variant="ghost"
                                size="sm"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

              {filteredTasks.filter((task) => task.status !== "completed")
                .length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Active Tasks
                    </h3>
                    <p className="text-muted-foreground">
                      All tasks are completed or no tasks match your current
                      filters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* All Tasks Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const timeRemaining = getTimeRemaining(task.dueDate);

                return (
                  <Card
                    key={task.id}
                    className="transition-all hover:shadow-lg"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}
                          ></div>
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {task.category} • {task.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                          <span className={`text-sm ${timeRemaining.color}`}>
                            {timeRemaining.text}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(task.timeSpent)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Completed Tasks Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Completed {task.updatedAt.toLocaleDateString()} •{" "}
                              {formatTime(task.actualTime || task.timeSpent)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-500">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {Math.round(
                        (tasks.filter((t) => t.status === "completed").length /
                          tasks.length) *
                          100,
                      )}
                      %
                    </div>
                    <Progress
                      value={
                        (tasks.filter((t) => t.status === "completed").length /
                          tasks.length) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Completion Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {formatTime(
                        Math.round(
                          tasks
                            .filter((t) => t.status === "completed")
                            .reduce(
                              (total, task) =>
                                total + (task.actualTime || task.timeSpent),
                              0,
                            ) /
                            tasks.filter((t) => t.status === "completed")
                              .length || 1,
                        ),
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Per task</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productivity Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      94%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on efficiency
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Task Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(1).map((category) => {
                    const categoryTasks = tasks.filter(
                      (t) => t.category === category,
                    );
                    const percentage =
                      (categoryTasks.length / tasks.length) * 100;

                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">{category}</span>
                          <span className="text-sm">
                            {categoryTasks.length} tasks
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedTask.title}</CardTitle>
                  <CardDescription>{selectedTask.category}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedTask(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <p className="text-sm">{selectedTask.priority}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm">
                    {selectedTask.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned By</Label>
                  <p className="text-sm">{selectedTask.assignedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{selectedTask.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <p className="text-sm">
                    {selectedTask.dueDate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time Spent</Label>
                  <p className="text-sm">
                    {formatTime(selectedTask.timeSpent)} /{" "}
                    {formatTime(selectedTask.estimatedTime)}
                  </p>
                </div>
              </div>

              {selectedTask.notes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <div className="space-y-2">
                    {selectedTask.notes.map((note, index) => (
                      <p key={index} className="text-sm bg-muted p-2 rounded">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
