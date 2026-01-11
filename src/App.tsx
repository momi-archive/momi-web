import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { HelpPage } from "@/pages/HelpPage";
import { ContactPage } from "@/pages/ContactPage";
import { DesignSystem } from "@/pages/DesignSystem";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/design" element={<DesignSystem />} />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}

export default App;
