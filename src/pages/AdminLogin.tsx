import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasAdminAccount } from "../services/authService";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin-dashboard", { replace: true });
    }
    setAdminExists(hasAdminAccount());
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminExists) {
      setError("No administrator account exists yet. Please complete initial setup first.");
      return;
    }

    setLoading(true);
    const res = await login(email, password, "admin");
    setLoading(false);

    if (res.success) {
      navigate("/admin-dashboard", { replace: true });
    } else {
      setError(res.error || "Authentication failed.");
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-[#0F2B5B] text-[#D4AF37] rounded-full mx-auto text-2xl font-bold shadow">
            🔐
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2B5B]">
            Administrator Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Restricted authentication portal for system triage and firm administration.
          </p>
        </div>

        {!adminExists ? (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-5 text-center space-y-3">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-sm font-bold text-amber-900">
              Initial Setup Required
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              No administrator has been configured on this local installation yet. Please run the one-time initial setup to create your credentials.
            </p>
            <div className="pt-2">
              <Link
                to="/admin-setup"
                className="inline-block px-5 py-2.5 bg-[#0F2B5B] text-[#D4AF37] font-bold text-xs rounded hover:bg-[#163a75] transition-all shadow"
              >
                Run Initial Admin Setup →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Admin Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@legalconnect.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Master Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs sm:text-sm rounded transition-all shadow-md uppercase tracking-wider active:scale-95 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Authorize Admin Access"}
            </button>

            <div className="text-center pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <Link to="/login" className="hover:text-[#0F2B5B] hover:underline">
                ← Citizen & Lawyer Portal
              </Link>
              <Link to="/admin-setup" className="text-slate-400 hover:text-slate-600">
                Setup Wizard
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default AdminLogin;

