import { Link } from "react-router-dom";
import { Activity, Users, Command, Brain, Shield, Clock, BarChart3, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const apps = [
  {
    id: "employee",
    title: "PulseNet Employee",
    description: "Biometric check-in, task management, and real-time status tracking",
    icon: Activity,
    color: "pulse-blue",
    features: ["Biometric Sign-in", "Break Management", "Task Dashboard", "Health Monitoring"],
    path: "/employee",
    userType: "All Staff"
  },
  {
    id: "hr",
    title: "PulseMonitor HR",
    description: "Live attendance tracking, compliance monitoring, and team analytics",
    icon: Users,
    color: "pulse-green",
    features: ["Live Tracking", "Alert Dashboard", "Compliance Reports", "Health Risk Flags"],
    path: "/hr",
    userType: "HR Officers"
  },
  {
    id: "admin",
    title: "PulseCommand Admin",
    description: "Department overview, performance management, and team leadership",
    icon: Command,
    color: "pulse-orange",
    features: ["Team Overview", "Performance Review", "Task Assignment", "Budget Impact"],
    path: "/admin",
    userType: "Department Heads"
  },
  {
    id: "executive",
    title: "PulseIntel Executive",
    description: "Organization-wide intelligence, predictive analytics, and executive insights",
    icon: Brain,
    color: "pulse-purple",
    features: ["Bird's-eye View", "Predictive AI", "Board Reports", "Risk Forecasting"],
    path: "/executive",
    userType: "C-Level Executives"
  }
];

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Biometric authentication with geofence validation and encrypted sessions"
  },
  {
    icon: Clock,
    title: "Real-time Monitoring",
    description: "Live presence tracking with 50,000+ events per minute capacity"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Productivity intelligence with predictive insights and board-ready reports"
  },
  {
    icon: Heart,
    title: "Health Integration",
    description: "Wearable pulse monitoring with burnout prevention and wellness tracking"
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 pulse-gradient opacity-10" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Activity className="h-10 w-10 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                PulseNet™
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Real-Time Employee Integrity & Presence Monitoring Ecosystem for institutional monitoring, 
              ensuring presence, performance, accountability, and compliance through intelligent workforce analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="secondary" className="text-sm">
                🏥 Hospitals • 🏫 Medical Schools • 🐾 Veterinary Centers
              </Badge>
              <Badge variant="outline" className="text-sm">
                5,000+ Concurrent Users • 99.99% Uptime
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <p>THE HR SANCTUARY</p>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ letterSpacing: '12px' }}>
            <h1>THE HOME OF SEAMLESS PRODUCTIVITY.</h1>
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => {
            const IconComponent = app.icon;
            return (
              <Card key={app.id} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-${app.color}/20`}>
                      <IconComponent className={`h-6 w-6 text-${app.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {app.userType}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{app.title}</CardTitle>
                  <CardDescription className="text-sm">{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {app.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={app.path}>
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      Access {app.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for mission-critical environments with the highest standards of security, performance, and reliability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Status Dashboard Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real-Time Monitoring Dashboard</h2>
          <p className="text-muted-foreground">
            Live status indicators and productivity metrics across your entire organization
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="status-indicator active"></div>
                <span className="text-2xl font-bold text-green-400">847</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Employees</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="status-indicator break"></div>
                <span className="text-2xl font-bold text-orange-400">23</span>
              </div>
              <p className="text-sm text-muted-foreground">On Break</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="status-indicator inactive"></div>
                <span className="text-2xl font-bold text-red-400">5</span>
              </div>
              <p className="text-sm text-muted-foreground">Non-Compliant</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-primary">94.2%</span>
              </div>
              <p className="text-sm text-muted-foreground">Productivity Score</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              🔄 Updates every 30 seconds • 📊 Real-time analytics • 🎯 Performance tracking
            </p>
            <Button variant="outline">
              View Full Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold">PulseNet™</span>
              <Badge variant="secondary" className="ml-2">Enterprise</Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Real-Time Employee Integrity & Presence Monitoring<br />
              Built for mission-critical institutional environments
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
