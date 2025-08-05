import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SessionTimer() {
  const { timeUntilLogout, logout, updateLastActivity, user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  const minutes = Math.floor(timeUntilLogout / 60000);
  const seconds = Math.floor((timeUntilLogout % 60000) / 1000);
  
  // Show warning in last 5 minutes
  useEffect(() => {
    setShowWarning(timeUntilLogout <= 5 * 60 * 1000 && timeUntilLogout > 0);
  }, [timeUntilLogout]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const extendSession = () => {
    updateLastActivity();
    setShowWarning(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Always visible timer in header */}
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" />
        <span className={minutes < 5 ? 'text-red-400' : 'text-muted-foreground'}>
          {formatTime(minutes * 60 + seconds)}
        </span>
      </div>

      {/* Warning modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-orange-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <AlertTriangle className="h-5 w-5" />
                Session Expiring Soon
              </CardTitle>
              <CardDescription>
                Your session will expire due to inactivity
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {formatTime(minutes * 60 + seconds)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Time remaining before automatic logout
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={extendSession}
                  className="flex-1"
                  variant="default"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Extend Session
                </Button>
                
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="flex-1"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout Now
                </Button>
              </div>

              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  Security • Auto-logout prevents unauthorized access
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
