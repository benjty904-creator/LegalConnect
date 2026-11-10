import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type AccountType = "citizen" | "lawyer";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { registerAsCitizen, registerAsLawyer } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("citizen");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "Lagos",
    // Lawyer specific fields
    barNumber: "",
    specialty: "Corporate & Commercial Law",
    state: "Lagos",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    if (accountType === "citizen") {
      const res = await registerAsCitizen({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        password: formData.password,
      });
      setLoading(false);

      if (res.success) {
        navigate("/user-dashboard");
      } else {
        setError(res.error || "Failed to create account.");
      }
    } else {
      const res = await registerAsLawyer({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        barNumber: formData.barNumber,
        specialty: formData.specialty,
        state: formData.state,
        password: formData.password,
      });
      setLoading(false);

      if (res.success) {
        navigate("/lawyer-dashboard");
      } else {
        setError(res.error || "Failed to create lawyer account.");
      }
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2B5B]">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Join LegalConnect as a citizen seeking assistance or as a verified advocate.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs sm:text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Account Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setAccountType("citizen");
              setError("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-md transition-all ${accountType === "citizen"
                ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            👤 Citizen Registration
          </button>

          <button
            type="button"
            onClick={() => {
              setAccountType("lawyer");
              setError("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-md transition-all ${accountType === "lawyer"
                ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            ⚖️ Legal Advocate
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder={accountType === "lawyer" ? "Barr. Firstname Lastname" : "Firstname Lastname"}
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>
          </div>

          {accountType === "citizen" && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Primary Residence / Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              >
                <option value="Lagos">Lagos State</option>
                <option value="Abuja">FCT Abuja</option>
                <option value="Benin City">Edo State (Benin)</option>
                <option value="Port Harcourt">Rivers State (PH)</option>
                <option value="Delta State">Delta State</option>
                <option value="Oyo State">Oyo State (Ibadan)</option>
                <option value="Other">Other Location</option>
              </select>
            </div>
          )}

          {/* Extra Lawyer Fields */}
          {accountType === "lawyer" && (
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg space-y-3">
              <span className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                NBA Bar Credentials Verification
              </span>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Supreme Court Enrollment No (SCN) *
                </label>
                <input
                  type="text"
                  name="barNumber"
                  required
                  placeholder="e.g. NBA/SCN/2016/04812"
                  value={formData.barNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Primary Legal Specialty *
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                  >
                    <option value="Corporate & Commercial Law">Corporate & Commercial Law</option>
                    <option value="Criminal Defense & Human Rights">Criminal Defense & Human Rights</option>
                    <option value="Real Estate & Property Law">Real Estate & Property Law</option>
                    <option value="Family & Estate Planning">Family & Estate Planning</option>
                    <option value="Labor & Employment Law">Labor & Employment Law</option>
                    <option value="Intellectual Property & Tech Law">Intellectual Property & Tech</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Jurisdiction / State Bar *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                  >
                    <option value="Lagos">Lagos State</option>
                    <option value="Abuja">FCT Abuja</option>
                    <option value="Benin City">Edo State</option>
                    <option value="Port Harcourt">Rivers State</option>
                    <option value="Delta State">Delta State</option>
                    <option value="Oyo State">Oyo State</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password *
              </label>
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
              <label className="block text-xs font-semibold text-slate-700">
                Confirm Password *
              </label>
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
            {loading
              ? "Creating Account..."
              : accountType === "citizen"
                ? "Register as Citizen"
                : "Register as Legal Advocate"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0F2B5B] font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUp;

