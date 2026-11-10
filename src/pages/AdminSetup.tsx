import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasAdminAccount } from "../services/authService";

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { createAdminAccount } = useAuth();

  const [alreadyInitialized, setAlreadyInitialized] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (hasAdminAccount()) {
      setAlreadyInitialized(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (alreadyInitialized || hasAdminAccount()) {
      setError("An administrator account already exists. For security, setup can only be executed once.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await createAdminAccount({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } else {
      setError(res.error || "Failed to initialize administrator account.");
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-[#0F2B5B] text-[#D4AF37] rounded-full mx-auto text-2xl font-bold shadow-md">
            🛡️
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2B5B]">
            Administrator Initial Setup
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            One-time controlled creation of the system super-administrator account.
          </p>
        </div>

        {alreadyInitialized ? (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-5 text-center space-y-3">
            <span className="text-2xl">🔒</span>
            <h3 className="text-sm font-bold text-amber-900">
              Administrator Setup Completed
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              An administrator account has already been registered on this system. New administrator accounts cannot be generated through the setup wizard.
            </p>
            <div className="pt-2">
              <Link
                to="/admin-login"
                className="inline-block px-5 py-2.5 bg-[#0F2B5B] text-[#D4AF37] font-bold text-xs rounded hover:bg-[#163a75] transition-all shadow"
              >
                Go to Administrator Login →
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-5 text-center space-y-2">
            <span className="text-3xl">✅</span>
            <h3 className="text-base font-bold text-emerald-900">
              Admin Account Initialized!
            </h3>
            <p className="text-xs text-emerald-800">
              Credentials saved with salted encryption. Redirecting to your Super Admin Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                ⚠️ {error}
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 leading-relaxed">
              <strong>Notice:</strong> This setup wizard will be permanently disabled once your administrator credentials are confirmed. Passwords are securely hashed using browser Web Crypto.
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Administrator Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Chief Registrar / System Admin"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Admin Email Address *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@legalconnect.ng"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Official Contact Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Master Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs sm:text-sm rounded transition-all shadow-md uppercase tracking-wider active:scale-95 disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Create Master Administrator Account"}
            </button>

            <div className="text-center pt-2">
              <Link to="/admin-login" className="text-xs text-slate-500 hover:text-[#0F2B5B] hover:underline">
                Already created? Go to Administrator Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default AdminSetup;

