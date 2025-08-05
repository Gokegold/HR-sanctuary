import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Home, 
  Mic, 
  MicOff, 
  Phone, 
  Shield, 
  MapPin, 
  Clock, 
  FileText, 
  Send,
  Activity,
  Bell,
  Settings,
  LogOut,
  Play,
  Square,
  Upload,
  Camera,
  Video,
  Heart,
  User,
  Building,
  Siren
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import SessionTimer from "@/components/auth/SessionTimer";

interface EmergencyType {
  id: string;
  label: string;
  icon: any;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiresImmediate: boolean;
  description: string;
}

interface EmergencyReport {
  id: string;
  type: string;
  timestamp: Date;
  location: string;
  description: string;
  audioRecording?: string;
  photos?: string[];
  witnesses?: string[];
  status: 'reported' | 'acknowledged' | 'responding' | 'resolved';
  responseTime?: number;
}

const emergencyTypes: EmergencyType[] = [
  {
    id: "medical",
    label: "Medical Emergency",
    icon: Heart,
    color: "red",
    priority: "critical",
    requiresImmediate: true,
    description: "Health-related emergency requiring immediate medical attention"
  },
  {
    id: "fire",
    label: "Fire Emergency",
    icon: Siren,
    color: "red",
    priority: "critical",
    requiresImmediate: true,
    description: "Fire or smoke detected, evacuation may be required"
  },
  {
    id: "security",
    label: "Security Threat",
    icon: Shield,
    color: "red",
    priority: "high",
    requiresImmediate: true,
    description: "Security breach, unauthorized access, or threat to safety"
  },
  {
    id: "accident",
    label: "Accident/Injury",
    icon: AlertTriangle,
    color: "orange",
    priority: "high",
    requiresImmediate: true,
    description: "Workplace accident or injury requiring assistance"
  },
  {
    id: "equipment",
    label: "Equipment Failure",
    icon: Settings,
    color: "yellow",
    priority: "medium",
    requiresImmediate: false,
    description: "Critical equipment malfunction affecting operations"
  },
  {
    id: "environmental",
    label: "Environmental Hazard",
    icon: AlertTriangle,
    color: "orange",
    priority: "high",
    requiresImmediate: true,
    description: "Chemical spill, gas leak, or environmental danger"
  },
  {
    id: "other",
    label: "Other Emergency",
    icon: AlertTriangle,
    color: "gray",
    priority: "medium",
    requiresImmediate: false,
    description: "Other emergency situation not listed above"
  }
];

// Mock emergency reports
const recentReports: EmergencyReport[] = [
  {
    id: "1",
    type: "equipment",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    location: "OR 3",
    description: "Ventilator malfunction during procedure",
    status: "resolved",
    responseTime: 5
  },
  {
    id: "2",
    type: "medical",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    location: "Ward B",
    description: "Patient collapse, immediate assistance required",
    status: "resolved",
    responseTime: 2
  }
];

