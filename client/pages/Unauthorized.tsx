import { Link } from "react-router-dom";
import { Shield, AlertTriangle, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Unauthorized() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-500">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          {user && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Logged in as: <span className="font-medium">{user.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Role:{" "}
                <span className="font-medium capitalize">{user.role}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Department:{" "}
                <span className="font-medium">{user.department}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm">
              This area requires specific role permissions. Please contact your
              administrator if you believe this is an error.
            </p>

            <div className="flex flex-col gap-2">
              <Link to="/">
                <Button className="w-full" variant="default">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Button>
              </Link>

              <Button onClick={logout} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Switch Account
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <Shield className="h-3 w-3 inline mr-1" />
            This access attempt has been logged for security purposes
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
