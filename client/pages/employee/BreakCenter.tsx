import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Coffee,
  Home,
  Timer,
  Fingerprint,
  Play,
  Pause,
  Square,
  Clock,
  AlertTriangle,
  CheckCircle,
  Utensils,
  Toilet,
  Car,
  Shield,
  Activity,
  History,
  Bell,
  Settings,
  LogOut,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import SessionTimer from "@/components/auth/SessionTimer";

interface BreakType {
  code: string;
  label: string;
  duration: number; // in minutes
  maxPerDay: number;
  icon: any;
  color: string;
  description: string;
}

interface BreakSession {
  id: string;
  type: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  biometricVerified: boolean;
  location: string;
  status: "active" | "completed" | "expired";
}

const breakTypes: BreakType[] = [
  {
    code: "BRK15",
    label: "15-min Break",
    duration: 15,
    maxPerDay: 2,
    icon: Coffee,
    color: "blue",
    description: "Standard rest break",
  },
  {
    code: "BRK30",
    label: "30-min Break",
    duration: 30,
    maxPerDay: 1,
    icon: Coffee,
    color: "green",
    description: "Extended rest break",
  },
  {
    code: "LUNCH",
    label: "Lunch Break",
    duration: 30,
    maxPerDay: 1,
    icon: Utensils,
    color: "orange",
    description: "Meal break",
  },
  {
    code: "WC",
    label: "Restroom",
    duration: 5,
    maxPerDay: 8,
    icon: Toilet,
    color: "purple",
    description: "Personal needs",
  },
  {
    code: "ERND",
    label: "Errand",
    duration: 15,
    maxPerDay: 2,
    icon: Car,
    color: "yellow",
    description: "Work-related errand",
  },
  {
    code: "EMG",
    label: "Emergency",
    duration: 0,
    maxPerDay: 99,
    icon: AlertTriangle,
    color: "red",
    description: "Emergency situation",
  },
];

// Mock data for today's breaks
const todaysBreaks: BreakSession[] = [
  {
    id: "1",
    type: "BRK15",
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 15 * 60 * 1000),
    duration: 15,
    biometricVerified: true,
    location: "Break Room A",
    status: "completed",
  },
  {
    id: "2",
    type: "LUNCH",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
    duration: 30,
    biometricVerified: true,
    location: "Cafeteria",
    status: "completed",
  },
];

