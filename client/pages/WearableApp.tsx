import { Link } from "react-router-dom";
import { Watch, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WearableApp() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Watch className="h-6 w-6" />
              Wearable Companion
            </CardTitle>
            <CardDescription>
              Biometric wearable device management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This component is under development and will include wearable
              device features.
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
