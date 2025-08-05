import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "hr" | "admin" | "executive";
  department: string;
  avatar?: string;
  biometricId?: string;
  employeeId: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithBiometric: () => Promise<boolean>;
  logout: () => void;
  updateLastActivity: () => void;
  timeUntilLogout: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  biometricData?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before logout

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    role: "employee",
    department: "Emergency Medicine",
    employeeId: "EMP001",
    biometricId: "bio_001",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@hospital.com",
    role: "hr",
    department: "Human Resources",
    employeeId: "HR001",
    biometricId: "bio_002",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@hospital.com",
    role: "admin",
    department: "Administration",
    employeeId: "ADM001",
    biometricId: "bio_003",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@hospital.com",
    role: "executive",
    department: "Executive",
    employeeId: "EXE001",
    biometricId: "bio_004",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timeUntilLogout, setTimeUntilLogout] =
    useState<number>(INACTIVITY_TIMEOUT);

  const isAuthenticated = !!user;

  // Biometric authentication using WebAuthn API (simplified)
  const checkBiometricSupport = async (): Promise<boolean> => {
    if (!window.PublicKeyCredential) {
      console.log("WebAuthn not supported");
      return false;
    }

    try {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error("Biometric check failed:", error);
      return false;
    }
  };

  const simulateBiometricAuth = async (): Promise<string> => {
    // Simulate biometric authentication delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate successful biometric authentication
    return "bio_001"; // Return mock biometric ID
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Mock authentication logic
      const user = mockUsers.find((u) => u.email === credentials.email);
      if (user) {
        setUser(user);
        setLastActivity(Date.now());

        // Store authentication in localStorage for persistence
        localStorage.setItem("pulsenet_user", JSON.stringify(user));
        localStorage.setItem("pulsenet_session", Date.now().toString());

        // Log authentication event
        logAuditEvent("login", user.id, { method: "credentials" });

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const loginWithBiometric = async (): Promise<boolean> => {
    try {
      const isSupported = await checkBiometricSupport();
      if (!isSupported) {
        // Fallback to simulated biometric for demo
        console.log("Using simulated biometric authentication");
      }

      const biometricId = await simulateBiometricAuth();
      const user = mockUsers.find((u) => u.biometricId === biometricId);

      if (user) {
        setUser(user);
        setLastActivity(Date.now());

        localStorage.setItem("pulsenet_user", JSON.stringify(user));
        localStorage.setItem("pulsenet_session", Date.now().toString());

        logAuditEvent("login", user.id, { method: "biometric" });

        return true;
      }
      return false;
    } catch (error) {
      console.error("Biometric login failed:", error);
      return false;
    }
  };

  const logout = () => {
    if (user) {
      logAuditEvent("logout", user.id, { method: "manual" });
    }

    setUser(null);
    localStorage.removeItem("pulsenet_user");
    localStorage.removeItem("pulsenet_session");
  };

  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  const logAuditEvent = (action: string, userId: string, metadata: any) => {
    const auditLog = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      metadata,
      ip: "xxx.xxx.xxx.xxx", // In real implementation, get actual IP
      userAgent: navigator.userAgent,
    };

    console.log("Audit Log:", auditLog);
    // In real implementation, send to audit service
  };

  // Auto-logout timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const remaining = INACTIVITY_TIMEOUT - timeSinceActivity;

      setTimeUntilLogout(remaining);

      if (remaining <= 0) {
        logAuditEvent("logout", user!.id, { method: "timeout" });
        logout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity, user]);

  // Activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => updateLastActivity();

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated]);

  // Restore session on page load
  useEffect(() => {
    const savedUser = localStorage.getItem("pulsenet_user");
    const savedSession = localStorage.getItem("pulsenet_session");

    if (savedUser && savedSession) {
      const sessionTime = parseInt(savedSession);
      const now = Date.now();

      if (now - sessionTime < INACTIVITY_TIMEOUT) {
        setUser(JSON.parse(savedUser));
        setLastActivity(sessionTime);
      } else {
        // Session expired
        localStorage.removeItem("pulsenet_user");
        localStorage.removeItem("pulsenet_session");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithBiometric,
        logout,
        updateLastActivity,
        timeUntilLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
