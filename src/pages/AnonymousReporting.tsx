import React, { useState } from "react";
import { createAnonymousReport } from "../services/reportService";

const AnonymousReporting: React.FC = () => {
  const [formData, setFormData] = useState({
    reportCategory: "Corruption & Bribery",
    location: "Lagos",
    incidentDate: "",
    description: "",
    involvedParties: "",
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.description.trim()) {
      setError("Please describe the incident or violation.");
      return;
    }

    const res = createAnonymousReport({
      category: formData.reportCategory,
      location: formData.location,
      incidentDate: formData.incidentDate,
      description: formData.description,
      involvedParties: formData.involvedParties,
    });

    if (res.success && res.report) {
      setTrackingCode(res.report.trackingCode);
      setIsSubmitted(true);
    } else {
      setError(res.error || "Failed to record anonymous report.");
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#0F2B5B] text-white py-10 sm:py-16 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-400 rounded-full text-red-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            100% Encrypted & Anonymous
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Anonymous <span className="text-[#D4AF37]">Whistleblower Reporting</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report corruption, human rights violations, fraud, or illegal activities safely. We do not collect your name, IP address, or identity.
          </p>
        </div>
      </section>

      {/* 2. PRIVACY ASSURANCE BAR */}
      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-2xl">🔒</span>
          <p className="text-[11px] sm:text-xs text-emerald-800 leading-relaxed">
            <span className="font-bold">Your safety is guaranteed.</span> This form is fully anonymized. No login is required, and no personally identifiable metadata is stored. Only submit factual information you believe to be true.
          </p>
        </div>
      </section>

      {/* 3. FORM SECTION */}
      <section className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {isSubmitted ? (
          /* SUCCESS + TRACKING CODE */
          <div className="bg-white p-6 sm:p-10 rounded-xl border border-emerald-300 shadow-md text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto font-bold">
              ✓
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F2B5B]">
              Report Submitted Anonymously
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Your report has been securely registered in the administrative whistleblower oversight repository for confidential triage.
            </p>

            {/* Tracking Code Box */}
            <div className="bg-slate-50 border-2 border-dashed border-[#0F2B5B]/30 rounded-lg p-4 max-w-xs mx-auto">
              <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">
                Save Your Tracking Code
              </p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-[#0F2B5B] tracking-widest">
                {trackingCode}
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                Use this code to check the status of your report later. This is the ONLY way to track it. We cannot recover it for you.
              </p>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  reportCategory: "Corruption & Bribery",
                  location: "Lagos",
                  incidentDate: "",
                  description: "",
                  involvedParties: "",
                });
              }}
              className="mt-2 px-5 py-2.5 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs sm:text-sm rounded transition-all shadow"
            >
              Submit A New Report
            </button>
          </div>
        ) : (
          /* REPORTING FORM */
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm space-y-6"
          >
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                ⚠️ {error}
              </div>
            )}

            {/* Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Type of Violation *</label>
                <select
                  name="reportCategory"
                  value={formData.reportCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                >
                  <option value="Corruption & Bribery">Corruption & Bribery</option>
                  <option value="Police Brutality / Abuse of Power">Police Brutality / Abuse of Power</option>
                  <option value="Human Rights Violation">Human Rights Violation</option>
                  <option value="Fraud & Financial Crime">Fraud & Financial Crime</option>
                  <option value="Sexual Harassment / Assault">Sexual Harassment / Assault</option>
                  <option value="Child Abuse / Trafficking">Child Abuse / Trafficking</option>
                  <option value="Other Illegal Activity">Other Illegal Activity</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">State / Location of Incident *</label>
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
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>
            </div>

            {/* Incident Date */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Approximate Date of Incident</label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            {/* Parties Involved */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Suspects / Entities Involved (Optional)
              </label>
              <input
                type="text"
                name="involvedParties"
                placeholder="Names, official badges, department, company name..."
                value={formData.involvedParties}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Incident Description *</label>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Detail what happened clearly. Do NOT include your own personal details if you wish to remain strictly anonymous."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded transition-all shadow-md uppercase tracking-wider active:scale-95"
            >
              🔒 Submit Anonymous Whistleblower Report
            </button>
          </form>
        )}
      </section>

    </div>
  );
};

export default AnonymousReporting;
