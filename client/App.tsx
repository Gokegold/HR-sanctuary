import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import EmployeeApp from "./pages/EmployeeApp";
import HRApp from "./pages/HRApp";
import AdminApp from "./pages/AdminApp";
import ExecutiveApp from "./pages/ExecutiveApp";

// New enhanced pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import BreakCenter from "./pages/employee/BreakCenter";
import Emergency from "./pages/employee/Emergency";
import Tasks from "./pages/employee/Tasks";
import Notifications from "./pages/employee/Notifications";
import Compliance from "./pages/employee/Compliance";
import HRDashboard from "./pages/hr/HRDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Health from "./pages/Health";
import WearableApp from "./pages/WearableApp";
import WorkstationApp from "./pages/WorkstationApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Employee routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <EmployeeApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-home"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/break-center"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <BreakCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/emergency"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <Emergency />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/tasks"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/notifications"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/compliance"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <Compliance />
                </ProtectedRoute>
              }
            />

            {/* HR routes */}
            <Route
              path="/hr"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <HRApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr-app"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <HRDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Executive routes */}
            <Route
              path="/executive"
              element={
                <ProtectedRoute allowedRoles={["executive"]}>
                  <ExecutiveApp />
                </ProtectedRoute>
              }
            />

            {/* Shared utility routes (accessible to all authenticated users) */}
            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <Health />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wearable-app"
              element={
                <ProtectedRoute>
                  <WearableApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workstation"
              element={
                <ProtectedRoute>
                  <WorkstationApp />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Safe root mounting to prevent double root creation
const container = document.getElementById("root");
if (container && !container.hasAttribute("data-root-initialized")) {
  container.setAttribute("data-root-initialized", "true");
  const root = createRoot(container);
  root.render(<App />);
}
