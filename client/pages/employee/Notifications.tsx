import { Link } from "react-router-dom";
import { Bell, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Notifications() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </CardTitle>
            <CardDescription>
              View system alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This component is under development and will include notification
              management features.
            </p>
            <Link to="/employee-home">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
