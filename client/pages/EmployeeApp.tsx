import { useState } from "react";
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
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const tasks = [
  { id: 1, title: "Patient Vitals Check - Room 204", priority: "high", timeLeft: "15 min", completed: false },
  { id: 2, title: "Lab Sample Collection - Wing B", priority: "medium", timeLeft: "45 min", completed: false },
  { id: 3, title: "Equipment Maintenance - OR 3", priority: "low", timeLeft: "2 hours", completed: true },
  { id: 4, title: "Inventory Check - Pharmacy", priority: "medium", timeLeft: "1 hour", completed: false },
];

const breakCodes = [
  { code: "BRK15", label: "15-min Break", duration: "15 min" },
  { code: "LUNCH", label: "Lunch Break", duration: "30 min" },
  { code: "WC", label: "Restroom", duration: "5 min" },
  { code: "EMG", label: "Emergency", duration: "Variable" },
];

export default function EmployeeApp() {
  const [currentStatus, setCurrentStatus] = useState<"active" | "break" | "offline">("active");
  const [selectedBreak, setSelectedBreak] = useState<string | null>(null);
  const [biometricStatus, setBiometricStatus] = useState("verified");
  const [currentTime] = useState(new Date());

  const handleBreakStart = (code: string) => {
    setSelectedBreak(code);
    setCurrentStatus("break");
  };

  const handleBreakEnd = () => {
    setSelectedBreak(null);
    setCurrentStatus("active");
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const productivityScore = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-bold">PulseNet</span>
                <Badge variant="secondary">Employee</Badge>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`status-indicator ${currentStatus}`}></div>
                <span className="text-sm font-medium capitalize">{currentStatus}</span>
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Status & Controls */}
          <div className="space-y-6">
            {/* Biometric Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  Biometric Status
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
                      Ward B - Floor 2
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Device</span>
                    <Badge variant="outline">Wearable Connected</Badge>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setBiometricStatus("scanning")}
                    >
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Re-verify Identity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Break Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5" />
                  Break Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStatus === "break" ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge variant="outline" className="mb-2">
                        Currently on {selectedBreak}
                      </Badge>
                      <div className="text-2xl font-bold text-orange-400">
                        <Timer className="h-6 w-6 inline mr-2" />
                        12:45
                      </div>
                      <p className="text-sm text-muted-foreground">Time remaining</p>
                    </div>
                    <Button 
                      onClick={handleBreakEnd}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resume Work
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {breakCodes.map((breakCode) => (
                      <Button
                        key={breakCode.code}
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => handleBreakStart(breakCode.code)}
                      >
                        <span>{breakCode.label}</span>
                        <Badge variant="secondary">{breakCode.duration}</Badge>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Heart Rate</span>
                    <div className="text-right">
                      <div className="font-medium text-green-400">72 BPM</div>
                      <div className="text-xs text-muted-foreground">Normal</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stress Level</span>
                    <div className="text-right">
                      <div className="font-medium text-green-400">Low</div>
                      <div className="text-xs text-muted-foreground">Optimal</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fatigue Index</span>
                    <div className="text-right">
                      <div className="font-medium text-yellow-400">Moderate</div>
                      <div className="text-xs text-muted-foreground">Monitor</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Tasks & Productivity */}
          <div className="space-y-6">
            {/* Daily Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Overview</CardTitle>
                <CardDescription>
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">8h 24m</div>
                    <div className="text-xs text-muted-foreground">Time On Duty</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
                    <div className="text-xs text-muted-foreground">Tasks Done</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">23m</div>
                    <div className="text-xs text-muted-foreground">Break Time</div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Daily Productivity</span>
                    <span className="text-sm font-medium">{productivityScore}%</span>
                  </div>
                  <Progress value={productivityScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Task Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Assigned Tasks
                </CardTitle>
                <CardDescription>
                  {tasks.filter(t => !t.completed).length} tasks remaining
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.completed ? 'bg-muted/50 opacity-60' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={
                                task.priority === 'high' ? 'destructive' : 
                                task.priority === 'medium' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            {task.completed && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <h4 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {task.timeLeft}
                            </span>
                          </div>
                        </div>
                        {!task.completed && (
                          <Button size="sm" variant="outline">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications & Help */}
          <div className="space-y-6">
            {/* Live Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
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
                          Emergency drill scheduled at 3:00 PM
                        </p>
                        <p className="text-xs text-blue-400">2 min ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Task Completed</p>
                        <p className="text-xs text-muted-foreground">
                          Equipment maintenance logged successfully
                        </p>
                        <p className="text-xs text-green-400">15 min ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Health Alert</p>
                        <p className="text-xs text-muted-foreground">
                          Take a 5-minute break - elevated stress detected
                        </p>
                        <p className="text-xs text-orange-400">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Emergency
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Health Check-in
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                  <Separator className="my-3" />
                  <Link to="/">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Main
                    </Button>
                  </Link>
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
                    <span className="text-sm">Productivity Average</span>
                    <span className="font-medium text-green-400">92.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tasks Completed</span>
                    <span className="font-medium">47/52</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Break Compliance</span>
                    <span className="font-medium text-green-400">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Health Score</span>
                    <span className="font-medium text-yellow-400">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
