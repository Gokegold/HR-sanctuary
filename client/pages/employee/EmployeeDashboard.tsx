import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Clock,
  Coffee,
  AlertTriangle,
  CheckCircle,
  Heart,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Timer,
  Fingerprint,
  Shield,
  Home,
  Menu,
  User,
  BarChart3,
  Calendar,
  FileText,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import SessionTimer from "@/components/auth/SessionTimer";

const navigationItems = [
  { name: "Dashboard", icon: Home, path: "/employee-home", current: true },
  {
    name: "Break Center",
    icon: Coffee,
    path: "/employee/break-center",
    current: false,
  },
  {
    name: "Emergency",
    icon: AlertTriangle,
    path: "/employee/emergency",
    current: false,
  },
  { name: "Tasks", icon: CheckCircle, path: "/employee/tasks", current: false },
  {
    name: "Notifications",
    icon: Bell,
    path: "/employee/notifications",
    current: false,
  },
  {
    name: "Compliance",
    icon: FileText,
    path: "/employee/compliance",
    current: false,
  },
];

const tasks = [
  {
    id: 1,
    title: "Patient Vitals Check - Room 204",
    priority: "high",
    timeLeft: "15 min",
    completed: false,
  },
  {
    id: 2,
    title: "Lab Sample Collection - Wing B",
    priority: "medium",
    timeLeft: "45 min",
    completed: false,
  },
  {
    id: 3,
    title: "Equipment Maintenance - OR 3",
    priority: "low",
    timeLeft: "2 hours",
    completed: true,
  },
  {
    id: 4,
    title: "Inventory Check - Pharmacy",
    priority: "medium",
    timeLeft: "1 hour",
    completed: false,
  },
];

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<
    "active" | "break" | "offline"
  >("active");
  const [biometricStatus, setBiometricStatus] = useState("verified");
  const [currentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(true);
  const [clockInTime] = useState(new Date(Date.now() - 8 * 60 * 60 * 1000)); // 8 hours ago

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const productivityScore = Math.round((completedTasks / totalTasks) * 100);

  const handleClockIn = () => {
    setClockedIn(true);
    setCurrentStatus("active");
  };

  const handleClockOut = () => {
    setClockedIn(false);
    setCurrentStatus("offline");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-bold">PulseNet</span>
                <Badge variant="secondary">Employee Portal</Badge>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <SessionTimer />
              <div className="flex items-center gap-2">
                <div className={`status-indicator ${currentStatus}`}></div>
                <span className="text-sm font-medium capitalize">
                  {currentStatus}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* User Profile in Header */}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                    }
                    alt={`${user.name}'s profile picture`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:block">
                  {user.name.split(" ")[0]}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={logout}
                className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-card min-h-screen">
          <div className="p-4">
            {/* User Profile */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                    }
                    alt={`${user.name}'s profile picture`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.department}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    ID: {user.employeeId}
                  </Badge>
                </div>
              </div>

              {/* Sign Out Button */}
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Time on Duty
                      </p>
                      <p className="text-2xl font-bold">8h 24m</p>
                    </div>
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tasks Completed
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        {completedTasks}/{totalTasks}
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
                      <p className="text-sm text-muted-foreground">
                        Break Time
                      </p>
                      <p className="text-2xl font-bold text-orange-400">23m</p>
                    </div>
                    <Coffee className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Productivity
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {productivityScore}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Status & Biometric */}
              <div className="space-y-6">
                {/* Clock In/Out */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Clock Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          {clockInTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Clocked in since
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleClockIn}
                          disabled={clockedIn}
                          className="flex-1"
                          variant={clockedIn ? "outline" : "default"}
                        >
                          <Timer className="h-4 w-4 mr-2" />
                          Clock In
                        </Button>
                        <Button
                          onClick={handleClockOut}
                          disabled={!clockedIn}
                          variant="outline"
                          className="flex-1"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Clock Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Biometric Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fingerprint className="h-5 w-5" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Authentication</span>
                        <Badge variant="default" className="bg-green-500">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Location</span>
                        <div className="flex items-center gap-1 text-sm text-green-400">
                          <MapPin className="h-3 w-3" />
                          {user.department}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Wearable</span>
                        <Badge variant="outline">Connected</Badge>
                      </div>
                      <Separator />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setBiometricStatus("scanning")}
                      >
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Re-verify Identity
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Health Vitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Heart Rate</span>
                        <div className="text-right">
                          <div className="font-medium text-green-400">
                            72 BPM
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Normal
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Stress Level</span>
                        <div className="text-right">
                          <div className="font-medium text-green-400">Low</div>
                          <div className="text-xs text-muted-foreground">
                            Optimal
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Fatigue</span>
                        <div className="text-right">
                          <div className="font-medium text-yellow-400">
                            Moderate
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Monitor
                          </div>
                        </div>
                      </div>
                      <Link to="/health">
                        <Button variant="outline" className="w-full">
                          View Detailed Health
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Center Column - Tasks & Activity */}
              <div className="space-y-6">
                {/* Task Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Today's Tasks
                      </div>
                      <Link to="/employee/tasks">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {tasks.filter((t) => !t.completed).length} tasks remaining
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg border ${
                            task.completed
                              ? "bg-muted/50 opacity-60"
                              : "bg-card"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "destructive"
                                      : task.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                                {task.completed && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <h4
                                className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}
                              >
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {task.timeLeft}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm font-medium">
                          {productivityScore}%
                        </span>
                      </div>
                      <Progress value={productivityScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Equipment maintenance completed
                          </p>
                          <p className="text-xs text-muted-foreground">
                            15 minutes ago
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Break ended - returned to active status
                          </p>
                          <p className="text-xs text-muted-foreground">
                            45 minutes ago
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            15-minute break started
                          </p>
                          <p className="text-xs text-muted-foreground">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions & Notifications */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/employee/break-center">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex-col gap-2"
                        >
                          <Coffee className="h-6 w-6" />
                          <span className="text-xs">Break</span>
                        </Button>
                      </Link>
                      <Link to="/employee/emergency">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex-col gap-2"
                        >
                          <AlertTriangle className="h-6 w-6" />
                          <span className="text-xs">Emergency</span>
                        </Button>
                      </Link>
                      <Link to="/health">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex-col gap-2"
                        >
                          <Heart className="h-6 w-6" />
                          <span className="text-xs">Health</span>
                        </Button>
                      </Link>
                      <Link to="/employee/compliance">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex-col gap-2"
                        >
                          <FileText className="h-6 w-6" />
                          <span className="text-xs">Compliance</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                      </div>
                      <Link to="/employee/notifications">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Shift Update</p>
                            <p className="text-xs text-muted-foreground">
                              Emergency drill at 3:00 PM
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Task Reminder</p>
                            <p className="text-xs text-muted-foreground">
                              Lab samples due in 30 min
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Avg. Productivity</span>
                        <span className="font-medium text-green-400">
                          92.3%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tasks Completed</span>
                        <span className="font-medium">47/52</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Break Compliance</span>
                        <span className="font-medium text-green-400">
                          Excellent
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Health Score</span>
                        <span className="font-medium text-yellow-400">
                          Good
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
