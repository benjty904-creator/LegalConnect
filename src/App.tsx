import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import FreeLegalAssistance from "./pages/FreeLegalAssistance";
import PaidLegalServices from "./pages/PaidLegalServices";
import FindLawyer from "./pages/FindLawyer";
import LawyerProfile from "./pages/LawyerProfile";
import RequestService from "./pages/RequestService";
import AnonymousReporting from "./pages/AnonymousReporting";
import LegalHelpGuide from "./pages/LegalHelpGuide";
import UserDashboard from "./pages/UserDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminSetup from "./pages/AdminSetup";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
          <Navbar />

          <main className="grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/free-legal-assistance" element={<FreeLegalAssistance />} />
              <Route path="/paid-legal-services" element={<PaidLegalServices />} />
              <Route path="/find-a-lawyer" element={<FindLawyer />} />
              <Route path="/lawyer/:id" element={<LawyerProfile />} />
              <Route path="/request-service" element={<RequestService />} />
              <Route path="/anonymous-reporting" element={<AnonymousReporting />} />
              <Route path="/legal-help-guide" element={<LegalHelpGuide />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Administrator Dedicated Setup & Login */}
              <Route path="/admin-setup" element={<AdminSetup />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Protected Citizen Dashboard */}
              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["citizen", "admin"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Advocate Dashboard */}
              <Route
                path="/lawyer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["lawyer", "admin"]}>
                    <LawyerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Super Administrator Dashboard */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
