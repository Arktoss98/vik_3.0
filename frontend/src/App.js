import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { VikProvider } from "@/lib/vikContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import ChatPage from "@/pages/ChatPage";
import SystemMonitorPage from "@/pages/SystemMonitorPage";
import McpServersPage from "@/pages/McpServersPage";
import ToolSandboxPage from "@/pages/ToolSandboxPage";
import LogsPage from "@/pages/LogsPage";
import SettingsPage from "@/pages/SettingsPage";

function App() {
  return (
    <VikProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/system" element={<SystemMonitorPage />} />
            <Route path="/mcp" element={<McpServersPage />} />
            <Route path="/tools" element={<ToolSandboxPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VikProvider>
  );
}

export default App;
