import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Activity, 
  Home, 
  Bell, 
  Settings, 
  LogOut,
  Shield,
  AlertTriangle,
  MapPin,
  Clock,
  Heart,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  MessageCircle,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Flag,
  UserCheck,
  UserX,
  Zap,
  Volume2,
  Play,
  Pause,
  AlertCircle,
  Target,
  Award,
  Thermometer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import SessionTimer from "@/components/auth/SessionTimer";

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  status: 'active' | 'break' | 'offline' | 'emergency';
  location: string;
  lastActivity: Date;
  todayHours: number;
  complianceScore: number;
  healthScore: number;
  heartRate: number;
  stressLevel: 'low' | 'medium' | 'high';
  wearableConnected: boolean;
  breaks: { current?: string; todayCount: number; totalTime: number };
  flags: string[];
  avatar?: string;
}

interface HRAlert {
  id: string;
  type: 'device_removed' | 'extended_break' | 'health_risk' | 'compliance_violation' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  employee: string;
  department: string;
  title: string;
  description: string;
  timestamp: Date;
  status: 'new' | 'reviewing' | 'resolved';
  audioRecording?: string;
  requiresAction: boolean;
}

interface JustificationRequest {
  id: string;
  employee: string;
  type: 'emergency' | 'extended_break' | 'late_arrival' | 'early_departure';
  reason: string;
  audioRecording?: string;
  timestamp: Date;
  duration?: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
}

// Mock Data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    department: "Emergency Medicine",
    role: "Senior Doctor",
    status: "active",
    location: "ER Ward A",
    lastActivity: new Date(Date.now() - 5 * 60 * 1000),
    todayHours: 6.5,
    complianceScore: 98,
    healthScore: 85,
    heartRate: 72,
    stressLevel: "low",
    wearableConnected: true,
    breaks: { todayCount: 2, totalTime: 45 },
    flags: [],
    avatar: undefined
  },
  {
    id: "2",
    name: "Nurse Jennifer Chen",
    department: "ICU",
    role: "Registered Nurse",
    status: "break",
    location: "Break Room B",
    lastActivity: new Date(Date.now() - 10 * 60 * 1000),
    todayHours: 4.2,
    complianceScore: 92,
    healthScore: 78,
    heartRate: 88,
    stressLevel: "medium",
    wearableConnected: true,
    breaks: { current: "LUNCH", todayCount: 3, totalTime: 65 },
    flags: ["extended_break"],
    avatar: undefined
  },
  {
    id: "3",
    name: "Tech David Wilson",
    department: "Laboratory",
    role: "Lab Technician",
    status: "offline",
    location: "Unknown",
    lastActivity: new Date(Date.now() - 45 * 60 * 1000),
    todayHours: 3.8,
    complianceScore: 76,
    healthScore: 82,
    heartRate: 0,
    stressLevel: "low",
    wearableConnected: false,
    breaks: { todayCount: 4, totalTime: 85 },
    flags: ["device_removed", "excessive_breaks"],
    avatar: undefined
  },
  {
    id: "4",
    name: "Dr. Lisa Wang",
    department: "Emergency",
    role: "Emergency Physician",
    status: "emergency",
    location: "ER Trauma Bay",
    lastActivity: new Date(Date.now() - 2 * 60 * 1000),
    todayHours: 8.1,
    complianceScore: 95,
    healthScore: 65,
    heartRate: 115,
    stressLevel: "high",
    wearableConnected: true,
    breaks: { todayCount: 1, totalTime: 15 },
    flags: ["health_risk", "elevated_stress"],
    avatar: undefined
  }
];

const mockAlerts: HRAlert[] = [
  {
    id: "1",
    type: "device_removed",
    priority: "high",
    employee: "Tech David Wilson",
    department: "Laboratory",
    title: "Wearable Device Removed",
    description: "Device WEAR004 was removed without proper check-out procedure",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "new",
    requiresAction: true
  },
  {
    id: "2",
    type: "health_risk",
    priority: "critical",
    employee: "Dr. Lisa Wang",
    department: "Emergency",
    title: "Elevated Stress Indicators",
    description: "Continuous elevated heart rate (115 BPM) and stress markers detected",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "reviewing",
    requiresAction: true
  },
  {
    id: "3",
    type: "extended_break",
    priority: "medium",
    employee: "Nurse Jennifer Chen",
    department: "ICU",
    title: "Extended Break Duration",
    description: "Lunch break exceeded 30-minute limit by 15 minutes",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: "new",
    audioRecording: "audio_justification_001.wav",
    requiresAction: true
  }
];

const mockJustifications: JustificationRequest[] = [
  {
    id: "1",
    employee: "Nurse Jennifer Chen",
    type: "extended_break",
    reason: "Had to assist with patient emergency during break time",
    audioRecording: "audio_justification_001.wav",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    duration: 15,
    status: "pending"
  },
  {
    id: "2",
    employee: "Tech Mark Johnson",
    type: "late_arrival",
    reason: "Family emergency - had to drop off sick child at relatives",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: 45,
    status: "pending"
  }
];

