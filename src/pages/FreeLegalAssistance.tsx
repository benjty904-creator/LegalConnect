import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FreeLegalAssistance: React.FC = () => {
  const navigate = useNavigate();

  // State for interactive eligibility checklist
  const [isLowIncome, setIsLowIncome] = useState<boolean | null>(null);
  const [hasValidCase, setHasValidCase] = useState<boolean | null>(null);

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#0F2B5B] text-white py-12 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Pro Bono & Legal Aid
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Free Legal Assistance <span className="text-[#D4AF37]">For Those In Need</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Justice shouldn't have a price tag. We connect qualified low-income individuals, human rights victims, and underserved citizens with volunteer lawyers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/request-service")}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-xs sm:text-sm rounded-md transition-all shadow-lg active:scale-95 uppercase tracking-wider"
            >
              Apply For Free Aid Now
            </button>
          </div>
        </div>
      </section>

      {/* 2. ELIGIBILITY CHECKER TOOL */}
      <section className="py-10 sm:py-14 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-[#0F2B5B]">Check Your Eligibility</h2>
            <p className="text-xs sm:text-sm text-slate-600">Answer 2 quick questions to see if you qualify for pro-bono representation.</p>
          </div>

          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                1. Is your monthly income below the minimum threshold or are you currently unemployed?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsLowIncome(true)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border transition-all ${
                    isLowIncome === true
                      ? "bg-[#0F2B5B] text-[#D4AF37] border-[#0F2B5B]"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setIsLowIncome(false)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border transition-all ${
                    isLowIncome === false
                      ? "bg-[#0F2B5B] text-[#D4AF37] border-[#0F2B5B]"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                2. Is your legal matter non-commercial (e.g. human rights, tenancy, domestic, unlawful arrest)?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setHasValidCase(true)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border transition-all ${
                    hasValidCase === true
                      ? "bg-[#0F2B5B] text-[#D4AF37] border-[#0F2B5B]"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasValidCase(false)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border transition-all ${
                    hasValidCase === false
                      ? "bg-[#0F2B5B] text-[#D4AF37] border-[#0F2B5B]"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Result */}
          {isLowIncome !== null && hasValidCase !== null && (
            <div
              className={`p-4 rounded-lg border text-xs sm:text-sm space-y-2 ${
                isLowIncome && hasValidCase
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-amber-50 border-amber-300 text-amber-900"
              }`}
            >
              {isLowIncome && hasValidCase ? (
                <>
                  <p className="font-bold">✅ You are highly likely to qualify for Free Legal Aid!</p>
                  <p>Please submit a formal assistance request and attach proof of hardship.</p>
                  <button
                    onClick={() => navigate("/request-service")}
                    className="mt-2 px-4 py-2 bg-[#0F2B5B] text-[#D4AF37] font-bold rounded text-xs"
                  >
                    Proceed To Application →
                  </button>
                </>
              ) : (
                <>
                  <p className="font-bold">ℹ️ You may not meet standard pro-bono criteria.</p>
                  <p>For commercial disputes or higher income brackets, explore our affordable Paid Services or directory.</p>
                  <button
                    onClick={() => navigate("/paid-legal-services")}
                    className="mt-2 px-4 py-2 bg-[#0F2B5B] text-[#D4AF37] font-bold rounded text-xs"
                  >
                    View Paid Services →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. QUALIFYING CATEGORIES */}
      <section className="py-10 sm:py-14 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-[#0F2B5B]">Covered Practice Areas</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Our legal aid volunteer lawyers focus heavily on fundamental human rights and essential civil matters.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#0F2B5B]">Human Rights & Arrests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Unlawful detention, police harassment, enforcement of fundamental rights, and bail assistance.</p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#0F2B5B]">Tenant Rights</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Protection against illegal evictions, landlord intimidation, and unkept tenancy contracts.</p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#0F2B5B]">Domestic & Family Matters</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Child custody disputes, protection orders against domestic abuse, and emergency maintenance.</p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#0F2B5B]">Labor & Wage Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Unlawful employment termination, withheld wages, and unsafe workplace conditions.</p>
          </div>
        </div>
      </section>

      {/* 4. PROCESS STEPS */}
      <section className="bg-[#0F2B5B] text-white py-12 sm:py-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-bold text-center text-[#D4AF37] mb-10">How The Free Legal Aid Process Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-3xl font-black text-[#D4AF37]">01</span>
              <h3 className="text-lg font-bold">Submit Form</h3>
              <p className="text-xs sm:text-sm text-slate-300">Fill out our structured service request form with details of your legal issue.</p>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <span className="text-3xl font-black text-[#D4AF37]">02</span>
              <h3 className="text-lg font-bold">Admin Verification</h3>
              <p className="text-xs sm:text-sm text-slate-300">Our legal team reviews your documents to verify financial eligibility and case validity.</p>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <span className="text-3xl font-black text-[#D4AF37]">03</span>
              <h3 className="text-lg font-bold">Lawyer Match</h3>
              <p className="text-xs sm:text-sm text-slate-300">A verified volunteer pro-bono lawyer is assigned to handle your case directly.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FreeLegalAssistance;