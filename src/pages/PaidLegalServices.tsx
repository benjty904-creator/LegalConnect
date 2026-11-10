import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ServiceTier {
  id: string;
  title: string;
  category: string;
  priceModel: string;
  description: string;
  features: string[];
}

const PaidLegalServices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const services: ServiceTier[] = [
    {
      id: "corporate",
      title: "Corporate & Business Law",
      category: "Corporate",
      priceModel: "Retainer / Flat Fee",
      description: "Comprehensive legal structure for startups, SMBs, and established enterprises.",
      features: [
        "Company Registration & Compliance",
        "Contract Drafting & Review",
        "Tax & Regulatory Advisory",
        "Intellectual Property Protection",
      ],
    },
    {
      id: "property",
      title: "Real Estate & Property Law",
      category: "Property",
      priceModel: "Per Transaction / Hourly",
      description: "Protect your property investments, land acquisitions, and commercial leases.",
      features: [
        "Title Search & Due Diligence",
        "Deed Preparation & Documentation",
        "Land & Lease Dispute Resolution",
        "Mortgage & Escrow Counsel",
      ],
    },
    {
      id: "litigation",
      title: "Civil & Commercial Litigation",
      category: "Litigation",
      priceModel: "Hourly / Representation",
      description: "Aggressive courtroom representation and strategic dispute resolution.",
      features: [
        "High-Stakes Commercial Disputes",
        "Breach of Contract Representation",
        "Appellate Court Appeals",
        "Arbitration & Mediation Services",
      ],
    },
    {
      id: "family",
      title: "Family & Estate Planning",
      category: "Private Wealth",
      priceModel: "Flat Fee / Hourly",
      description: "Discreet and professional legal guidance for personal assets and family matters.",
      features: [
        "Will & Trust Drafting",
        "Probate & Estate Administration",
        "Marital Contracts & Agreements",
        "Asset Protection Planning",
      ],
    },
    {
      id: "defense",
      title: "Criminal Defense Counsel",
      category: "Litigation",
      priceModel: "Case Retainer",
      description: "Robust legal defense led by experienced senior criminal trial lawyers.",
      features: [
        "Emergency Bail Hearing Motions",
        "Financial & White-Collar Crime Defense",
        "Police Interrogation Counsel",
        "Full Trial Representation",
      ],
    },
    {
      id: "tech-ip",
      title: "IP & FinTech Regulations",
      category: "Corporate",
      priceModel: "Retainer",
      description: "Specialized legal consultation for software, tech startups, and digital assets.",
      features: [
        "Patent & Trademark Filing",
        "Data Privacy (GDPR/NDPR) Compliance",
        "SaaS Terms & Privacy Policies",
        "FinTech Licensing Assistance",
      ],
    },
  ];

  const categories = ["All", "Corporate", "Property", "Litigation", "Private Wealth"];

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800">
      {/* 1. HERO SECTION */}
      <section className="bg-[#0F2B5B] text-white py-12 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Premium Legal Representation
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Paid Legal Services <span className="text-[#D4AF37]">Tailored To You</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Direct retainers with top-tier verified attorneys for corporate entities, complex litigation, real estate transactions, and specialized advisory.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate("/find-a-lawyer")}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-xs sm:text-sm rounded-md transition-all shadow-lg active:scale-95 uppercase tracking-wider"
            >
              Hire A Lawyer Now
            </button>
            <button
              onClick={() => navigate("/request-service")}
              className="px-6 py-3 bg-transparent border border-white hover:bg-white hover:text-[#0F2B5B] text-white font-bold text-xs sm:text-sm rounded-md transition-all active:scale-95 uppercase tracking-wider"
            >
              Consult Legal Team
            </button>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SERVICES GRID */}
      <section className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#0F2B5B] text-[#D4AF37] shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-[#0F2B5B] rounded">
                    {service.category}
                  </span>
                  <span className="text-xs font-semibold text-[#D4AF37]">
                    {service.priceModel}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0F2B5B]">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="text-[#D4AF37] font-bold">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate("/request-service")}
                className="w-full py-2.5 bg-[#0F2B5B] hover:bg-[#163a75] text-white font-bold text-xs sm:text-sm rounded transition-all tracking-wider"
              >
                Book Legal Engagement
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRANSPARENT PRICING GUARANTEE */}
      <section className="bg-white py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-5 space-y-2">
            <div className="text-2xl sm:text-3xl">💳</div>
            <h3 className="font-bold text-[#0F2B5B] text-base sm:text-lg">No Hidden Charges</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Clear upfront fee proposals and retainer terms prior to commencement.</p>
          </div>
          <div className="p-5 space-y-2">
            <div className="text-2xl sm:text-3xl">⚖️</div>
            <h3 className="font-bold text-[#0F2B5B] text-base sm:text-lg">Escrow Security</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Legal fees are safeguarded and disbursed upon verified milestone completion.</p>
          </div>
          <div className="p-5 space-y-2">
            <div className="text-2xl sm:text-3xl">📜</div>
            <h3 className="font-bold text-[#0F2B5B] text-base sm:text-lg">Certified Counsel</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Work exclusively with senior Advocates of verified standing with the Bar.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaidLegalServices;