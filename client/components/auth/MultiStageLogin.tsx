import { useState, useEffect } from 'react';
import { Fingerprint, Eye, Shield, Loader2, AlertCircle, Watch, CheckCircle, Smartphone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface MultiStageLoginProps {
  onSuccess?: () => void;
}

type AuthStage = 'credentials' | 'biometric' | 'wearable' | 'complete';

interface WearableToken {
  code: string;
  expiresAt: Date;
  deviceId: string;
  verified: boolean;
}

export default function MultiStageLogin({ onSuccess }: MultiStageLoginProps) {
  const { login, loginWithBiometric } = useAuth();
  const [currentStage, setCurrentStage] = useState<AuthStage>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(25);
  
  // Stage 1: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Stage 2: Biometric
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'none'>('none');
  
  // Stage 3: Wearable Token
  const [wearableToken, setWearableToken] = useState<WearableToken | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [wearableConnected, setWearableConnected] = useState(false);
  const [tokenCountdown, setTokenCountdown] = useState(120); // 2 minutes

  useEffect(() => {
    checkBiometricSupport();
    checkWearableConnection();
  }, []);

  // Token countdown timer
  useEffect(() => {
    if (currentStage === 'wearable' && wearableToken && tokenCountdown > 0) {
      const timer = setInterval(() => {
        setTokenCountdown(prev => {
          if (prev <= 1) {
            generateNewToken();
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentStage, wearableToken, tokenCountdown]);

  const checkBiometricSupport = async () => {
    if (window.PublicKeyCredential) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricSupported(available);
        
        // Detect biometric type
        if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
          setBiometricType('face');
        } else {
          setBiometricType('fingerprint');
        }
      } catch {
        setBiometricSupported(false);
      }
    }
  };

  const checkWearableConnection = async () => {
    // Simulate checking for paired wearable device
    setTimeout(() => {
      setWearableConnected(Math.random() > 0.3); // 70% chance of connection
    }, 1000);
  };

  const generateNewToken = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token: WearableToken = {
      code,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
      deviceId: 'WEARABLE_001',
      verified: false
    };
    setWearableToken(token);
    setTokenCountdown(120);
    
    // Simulate sending token to wearable device
    console.log('Token sent to wearable:', code);
  };

  // Stage 1: Credential Authentication
  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await login({ email, password });
      if (success) {
        setCurrentStage('biometric');
        setProgress(50);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 2: Biometric Authentication
  const handleBiometricAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (biometricSupported) {
        // Use WebAuthn for real biometric authentication
        const success = await loginWithBiometric();
        if (success) {
          proceedToWearableStage();
        } else {
          setError('Biometric authentication failed. Please try again.');
        }
      } else {
        // Simulate biometric authentication for demo
        await new Promise(resolve => setTimeout(resolve, 3000));
        proceedToWearableStage();
      }
    } catch (err) {
      setError('Biometric authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToWearableStage = () => {
    setCurrentStage('wearable');
    setProgress(75);
    
    if (wearableConnected) {
      generateNewToken();
    }
  };

  // Stage 3: Wearable Token Verification
  const handleTokenVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!wearableToken) {
        setError('No token available. Please generate a new token.');
        return;
      }

      if (tokenInput === wearableToken.code) {
        // Verify token is still valid
        if (new Date() > wearableToken.expiresAt) {
          setError('Token has expired. A new token has been generated.');
          generateNewToken();
          setTokenInput('');
          return;
        }

        // Complete authentication
        setCurrentStage('complete');
        setProgress(100);
        
        // Small delay for user feedback
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        setError('Invalid token. Please check the code on your wearable device.');
        setTokenInput('');
      }
    } catch (err) {
      setError('Token verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const skipWearableAuth = async () => {
    // Emergency fallback - requires admin approval
    setError('Wearable authentication skipped. Login requires manual HR approval.');
    // In real implementation, this would notify HR for manual verification
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <CardTitle className="text-2xl">PulseNet™ Secure Login</CardTitle>
          <CardDescription>
            Multi-stage authentication for maximum security
          </CardDescription>
          
          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStage === 'credentials' ? '1' : currentStage === 'biometric' ? '2' : currentStage === 'wearable' ? '3' : '4'} of 3</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Stage 1: Credentials */}
          {currentStage === 'credentials' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Step 1: Credentials</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your username and password
                </p>
              </div>
              
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
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Continue to Biometric Scan'
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="space-y-3">
                <div className="text-center">
                  <h4 className="text-sm font-medium mb-2">Demo Accounts</h4>
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
            </div>
          )}

          {/* Stage 2: Biometric */}
          {currentStage === 'biometric' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Step 2: Biometric Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Use your {biometricType === 'face' ? 'Face ID' : 'fingerprint'} to continue
                </p>
              </div>

              <div className="text-center py-8">
                <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  {biometricType === 'face' ? (
                    <Eye className="h-10 w-10 text-primary" />
                  ) : (
                    <Fingerprint className="h-10 w-10 text-primary" />
                  )}
                </div>
                
                {biometricSupported ? (
                  <Badge variant="default">
                    {biometricType === 'face' ? 'Face ID' : 'Fingerprint'} Available
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Simulated Biometric (Demo Mode)
                  </Badge>
                )}
              </div>

              <Button 
                onClick={handleBiometricAuth}
                disabled={isLoading}
                className="w-full h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    {biometricType === 'face' ? (
                      <Eye className="h-5 w-5 mr-2" />
                    ) : (
                      <Fingerprint className="h-5 w-5 mr-2" />
                    )}
                    Start Biometric Scan
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Stage 3: Wearable Token */}
          {currentStage === 'wearable' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Step 3: Wearable Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your wearable device
                </p>
              </div>

              {wearableConnected ? (
                <>
                  <div className="text-center py-6">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <Watch className="h-8 w-8 text-green-500" />
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Wearable Connected
                    </Badge>
                  </div>

                  {wearableToken && (
                    <div className="space-y-4">
                      <Alert>
                        <Watch className="h-4 w-4" />
                        <AlertDescription>
                          Check your wearable device for a 6-digit verification code.
                          <br />
                          <span className="text-sm text-muted-foreground">
                            Code expires in: {formatTime(tokenCountdown)}
                          </span>
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <Label htmlFor="token">6-Digit Code</Label>
                        <Input
                          id="token"
                          type="text"
                          placeholder="000000"
                          value={tokenInput}
                          onChange={(e) => setTokenInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="text-center text-2xl tracking-widest"
                          maxLength={6}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleTokenVerification}
                          disabled={isLoading || tokenInput.length !== 6}
                          className="flex-1"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify Code'
                          )}
                        </Button>
                        
                        <Button 
                          onClick={generateNewToken}
                          variant="outline"
                          disabled={isLoading}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Demo: Show the actual token for testing */}
                      <div className="text-center">
                        <Badge variant="outline" className="text-xs">
                          Demo Code: {wearableToken.code}
                        </Badge>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <Badge variant="destructive">
                      Wearable Not Connected
                    </Badge>
                  </div>

                  <Alert>
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      Your wearable device is not connected. Please ensure it's powered on and within range.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button 
                      onClick={checkWearableConnection}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Connection
                    </Button>
                    
                    <Button 
                      onClick={skipWearableAuth}
                      variant="outline"
                      className="flex-1"
                    >
                      Emergency Skip
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stage 4: Complete */}
          {currentStage === 'complete' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-green-500 mb-2">
                  Authentication Complete
                </h3>
                <p className="text-sm text-muted-foreground">
                  All security checks passed. Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <Shield className="h-3 w-3 inline mr-1" />
            Multi-stage authentication • Biometric verified • Wearable secured
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
