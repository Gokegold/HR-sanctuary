import { Link } from "react-router-dom";
import { Users, Activity, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HRApp() {
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
                <Badge variant="default" className="bg-pulse-green">PulseMonitor HR</Badge>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Users className="h-20 w-20 text-pulse-green mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">PulseMonitor HR App</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Live attendance tracking, compliance monitoring, and team analytics for HR Officers
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Under Development
              </CardTitle>
              <CardDescription>
                This powerful HR monitoring dashboard is currently being built with features including:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Live attendance tracking (GPS & biometric verified)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Break monitoring & emergency validation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Alert dashboard for device/compliance issues
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Weekly/monthly productivity reports
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Health risk flagging & vital monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Compliance scoring by department
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Real-time chat with employees
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-green" />
                    Action log for disciplinary history
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Continue with more prompts to help us build out this comprehensive HR monitoring interface.
            </p>
            <Link to="/">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Back to Main Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
