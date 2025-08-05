import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Command, 
  Activity, 
  Home, 
  Bell, 
  Settings, 
  LogOut,
  Users,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Calendar,
  FileText,
  UserPlus,
  Building,
  Zap,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RefreshCw
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
  wearableId?: string;
  healthScore: number;
  breaks: number;
  tasks: { completed: number; total: number };
}

interface Department {
  name: string;
  employees: number;
  activeCount: number;
  complianceScore: number;
  productivity: number;
  manager: string;
}

interface Alert {
  id: string;
  type: 'emergency' | 'compliance' | 'device' | 'health' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  employee: string;
  department: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
}

// Mock data
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
    wearableId: "WEAR001",
    healthScore: 85,
    breaks: 2,
    tasks: { completed: 8, total: 10 }
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
    wearableId: "WEAR002",
    healthScore: 78,
    breaks: 3,
    tasks: { completed: 12, total: 15 }
  },
  {
    id: "3",
    name: "Dr. Michael Rodriguez",
    department: "Surgery",
    role: "Surgeon",
    status: "active",
    location: "OR 3",
    lastActivity: new Date(Date.now() - 2 * 60 * 1000),
    todayHours: 8.1,
    complianceScore: 95,
    wearableId: "WEAR003",
    healthScore: 90,
    breaks: 1,
    tasks: { completed: 5, total: 6 }
  },
  {
    id: "4",
    name: "Tech David Wilson",
    department: "Laboratory",
    role: "Lab Technician",
    status: "offline",
    location: "Unknown",
    lastActivity: new Date(Date.now() - 45 * 60 * 1000),
    todayHours: 3.8,
    complianceScore: 76,
    healthScore: 82,
    breaks: 4,
    tasks: { completed: 7, total: 12 }
  }
];