export default function HRApp() {
  const { user, logout } = useAuth();
  const [employees] = useState<Employee[]>(mockEmployees);
  const [alerts, setAlerts] = useState<HRAlert[]>(mockAlerts);
  const [justifications, setJustifications] = useState<JustificationRequest[]>(mockJustifications);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      // In production, this would be WebSocket or Server-Sent Events
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'break': return 'text-orange-500';
      case 'offline': return 'text-red-500';
      case 'emergency': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'reviewing' }
          : alert
      )
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' }
          : alert
      )
    );
  };

  const approveJustification = (justificationId: string, notes: string) => {
    setJustifications(prev =>
      prev.map(justification =>
        justification.id === justificationId
          ? { 
              ...justification, 
              status: 'approved',
              reviewedBy: user?.name,
              reviewNotes: notes
            }
          : justification
      )
    );
  };

  const rejectJustification = (justificationId: string, notes: string) => {
    setJustifications(prev =>
      prev.map(justification =>
        justification.id === justificationId
          ? { 
              ...justification, 
              status: 'rejected',
              reviewedBy: user?.name,
              reviewNotes: notes
            }
          : justification
      )
    );
  };

  const playAudioJustification = (audioId: string) => {
    setIsPlayingAudio(audioId);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlayingAudio(null);
    }, 3000);
  };

  const sendMessageToEmployee = (employeeId: string, message: string) => {
    // Simulate sending message to employee's wearable/app
    console.log(`Message sent to ${employeeId}: ${message}`);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All" || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All" || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const offlineEmployees = employees.filter(e => e.status === 'offline').length;
  const onBreakEmployees = employees.filter(e => e.status === 'break').length;
  const emergencyEmployees = employees.filter(e => e.status === 'emergency').length;
  const flaggedEmployees = employees.filter(e => e.flags.length > 0).length;
  const avgComplianceScore = Math.round(employees.reduce((sum, emp) => sum + emp.complianceScore, 0) / employees.length);

  if (!user) return <div>Loading...</div>;

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
                <Badge variant="default" className="bg-pulse-green">PulseMonitor HR</Badge>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <SessionTimer />
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                HR Officer
              </Badge>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {alerts.filter(a => a.status === 'new').length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {alerts.filter(a => a.status === 'new').length}
                  </Badge>
                )}
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
        {/* Overview Cards */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-400">{activeEmployees}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Break</p>
                  <p className="text-2xl font-bold text-orange-400">{onBreakEmployees}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-red-400">{offlineEmployees}</p>
                </div>
                <UserX className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Emergency</p>
                  <p className="text-2xl font-bold text-red-600">{emergencyEmployees}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                  <p className="text-2xl font-bold text-yellow-400">{flaggedEmployees}</p>
                </div>
                <Flag className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                  <p className="text-2xl font-bold text-blue-400">{avgComplianceScore}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="justifications">Justifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          {/* Live Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Departments</SelectItem>
                      <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="break">On Break</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Employee Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className={`cursor-pointer transition-all hover:shadow-lg ${
                  employee.flags.length > 0 ? 'border-orange-500/50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{employee.name}</h4>
                          <div className={`w-3 h-3 rounded-full ${
                            employee.status === 'active' ? 'bg-green-500' :
                            employee.status === 'break' ? 'bg-orange-500' :
                            employee.status === 'offline' ? 'bg-red-500' :
                            'bg-red-600'
                          }`}></div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {employee.role} • {employee.department}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {employee.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {employee.todayHours}h
                          </div>
                        </div>

                        {/* Health & Compliance Metrics */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Compliance</p>
                            <p className="text-sm font-medium text-blue-500">{employee.complianceScore}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Health</p>
                            <p className={`text-sm font-medium ${getHealthColor(employee.healthScore)}`}>
                              {employee.healthScore}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">HR</p>
                            <p className={`text-sm font-medium ${
                              employee.heartRate > 100 ? 'text-red-500' : 
                              employee.heartRate > 80 ? 'text-orange-500' : 'text-green-500'
                            }`}>
                              {employee.heartRate > 0 ? `${employee.heartRate} BPM` : 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Status Info */}
                        {employee.status === 'break' && employee.breaks.current && (
                          <div className="text-center p-2 bg-orange-500/10 border border-orange-500/20 rounded mb-3">
                            <p className="text-xs text-orange-600">
                              Currently on {employee.breaks.current} break
                            </p>
                          </div>
                        )}

                        {/* Flags */}
                        {employee.flags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {employee.flags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendMessageToEmployee(employee.id, "Please check in with HR")}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className={`${
                  alert.priority === 'critical' ? 'border-red-500 bg-red-500/5' :
                  alert.priority === 'high' ? 'border-orange-500 bg-orange-500/5' :
                  alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-500/5' :
                  'border-blue-500 bg-blue-500/5'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge variant={alert.priority === 'critical' ? 'destructive' : 'outline'}>
                            {alert.priority}
                          </Badge>
                          <Badge variant="secondary">
                            {alert.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span>Employee: {alert.employee}</span>
                          <span>Department: {alert.department}</span>
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>

                        {alert.audioRecording && (
                          <div className="flex items-center gap-2 mb-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => playAudioJustification(alert.audioRecording!)}
                              disabled={isPlayingAudio === alert.audioRecording}
                            >
                              {isPlayingAudio === alert.audioRecording ? (
                                <Pause className="h-3 w-3 mr-1" />
                              ) : (
                                <Play className="h-3 w-3 mr-1" />
                              )}
                              {isPlayingAudio === alert.audioRecording ? 'Playing...' : 'Play Audio'}
                            </Button>
                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {alert.status === 'new' && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Review
                          </Button>
                        )}
                        {alert.status !== 'resolved' && (
                          <Button 
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        )}
                        {alert.status === 'resolved' && (
                          <Badge variant="default">Resolved</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Justifications Tab */}
          <TabsContent value="justifications" className="space-y-6">
            <div className="space-y-4">
              {justifications.map((justification) => (
                <Card key={justification.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{justification.employee}</h4>
                          <Badge variant="outline">
                            {justification.type.replace('_', ' ')}
                          </Badge>
                          {justification.duration && (
                            <Badge variant="secondary">
                              {justification.duration} min
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{justification.reason}</p>
                        
                        <div className="text-xs text-muted-foreground mb-3">
                          Submitted: {justification.timestamp.toLocaleString()}
                        </div>

                        {justification.audioRecording && (
                          <div className="flex items-center gap-2 mb-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => playAudioJustification(justification.audioRecording!)}
                              disabled={isPlayingAudio === justification.audioRecording}
                            >
                              {isPlayingAudio === justification.audioRecording ? (
                                <Pause className="h-3 w-3 mr-1" />
                              ) : (
                                <Play className="h-3 w-3 mr-1" />
                              )}
                              Audio Justification
                            </Button>
                          </div>
                        )}

                        {justification.status !== 'pending' && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                              <strong>Reviewed by:</strong> {justification.reviewedBy}
                            </p>
                            {justification.reviewNotes && (
                              <p className="text-sm mt-1">
                                <strong>Notes:</strong> {justification.reviewNotes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {justification.status === 'pending' ? (
                          <>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => approveJustification(justification.id, "Approved - Valid reason")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => rejectJustification(justification.id, "Rejected - Insufficient justification")}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge variant={justification.status === 'approved' ? 'default' : 'destructive'}>
                            {justification.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Reports</CardTitle>
                  <CardDescription>Generate daily activity reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Daily Attendance
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Compliance Summary
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Health Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Reports</CardTitle>
                  <CardDescription>Weekly analysis and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Weekly Performance
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Break Analysis
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Wellness Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Reports</CardTitle>
                  <CardDescription>Generate specific reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Department Analysis
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Violation History
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Productivity Trends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Communications</CardTitle>
                <CardDescription>Send messages and notifications to employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="message-type">Message Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select message type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                          <SelectItem value="info">Information</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="recipient">Recipient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Employees</SelectItem>
                          <SelectItem value="department">By Department</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      placeholder="Type your message here..."
                      rows={4}
                    />
                  </div>
                  
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedEmployee.name}</CardTitle>
                  <CardDescription>{selectedEmployee.role} • {selectedEmployee.department}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedEmployee(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Employee details content */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Current Status</Label>
                  <p className={`text-sm ${getStatusColor(selectedEmployee.status)}`}>
                    {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{selectedEmployee.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hours Today</Label>
                  <p className="text-sm">{selectedEmployee.todayHours}h</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Compliance Score</Label>
                  <p className="text-sm text-blue-500">{selectedEmployee.complianceScore}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Health Score</Label>
                  <p className={`text-sm ${getHealthColor(selectedEmployee.healthScore)}`}>
                    {selectedEmployee.healthScore}%
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Heart Rate</Label>
                  <p className="text-sm">{selectedEmployee.heartRate > 0 ? `${selectedEmployee.heartRate} BPM` : 'N/A'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium">Today's Breaks</Label>
                <p className="text-sm">
                  {selectedEmployee.breaks.todayCount} breaks • {selectedEmployee.breaks.totalTime} minutes total
                </p>
              </div>
              
              {selectedEmployee.flags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Flags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEmployee.flags.map((flag, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {flag.replace('_', ' ')}
                      </Badge>
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
