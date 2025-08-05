import { Link } from "react-router-dom";
import { Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRDashboard() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              HR Dashboard
            </CardTitle>
            <CardDescription>
              Comprehensive HR monitoring and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This component is under development and will include HR monitoring features.
            </p>
            <Link to="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Back to Main
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