const mockDepartments: Department[] = [
  {
    name: "Emergency Medicine",
    employees: 45,
    activeCount: 38,
    complianceScore: 94,
    productivity: 87,
    manager: "Dr. Sarah Johnson"
  },
  {
    name: "ICU",
    employees: 32,
    activeCount: 28,
    complianceScore: 91,
    productivity: 92,
    manager: "Head Nurse Patricia"
  },
  {
    name: "Surgery",
    employees: 28,
    activeCount: 25,
    complianceScore: 96,
    productivity: 89,
    manager: "Dr. Michael Rodriguez"
  },
  {
    name: "Laboratory",
    employees: 18,
    activeCount: 14,
    complianceScore: 88,
    productivity: 85,
    manager: "Lab Supervisor Kim"
  }
];

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "device",
    priority: "high",
    title: "Wearable Device Removed",
    description: "Device WEAR004 removed without proper authorization",
    employee: "Tech Sarah Miller",
    department: "Radiology",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "active"
  },
  {
    id: "2",
    type: "compliance",
    priority: "medium",
    title: "Extended Break Duration",
    description: "Break exceeding 30-minute limit by 15 minutes",
    employee: "Nurse John Davis",
    department: "Pediatrics",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: "acknowledged"
  },
  {
    id: "3",
    type: "health",
    priority: "critical",
    title: "Health Alert - Elevated Stress",
    description: "Continuous elevated heart rate and stress indicators",
    employee: "Dr. Lisa Wang",
    department: "Emergency",
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    status: "active"
  }
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [employees] = useState<Employee[]>(mockEmployees);
  const [departments] = useState<Department[]>(mockDepartments);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random status changes
      // In real app, this would be WebSocket updates
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'acknowledged' }
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

  const generateReport = async (type: string) => {
    setIsGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
    
    // In real app, this would trigger download
    console.log(`${type} report generated`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'break': return 'text-orange-500';
      case 'offline': return 'text-red-500';
      case 'emergency': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
  const activeEmployees = departments.reduce((sum, dept) => sum + dept.activeCount, 0);
  const avgComplianceScore = Math.round(departments.reduce((sum, dept) => sum + dept.complianceScore, 0) / departments.length);
  const avgProductivity = Math.round(departments.reduce((sum, dept) => sum + dept.productivity, 0) / departments.length);

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
                <Badge variant="default" className="bg-pulse-orange">Admin Dashboard</Badge>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <SessionTimer />
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Access
              </Badge>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {alerts.filter(a => a.status === 'active').length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {alerts.filter(a => a.status === 'active').length}
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-bold">{totalEmployees}</p>
                  <p className="text-sm text-green-500">↗ +3 this week</p>
                </div>
                <Users className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Currently Active</p>
                  <p className="text-3xl font-bold text-green-400">{activeEmployees}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((activeEmployees / totalEmployees) * 100)}% online
                  </p>
                </div>
                <Activity className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-3xl font-bold text-blue-400">{avgComplianceScore}%</p>
                  <p className="text-sm text-blue-400">↗ +2% this month</p>
                </div>
                <Shield className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Productivity</p>
                  <p className="text-3xl font-bold text-orange-400">{avgProductivity}%</p>
                  <p className="text-sm text-orange-400">↗ +5% this week</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Live Presence Map */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Live Presence Map
                  </CardTitle>
                  <CardDescription>Real-time employee locations and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {departments.map((dept) => (
                      <div key={dept.name} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{dept.name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Active:</span>
                            <span className="text-green-500">{dept.activeCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total:</span>
                            <span>{dept.employees}</span>
                          </div>
                          <Progress 
                            value={(dept.activeCount / dept.employees) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Critical Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Critical Alerts
                  </CardTitle>
                  <CardDescription>
                    {alerts.filter(a => a.status === 'active').length} active alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.filter(a => a.status === 'active').slice(0, 3).map((alert) => (
                      <div 
                        key={alert.id}
                        className={`p-3 border rounded-lg ${getAlertColor(alert.priority)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{alert.title}</h5>
                            <p className="text-xs text-muted-foreground">{alert.employee}</p>
                            <p className="text-xs text-muted-foreground">
                              {alert.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge 
                            variant={alert.priority === 'critical' ? 'destructive' : 'outline'}
                            className="text-xs"
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Department Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.name} className="grid grid-cols-5 gap-4 items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">{dept.manager}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{dept.employees}</p>
                        <p className="text-xs text-muted-foreground">Employees</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{dept.activeCount}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-500">{dept.complianceScore}%</p>
                        <p className="text-xs text-muted-foreground">Compliance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">{dept.productivity}%</p>
                        <p className="text-xs text-muted-foreground">Productivity</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
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
                      {departments.map(dept => (
                        <SelectItem key={dept.name} value={dept.name}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Employee List */}
            <div className="space-y-4">
              {employees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${
                          employee.status === 'active' ? 'bg-green-500' :
                          employee.status === 'break' ? 'bg-orange-500' :
                          employee.status === 'offline' ? 'bg-red-500' :
                          'bg-red-600'
                        }`}></div>
                        <div>
                          <h4 className="font-semibold">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {employee.role} • {employee.department}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {employee.location} • Last active: {employee.lastActivity.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">{employee.todayHours}h</p>
                          <p className="text-xs text-muted-foreground">Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-blue-500">{employee.complianceScore}%</p>
                          <p className="text-xs text-muted-foreground">Compliance</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-500">{employee.healthScore}%</p>
                          <p className="text-xs text-muted-foreground">Health</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{employee.tasks.completed}/{employee.tasks.total}</p>
                          <p className="text-xs text-muted-foreground">Tasks</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className={getAlertColor(alert.priority)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <Badge 
                              variant={alert.priority === 'critical' ? 'destructive' : 'outline'}
                            >
                              {alert.priority}
                            </Badge>
                            <Badge variant="outline">
                              {alert.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Employee: {alert.employee}</span>
                            <span>Department: {alert.department}</span>
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {alert.status === 'active' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                Acknowledge
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => resolveAlert(alert.id)}
                              >
                                Resolve
                              </Button>
                            </>
                          )}
                          {alert.status === 'acknowledged' && (
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

              <Card>
                <CardHeader>
                  <CardTitle>Alert Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Critical</span>
                      <Badge variant="destructive">
                        {alerts.filter(a => a.priority === 'critical' && a.status === 'active').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High</span>
                      <Badge variant="outline" className="text-orange-500">
                        {alerts.filter(a => a.priority === 'high' && a.status === 'active').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium</span>
                      <Badge variant="outline" className="text-yellow-500">
                        {alerts.filter(a => a.priority === 'medium' && a.status === 'active').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low</span>
                      <Badge variant="outline" className="text-blue-500">
                        {alerts.filter(a => a.priority === 'low' && a.status === 'active').length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Reports</CardTitle>
                  <CardDescription>Employee activity and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('daily-activity')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Daily Activity
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('daily-compliance')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Compliance Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Reports</CardTitle>
                  <CardDescription>Comprehensive analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('weekly-productivity')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Productivity Trends
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('weekly-health')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Health Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Reports</CardTitle>
                  <CardDescription>Executive summaries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('monthly-executive')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Executive Summary
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('monthly-financial')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Financial Impact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Reports</CardTitle>
                  <CardDescription>Generate specific analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('custom-anomalies')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Anomaly Report
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generateReport('custom-department')}
                      disabled={isGeneratingReport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Department Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isGeneratingReport && (
              <Alert>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Generating report... This may take a few moments for large datasets.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Controls</CardTitle>
                  <CardDescription>Global system management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Send System Alert
                  </Button>
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All Devices
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Controls</CardTitle>
                  <CardDescription>Emergency response management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Lockdown
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Mass Notification
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Alert
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance</CardTitle>
                  <CardDescription>System maintenance tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Backup Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Diagnostics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
