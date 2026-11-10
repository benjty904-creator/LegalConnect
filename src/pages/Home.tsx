import React from "react";
import { Link, useNavigate } from "react-router-dom";
import justiceBg from "../assets/images/justice-motion-bg.jpg";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden bg-[#F8FAFC]">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#0F2B5B] text-white py-12 sm:py-20 md:py-28 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Trusted Legal Platform
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
              Fast, Transparent & <span className="text-[#D4AF37]">Accessible Justice</span> For Everyone
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with verified legal professionals, access free pro-bono support, or submit confidential reports seamlessly on LegalConnect.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => navigate("/request-service")}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-sm sm:text-base rounded-md transition-all shadow-lg active:scale-95"
              >
                Request Legal Assistance
              </button>
              <button
                onClick={() => navigate("/find-a-lawyer")}
                className="w-full sm:w-auto px-6 py-3.5 bg-transparent border-2 border-white hover:bg-white hover:text-[#0F2B5B] text-white font-bold text-sm sm:text-base rounded-md transition-all active:scale-95"
              >
                Find a Verified Lawyer
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-slate-700/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-lg sm:text-2xl font-bold text-[#D4AF37]">500+</p>
                <p className="text-[10px] sm:text-xs text-slate-300">Verified Lawyers</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-[#D4AF37]">1,200+</p>
                <p className="text-[10px] sm:text-xs text-slate-300">Cases Handled</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-[#D4AF37]">100%</p>
                <p className="text-[10px] sm:text-xs text-slate-300">Confidential</p>
              </div>
            </div>
          </div>

          {/* Right Cards Illustration */}
          <div className="space-y-4 max-w-md mx-auto lg:max-w-none w-full">
            <div className="bg-[#163a75] p-5 sm:p-6 rounded-lg border border-[#D4AF37]/30 shadow-xl space-y-2">
              <span className="text-[#D4AF37] font-semibold text-xs sm:text-sm">FEATURED SERVICE</span>
              <h3 className="text-base sm:text-xl font-bold">Free Pro Bono Assistance</h3>
              <p className="text-xs sm:text-sm text-slate-300">Financial constraints shouldn't block justice. Apply for free legal representation easily.</p>
              <Link to="/free-legal-assistance" className="inline-block text-xs sm:text-sm text-[#D4AF37] font-semibold hover:underline pt-2">Learn More →</Link>
            </div>

            <div className="bg-[#163a75] p-5 sm:p-6 rounded-lg border border-slate-600 shadow-xl space-y-2">
              <span className="text-[#D4AF37] font-semibold text-xs sm:text-sm">WHISTLEBLOWER PROTECTION</span>
              <h3 className="text-base sm:text-xl font-bold">100% Anonymous Reporting</h3>
              <p className="text-xs sm:text-sm text-slate-300">Report illegal activities, corruption, or rights violations safely without revealing your identity.</p>
              <Link to="/anonymous-reporting" className="inline-block text-xs sm:text-sm text-[#D4AF37] font-semibold hover:underline pt-2">File Report →</Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SERVICES OVERVIEW */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
          <h2 className="text-xs sm:text-sm font-bold text-[#D4AF37] uppercase tracking-wider">How We Assist You</h2>
          <p className="text-xl sm:text-3xl md:text-4xl font-bold text-[#0F2B5B]">Comprehensive Legal Solutions</p>
          <p className="text-xs sm:text-base text-slate-600">Tailored legal services built for individuals, businesses, and emergency legal aid.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-lg bg-[#0F2B5B] text-[#D4AF37] flex items-center justify-center font-bold text-lg">⚖️</div>
            <h3 className="text-lg font-bold text-[#0F2B5B]">Free Legal Aid</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Assistance for individuals who qualify for pro-bono representation and legal aid support.</p>
            <Link to="/free-legal-assistance" className="inline-block text-xs sm:text-sm font-bold text-[#0F2B5B] hover:text-[#D4AF37]">Explore Free Aid →</Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-lg bg-[#0F2B5B] text-[#D4AF37] flex items-center justify-center font-bold text-lg">💼</div>
            <h3 className="text-lg font-bold text-[#0F2B5B]">Paid Services</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Direct retainers with verified lawyers for corporate, civil, family, and criminal law.</p>
            <Link to="/paid-legal-services" className="inline-block text-xs sm:text-sm font-bold text-[#0F2B5B] hover:text-[#D4AF37]">Explore Paid Services →</Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-lg bg-[#0F2B5B] text-[#D4AF37] flex items-center justify-center font-bold text-lg">🔍</div>
            <h3 className="text-lg font-bold text-[#0F2B5B]">Find a Lawyer</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Search through categorized directories of licensed attorneys based on specialty and location.</p>
            <Link to="/find-a-lawyer" className="inline-block text-xs sm:text-sm font-bold text-[#0F2B5B] hover:text-[#D4AF37]">Search Directory →</Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-lg bg-[#0F2B5B] text-[#D4AF37] flex items-center justify-center font-bold text-lg">🛡️</div>
            <h3 className="text-lg font-bold text-[#0F2B5B]">Anonymous Report</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Safe channel for whistleblowers to report legal infringements securely and privately.</p>
            <Link to="/anonymous-reporting" className="inline-block text-xs sm:text-sm font-bold text-[#0F2B5B] hover:text-[#D4AF37]">Report Anonymously →</Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-lg bg-[#0F2B5B] text-[#D4AF37] flex items-center justify-center font-bold text-lg">📘</div>
            <h3 className="text-lg font-bold text-[#0F2B5B]">Legal Help Guide</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Simplified legal articles, rights education, and FAQs to keep you informed before court.</p>
            <Link to="/legal-help-guide" className="inline-block text-xs sm:text-sm font-bold text-[#0F2B5B] hover:text-[#D4AF37]">Read Legal Guides →</Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-lg bg-[#0F2B5B] text-[#D4AF37] flex items-center justify-center font-bold text-lg">📋</div>
            <h3 className="text-lg font-bold text-[#0F2B5B]">Request Assistance</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Submit your legal issues directly and receive prompt evaluation from administrative legal teams.</p>
            <Link to="/request-service" className="inline-block text-xs sm:text-sm font-bold text-[#0F2B5B] hover:text-[#D4AF37]">Submit Request →</Link>
          </div>

        </div>
      </section>

      {/* 3. PARALLAX SECTION: "JUSTICE IN MOTION" */}
      <section 
        className="relative py-20 sm:py-28 md:py-36 px-3 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed text-white flex items-center justify-center"
        style={{ backgroundImage: `url(${justiceBg})` }}
      >
        {/* Dark Navy Overlay */}
        <div className="absolute inset-0 bg-[#0F2B5B]/85 sm:bg-[#0F2B5B]/80 z-0"></div>

        {/* Content on top */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#0F2B5B] text-xs font-bold uppercase tracking-widest rounded">
            Justice In Motion
          </span>

          <h2 className="text-xl sm:text-3xl md:text-5xl font-black leading-tight">
            Justice Moves Faster When People Are Connected To The Right Legal Help.
          </h2>

          <p className="text-xs sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            LegalConnect bridges the gap between citizens, verified lawyers, and legal aid services through a secure, transparent, and accessible digital framework.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => navigate("/request-service")}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-xs sm:text-sm rounded transition-all shadow-lg active:scale-95 uppercase tracking-wider"
            >
              Get Legal Help Now
            </button>
            <button
              onClick={() => navigate("/find-a-lawyer")}
              className="px-6 py-3 bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F2B5B] text-[#D4AF37] font-bold text-xs sm:text-sm rounded transition-all active:scale-95 uppercase tracking-wider"
            >
              Search Lawyer Directory
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs sm:text-sm font-bold text-[#D4AF37] uppercase tracking-wider">Why LegalConnect</h2>
            <p className="text-xl sm:text-3xl font-bold text-[#0F2B5B]">Built For Reliability & Confidentiality</p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We ensure that every legal interaction is handled with professional ethics, maximum speed, and uncompromised privacy.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2">
              <h4 className="font-bold text-[#0F2B5B] text-base">Verified Advocates</h4>
              <p className="text-xs sm:text-sm text-slate-600">All registered lawyers undergo thorough bar association credential verification.</p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2">
              <h4 className="font-bold text-[#0F2B5B] text-base">End-to-End Privacy</h4>
              <p className="text-xs sm:text-sm text-slate-600">Your documents and anonymous reports remain strictly protected under legal encryption standards.</p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2">
              <h4 className="font-bold text-[#0F2B5B] text-base">Transparent Routing</h4>
              <p className="text-xs sm:text-sm text-slate-600">Requests are routed directly to qualified legal practitioners based on case category.</p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2">
              <h4 className="font-bold text-[#0F2B5B] text-base">Pro-Bono First</h4>
              <p className="text-xs sm:text-sm text-slate-600">We prioritize legal support for low-income citizens and human rights cases.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BOTTOM CTA SECTION */}
      <section className="bg-[#0F2B5B] text-white py-12 sm:py-16 px-3 sm:px-6 lg:px-8 text-center border-t border-[#D4AF37]/20">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-3xl font-extrabold">Need Professional Legal Counsel Today?</h2>
          <p className="text-xs sm:text-base text-slate-300">
            Submit your legal request or register as a legal practitioner to start providing or receiving assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate("/request-service")}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-xs sm:text-sm rounded transition-all shadow-md active:scale-95"
            >
              Get Legal Assistance
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 bg-transparent border border-white hover:bg-white hover:text-[#0F2B5B] text-white font-bold text-xs sm:text-sm rounded transition-all active:scale-95"
            >
              Sign Up As Lawyer
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;