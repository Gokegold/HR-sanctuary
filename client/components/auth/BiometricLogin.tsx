import { useState, useEffect } from 'react';
import { Fingerprint, Eye, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface BiometricLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function BiometricLogin({ onSuccess, redirectTo }: BiometricLoginProps) {
  const { login, loginWithBiometric } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricSupported, setBiometricSupported] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check biometric support
    const checkSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricSupported(available);
        } catch {
          setBiometricSupported(false);
        }
      }
    };
    checkSupport();
  }, []);

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await login({ email, password });
      if (success) {
        onSuccess?.();
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    setError(null);

    try {
      const success = await loginWithBiometric();
      if (success) {
        onSuccess?.();
      } else {
        setError('Biometric authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Biometric authentication failed. Please try again.');
    } finally {
      setBiometricLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'sarah.johnson@hospital.com', role: 'Employee' },
    { email: 'michael.chen@hospital.com', role: 'HR Officer' },
    { email: 'emily.rodriguez@hospital.com', role: 'Admin' },
    { email: 'james.wilson@hospital.com', role: 'Executive' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">PulseNet™ Login</CardTitle>
          <CardDescription>
            Secure access to your productivity monitoring dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Biometric Login */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium mb-2">Biometric Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use your fingerprint or face ID for secure access
              </p>
            </div>
            
            <Button 
              onClick={handleBiometricLogin}
              disabled={biometricLoading || !biometricSupported}
              className="w-full h-12"
              variant="default"
            >
              {biometricLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint className="h-5 w-5 mr-2" />
                  Biometric Login
                </>
              )}
            </Button>
            
            {!biometricSupported && (
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Simulated biometric for demo
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Credential Login */}
          <form onSubmit={handleCredentialLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in with Credentials'
              )}
            </Button>
          </form>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Demo Credentials */}
          <div className="space-y-3">
            <Separator />
            <div className="text-center">
              <h4 className="text-sm font-medium mb-2">Demo Accounts</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Click to auto-fill credentials (password: demo123)
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {demoCredentials.map((cred, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword('demo123');
                  }}
                >
                  <Badge variant="secondary" className="mr-2 text-xs">
                    {cred.role}
                  </Badge>
                  {cred.email}
                </Button>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <Shield className="h-3 w-3 inline mr-1" />
            Enterprise-grade security • Biometric verified • Audit logged
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
