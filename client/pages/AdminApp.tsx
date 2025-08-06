import { Link } from "react-router-dom";
import { Command, Activity, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminApp() {
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
                <Badge variant="default" className="bg-pulse-orange">PulseCommand Admin</Badge>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Command className="h-20 w-20 text-pulse-orange mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">PulseCommand Admin</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Department overview, performance management, and team leadership for department heads and administrators
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Under Development
              </CardTitle>
              <CardDescription>
                This comprehensive admin dashboard is currently being built with features including:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    Department overview (HR + productivity + health)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    Role-based access to unit data
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    Task assignment & performance review
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    Escalation logs for repeated breaches
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    Team leaderboard (gamified performance)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    Exportable reports (weekly/monthly)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    Budget-impact scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pulse-orange" />
                    HR escalation notifications
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Loading...
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