export default function BreakCenter() {
  const { user, logout } = useAuth();
  const [currentBreak, setCurrentBreak] = useState<BreakSession | null>(null);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [breakHistory] = useState<BreakSession[]>(todaysBreaks);

  // Timer for active break
  useEffect(() => {
    if (currentBreak && currentBreak.status === "active") {
      const interval = setInterval(() => {
        const elapsed = Date.now() - currentBreak.startTime.getTime();
        const breakType = breakTypes.find(
          (bt) => bt.code === currentBreak.type,
        );
        if (breakType && breakType.duration > 0) {
          const remaining = breakType.duration * 60 * 1000 - elapsed;
          setTimeRemaining(Math.max(0, remaining));

          if (remaining <= 0) {
            // Auto-end break when time expires
            endBreak();
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentBreak]);

  const startBreak = async (breakType: BreakType) => {
    setBiometricScanning(true);

    // Simulate biometric verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newBreak: BreakSession = {
      id: Date.now().toString(),
      type: breakType.code,
      startTime: new Date(),
      duration: breakType.duration,
      biometricVerified: true,
      location: "Current Location",
      status: "active",
    };

    setCurrentBreak(newBreak);
    setTimeRemaining(breakType.duration * 60 * 1000);
    setBiometricScanning(false);
  };

  const endBreak = async () => {
    if (!currentBreak) return;

    setBiometricScanning(true);

    // Simulate biometric re-verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedBreak = {
      ...currentBreak,
      endTime: new Date(),
      status: "completed" as const,
    };

    // In real app, this would save to the backend
    setCurrentBreak(null);
    setTimeRemaining(0);
    setBiometricScanning(false);
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getBreakUsage = (breakCode: string) => {
    const used = breakHistory.filter(
      (b) => b.type === breakCode && b.status === "completed",
    ).length;
    const breakType = breakTypes.find((bt) => bt.code === breakCode);
    return { used, max: breakType?.maxPerDay || 0 };
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
                <Badge variant="secondary">Break Center</Badge>
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
        {/* Active Break Status */}
        {currentBreak && (
          <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
            <Timer className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Break Active:</strong>{" "}
                  {
                    breakTypes.find((bt) => bt.code === currentBreak.type)
                      ?.label
                  }
                  <br />
                  <span className="text-sm">
                    Started at {currentBreak.startTime.toLocaleTimeString()}
                  </span>
                </div>
                {currentBreak.type !== "EMG" && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-xs">Time remaining</div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="start-break" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="start-break">Start Break</TabsTrigger>
            <TabsTrigger value="history">Today's History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Start Break Tab */}
          <TabsContent value="start-break" className="space-y-6">
            {currentBreak ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Active Break Session
                  </CardTitle>
                  <CardDescription>
                    You are currently on a{" "}
                    {
                      breakTypes.find((bt) => bt.code === currentBreak.type)
                        ?.label
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-orange-400 mb-2">
                      {currentBreak.type !== "EMG"
                        ? formatTime(timeRemaining)
                        : "ACTIVE"}
                    </div>
                    <p className="text-muted-foreground">
                      {currentBreak.type !== "EMG"
                        ? "Time remaining"
                        : "Emergency break in progress"}
                    </p>
                  </div>

                  {currentBreak.type !== "EMG" && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">
                          {Math.round(
                            ((breakTypes.find(
                              (bt) => bt.code === currentBreak.type,
                            )?.duration! *
                              60 *
                              1000 -
                              timeRemaining) /
                              (breakTypes.find(
                                (bt) => bt.code === currentBreak.type,
                              )?.duration! *
                                60 *
                                1000)) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          ((breakTypes.find(
                            (bt) => bt.code === currentBreak.type,
                          )?.duration! *
                            60 *
                            1000 -
                            timeRemaining) /
                            (breakTypes.find(
                              (bt) => bt.code === currentBreak.type,
                            )?.duration! *
                              60 *
                              1000)) *
                          100
                        }
                        className="h-3"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p className="font-medium">
                        {currentBreak.startTime.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{currentBreak.location}</p>
                    </div>
                  </div>

                  <Button
                    onClick={endBreak}
                    disabled={biometricScanning}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {biometricScanning ? (
                      <>
                        <Fingerprint className="h-5 w-5 mr-2 animate-pulse" />
                        Verifying Biometric...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        End Break & Return to Work
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {breakTypes.map((breakType) => {
                  const IconComponent = breakType.icon;
                  const usage = getBreakUsage(breakType.code);
                  const canTakeBreak = usage.used < usage.max;

                  return (
                    <Card
                      key={breakType.code}
                      className={`transition-all hover:shadow-lg ${canTakeBreak ? "hover:border-primary/50" : "opacity-60"}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-3 rounded-lg bg-${breakType.color}-500/20`}
                            >
                              <IconComponent
                                className={`h-6 w-6 text-${breakType.color}-500`}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {breakType.label}
                              </CardTitle>
                              <CardDescription>
                                {breakType.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>Duration:</span>
                            <span className="font-medium">
                              {breakType.duration === 0
                                ? "Variable"
                                : `${breakType.duration} min`}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Used Today:</span>
                            <span className="font-medium">
                              {usage.used}/{usage.max}
                            </span>
                          </div>

                          {usage.max < 99 && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground">
                                  Daily Allowance
                                </span>
                                <span className="text-xs">
                                  {Math.round((usage.used / usage.max) * 100)}%
                                </span>
                              </div>
                              <Progress
                                value={(usage.used / usage.max) * 100}
                                className="h-1"
                              />
                            </div>
                          )}

                          <Button
                            onClick={() => startBreak(breakType)}
                            disabled={!canTakeBreak || biometricScanning}
                            className="w-full"
                            variant={canTakeBreak ? "default" : "outline"}
                          >
                            {biometricScanning ? (
                              <>
                                <Fingerprint className="h-4 w-4 mr-2 animate-pulse" />
                                Verifying...
                              </>
                            ) : canTakeBreak ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Start {breakType.label}
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Daily Limit Reached
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Today's Break History
                </CardTitle>
                <CardDescription>
                  {breakHistory.length} breaks taken today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {breakHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No breaks taken today
                    </div>
                  ) : (
                    breakHistory.map((session) => {
                      const breakType = breakTypes.find(
                        (bt) => bt.code === session.type,
                      );
                      const IconComponent = breakType?.icon || Coffee;

                      return (
                        <div
                          key={session.id}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          <div
                            className={`p-2 rounded-lg bg-${breakType?.color}-500/20`}
                          >
                            <IconComponent
                              className={`h-5 w-5 text-${breakType?.color}-500`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">
                                {breakType?.label}
                              </h4>
                              <Badge variant="outline">
                                {session.duration} min
                              </Badge>
                              {session.biometricVerified && (
                                <Badge variant="secondary">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {session.startTime.toLocaleTimeString()} -{" "}
                              {session.endTime?.toLocaleTimeString()}
                              <span className="ml-2">• {session.location}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              session.status === "completed"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {breakHistory.reduce((total, b) => total + b.duration, 0)}
                      m
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Break Time
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {breakHistory.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Breaks Taken
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      {breakHistory.length > 0
                        ? Math.round(
                            breakHistory.reduce(
                              (total, b) => total + b.duration,
                              0,
                            ) / breakHistory.length,
                          )
                        : 0}
                      m
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average Duration
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      100%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Compliance Rate
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Break Pattern Analysis</CardTitle>
                <CardDescription>
                  Your break-taking patterns and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Excellent Compliance</p>
                      <p className="text-sm text-muted-foreground">
                        You're following break guidelines perfectly. Keep up the
                        good work!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Timer className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Optimal Timing</p>
                      <p className="text-sm text-muted-foreground">
                        Your break timing aligns well with recommended patterns
                        for your role.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
