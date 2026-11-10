import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasAdminAccount } from "../services/authService";
import { UserRole } from "../types";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "admin" && !hasAdminAccount()) {
      setError("No administrator account has been created yet. Please run the initial admin setup.");
      return;
    }

    setLoading(true);
    const res = await login(email, password, role);
    setLoading(false);

    if (res.success) {
      if (role === "citizen") {
        navigate("/user-dashboard", { replace: true });
      } else if (role === "lawyer") {
        navigate("/lawyer-dashboard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      }
    } else {
      setError(res.error || "Authentication failed. Please verify your credentials.");
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#F8FAFC] flex items-center justify-center py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2B5B]">
            Account Portal Log In
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select your account role to access your personalized dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs sm:text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setRole("citizen");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-md transition-all ${
              role === "citizen"
                ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            👤 Citizen
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("lawyer");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-md transition-all ${
              role === "lawyer"
                ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚖️ Lawyer
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("admin");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-md transition-all ${
              role === "admin"
                ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🛡️ Admin
          </button>
        </div>

        {role === "admin" && !hasAdminAccount() && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 space-y-1">
            <p className="font-bold">Initial Admin Setup Needed</p>
            <p>No administrator account has been set up yet.</p>
            <Link to="/admin-setup" className="inline-block text-[#0F2B5B] font-bold underline mt-1">
              Click here to perform initial setup →
            </Link>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder={
                role === "citizen"
                  ? "name@example.com"
                  : role === "lawyer"
                  ? "barr.name@example.com"
                  : "admin@legalconnect.ng"
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs sm:text-sm rounded transition-all shadow-md uppercase tracking-wider active:scale-95 disabled:opacity-50"
          >
            {loading ? "Verifying..." : `Log In as ${role.toUpperCase()}`}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 flex flex-col gap-2">
          {role !== "admin" ? (
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#0F2B5B] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Need administrator setup?{" "}
              <Link to="/admin-setup" className="text-[#0F2B5B] font-bold hover:underline">
                Initial Admin Setup
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;