export default function Emergency() {
  const { user, logout } = useAuth();
  const [activeReport, setActiveReport] = useState<EmergencyReport | null>(null);
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [witnesses, setWitnesses] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const submitEmergencyReport = async () => {
    if (!selectedType || !description.trim()) {
      alert('Please select emergency type and provide description');
      return;
    }

    setIsSubmitting(true);

    const newReport: EmergencyReport = {
      id: Date.now().toString(),
      type: selectedType.id,
      timestamp: new Date(),
      location: location || "Current Location",
      description: description.trim(),
      witnesses: witnesses ? witnesses.split(',').map(w => w.trim()) : [],
      status: 'reported'
    };

    // Simulate emergency reporting delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setActiveReport(newReport);
    setIsSubmitting(false);

    // Auto-escalate critical emergencies
    if (selectedType.requiresImmediate) {
      // Simulate immediate response
      setTimeout(() => {
        setActiveReport(prev => prev ? { ...prev, status: 'acknowledged' } : null);
      }, 5000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                <Badge variant="destructive">Emergency Center</Badge>
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
        {/* Active Emergency Alert */}
        {activeReport && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <Siren className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Emergency Reported:</strong> {emergencyTypes.find(et => et.id === activeReport.type)?.label}
                  <br />
                  <span className="text-sm">
                    Report ID: {activeReport.id} • Status: {activeReport.status.toUpperCase()}
                  </span>
                </div>
                <Badge variant={activeReport.status === 'resolved' ? 'default' : 'destructive'}>
                  {activeReport.status}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="report">Report Emergency</TabsTrigger>
            <TabsTrigger value="status">Status & Response</TabsTrigger>
            <TabsTrigger value="history">Recent Reports</TabsTrigger>
          </TabsList>

          {/* Report Emergency Tab */}
          <TabsContent value="report" className="space-y-6">
            {!activeReport ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-500">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Reporting
                    </CardTitle>
                    <CardDescription>
                      Report emergencies immediately for rapid response
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-6">
                      <Phone className="h-4 w-4" />
                      <AlertDescription>
                        <strong>For life-threatening emergencies, call 911 immediately.</strong>
                        <br />This system supplements but does not replace emergency services.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                      {/* Emergency Type Selection */}
                      <div>
                        <Label className="text-base font-medium mb-4 block">Select Emergency Type</Label>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {emergencyTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                              <Card 
                                key={type.id}
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                  selectedType?.id === type.id ? 'border-red-500 bg-red-500/10' : 'hover:border-red-500/50'
                                }`}
                                onClick={() => setSelectedType(type)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg bg-${type.color}-500/20`}>
                                      <IconComponent className={`h-5 w-5 text-${type.color}-500`} />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{type.label}</h4>
                                      <Badge 
                                        variant={type.priority === 'critical' ? 'destructive' : 'outline'}
                                        className="text-xs"
                                      >
                                        {type.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{type.description}</p>
                                  {type.requiresImmediate && (
                                    <Badge variant="destructive" className="text-xs mt-2">
                                      Immediate Response
                                    </Badge>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {selectedType && (
                        <>
                          {/* Location */}
                          <div>
                            <Label htmlFor="location">Current Location</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                id="location"
                                placeholder="Building, Room, Floor, etc."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                              />
                              <Button variant="outline" size="icon">
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                              id="description"
                              placeholder="Provide detailed description of the emergency situation..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={4}
                              className="mt-1"
                            />
                          </div>

                          {/* Voice Recording */}
                          <div>
                            <Label className="text-base font-medium mb-2 block">Voice Recording (Optional)</Label>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Button
                                  onClick={isRecording ? stopRecording : startRecording}
                                  variant={isRecording ? "destructive" : "outline"}
                                  size="lg"
                                >
                                  {isRecording ? (
                                    <>
                                      <Square className="h-5 w-5 mr-2" />
                                      Stop Recording
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="h-5 w-5 mr-2" />
                                      Start Recording
                                    </>
                                  )}
                                </Button>
                                
                                {isRecording && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="font-mono text-lg">
                                      {formatTime(recordingDuration)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {audioBlob && !isRecording && (
                                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                                  <Play className="h-5 w-5 text-green-500" />
                                  <span className="text-sm">Audio recorded ({formatTime(recordingDuration)})</span>
                                  <Button variant="ghost" size="sm" onClick={() => setAudioBlob(null)}>
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Witnesses */}
                          <div>
                            <Label htmlFor="witnesses">Witnesses (Optional)</Label>
                            <Input
                              id="witnesses"
                              placeholder="Names of witnesses, separated by commas"
                              value={witnesses}
                              onChange={(e) => setWitnesses(e.target.value)}
                              className="mt-1"
                            />
                          </div>

                          {/* Submit Button */}
                          <Button 
                            onClick={submitEmergencyReport}
                            disabled={isSubmitting || !description.trim()}
                            className={`w-full ${selectedType.requiresImmediate ? 'bg-red-600 hover:bg-red-700' : ''}`}
                            size="lg"
                          >
                            {isSubmitting ? (
                              <>
                                <Activity className="h-5 w-5 mr-2 animate-spin" />
                                Submitting Emergency Report...
                              </>
                            ) : (
                              <>
                                <Send className="h-5 w-5 mr-2" />
                                Submit Emergency Report
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-red-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <Siren className="h-5 w-5" />
                    Emergency Report Submitted
                  </CardTitle>
                  <CardDescription>
                    Your emergency report has been submitted and response is being coordinated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Report Confirmation</h3>
                      <p className="text-2xl font-bold text-red-500 mb-2">#{activeReport.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Report submitted at {activeReport.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Emergency Type</Label>
                        <p className="text-sm">{emergencyTypes.find(et => et.id === activeReport.type)?.label}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Location</Label>
                        <p className="text-sm">{activeReport.location}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium">Description</Label>
                        <p className="text-sm">{activeReport.description}</p>
                      </div>
                    </div>

                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Response team has been notified. Please remain in your current location unless instructed otherwise.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={() => setActiveReport(null)}
                      variant="outline" 
                      className="w-full"
                    >
                      Report Another Emergency
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Status & Response Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Response Status
                </CardTitle>
                <CardDescription>
                  Real-time status of emergency response
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeReport ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge 
                        variant={activeReport.status === 'resolved' ? 'default' : 'destructive'}
                        className="text-lg px-4 py-2"
                      >
                        {activeReport.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        activeReport.status === 'reported' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-muted'
                      }`}>
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Emergency Reported</p>
                          <p className="text-sm text-muted-foreground">
                            {activeReport.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        ['acknowledged', 'responding', 'resolved'].includes(activeReport.status) ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-muted opacity-50'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          ['acknowledged', 'responding', 'resolved'].includes(activeReport.status) ? 'bg-orange-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">Response Team Notified</p>
                          <p className="text-sm text-muted-foreground">
                            {['acknowledged', 'responding', 'resolved'].includes(activeReport.status) ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        ['responding', 'resolved'].includes(activeReport.status) ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-muted opacity-50'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          ['responding', 'resolved'].includes(activeReport.status) ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">Response in Progress</p>
                          <p className="text-sm text-muted-foreground">
                            {['responding', 'resolved'].includes(activeReport.status) ? 'In Progress' : 'Pending'}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        activeReport.status === 'resolved' ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted opacity-50'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          activeReport.status === 'resolved' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">Emergency Resolved</p>
                          <p className="text-sm text-muted-foreground">
                            {activeReport.status === 'resolved' ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Emergency response procedures are being followed. Updates will appear here automatically.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No active emergency reports
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Emergency Reports
                </CardTitle>
                <CardDescription>
                  Previous emergency reports and their outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No previous emergency reports
                    </div>
                  ) : (
                    recentReports.map((report) => {
                      const emergencyType = emergencyTypes.find(et => et.id === report.type);
                      const IconComponent = emergencyType?.icon || AlertTriangle;
                      
                      return (
                        <div key={report.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className={`p-2 rounded-lg bg-${emergencyType?.color}-500/20`}>
                            <IconComponent className={`h-5 w-5 text-${emergencyType?.color}-500`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{emergencyType?.label}</h4>
                              <Badge variant="outline">#{report.id}</Badge>
                              {report.responseTime && (
                                <Badge variant="secondary">
                                  {report.responseTime}min response
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                            <div className="text-xs text-muted-foreground">
                              {report.timestamp.toLocaleString()} • {report.location}
                            </div>
                          </div>
                          <Badge variant={report.status === 'resolved' ? 'default' : 'destructive'}>
                            {report.status}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
