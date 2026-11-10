import React, { useState } from "react";

interface GuideArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  keyTakeaways: string[];
}

const guideData: GuideArticle[] = [
  {
    id: "guide-1",
    category: "Police & Arrest Rights",
    title: "Your Fundamental Rights Upon Police Arrest in Nigeria",
    summary:
      "Under the Administration of Criminal Justice Act (ACJA) and the 1999 Constitution, every citizen possesses rights when confronted by law enforcement.",
    keyTakeaways: [
      "You have the right to remain silent until consulting a lawyer.",
      "The police must state the reason for arrest immediately.",
      "No citizen should be arrested in lieu of a suspect (arrest by proxy is illegal).",
      "Police must grant access to a legal practitioner before statement taking.",
    ],
  },
  {
    id: "guide-2",
    category: "Tenancy & Housing",
    title: "Tenant Protection Laws & Illegal Eviction Prevention",
    summary:
      "Landlords cannot forcefully eject tenants, lock doors, or remove roofs without following formal statutory quit notices.",
    keyTakeaways: [
      "A statutory 6-Month Notice is required for yearly tenants unless agreed otherwise.",
      "7-Day Notice of Owner's Intention to Apply to Recover Possession is mandatory.",
      "Locking out tenants or removing property constitutes unlawful self-help.",
      "Tenants can seek emergency injunctions against harassing landlords.",
    ],
  },
  {
    id: "guide-3",
    category: "Labor & Employment",
    title: "Understanding Unlawful Termination & Employee Rights",
    summary:
      "Nigerian Labor Act protects workers against arbitrary dismissal, withheld wages, and unsafe working environments.",
    keyTakeaways: [
      "Employers must issue written contracts outlining terms of engagement.",
      "Notice period or payment in lieu of notice is legally mandated for termination.",
      "Female workers are entitled to maternity leave without threat of dismissal.",
      "Arbitrary dismissal without cause can be challenged at the National Industrial Court (NICN).",
    ],
  },
  {
    id: "guide-4",
    category: "Business & CAMA",
    title: "CAMA 2020: How to Legally Register & Operate a Business",
    summary:
      "A practical breakdown of business name registration, limited liability company setup, and CAC annual return compliance.",
    keyTakeaways: [
      "Single-member limited liability companies are now legal under CAMA 2020.",
      "Business Name registration requires annual returns to avoid status deactivation.",
      "Tax Identification Number (TIN) is mandatory for official banking.",
      "Trademarks protect your brand logo and trading name from infringement.",
    ],
  },
];

const categories = [
  "All Guides",
  "Police & Arrest Rights",
  "Tenancy & Housing",
  "Labor & Employment",
  "Business & CAMA",
];

const LegalHelpGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Guides");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>("guide-1");

  const toggleGuide = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredGuides = guideData.filter((guide) => {
    const matchesCategory =
      selectedCategory === "All Guides" || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#0F2B5B] text-white py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Know Your Legal Rights
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Legal Help Guide & <span className="text-[#D4AF37]">Rights Education</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Simplified legal explanations to help everyday citizens understand their constitutional rights, tenancy protection, employment laws, and business regulations.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <input
              type="text"
              placeholder="Search legal topic (e.g. arrest, tenancy, business)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-800 rounded-lg shadow-md border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTERS */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
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

        {/* 3. ACCORDION GUIDES */}
        <div className="space-y-4">
          {filteredGuides.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-slate-200 space-y-2">
              <span className="text-3xl">📘</span>
              <p className="font-bold text-[#0F2B5B]">No legal guides match your search.</p>
              <p className="text-xs text-slate-500">Try searching for alternative keywords.</p>
            </div>
          ) : (
            filteredGuides.map((guide) => {
              const isExpanded = expandedId === guide.id;
              return (
                <div
                  key={guide.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                >
                  {/* Header / Clickable */}
                  <button
                    onClick={() => toggleGuide(guide.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                        {guide.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#0F2B5B]">
                        {guide.title}
                      </h3>
                    </div>
                    <span className="text-lg font-bold text-[#0F2B5B] shrink-0 pt-1">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/50">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {guide.summary}
                      </p>

                      <div className="space-y-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0F2B5B] uppercase tracking-wider">
                          Key Legal Takeaways:
                        </h4>
                        <ul className="space-y-1.5">
                          {guide.keyTakeaways.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-xs sm:text-sm text-slate-700 flex items-start gap-2"
                            >
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. EMERGENCY LEGAL AID BANNER */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-12">
        <div className="bg-[#0F2B5B] text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#D4AF37]/30">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Facing an Active Emergency Court or Arrest Matter?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Don't navigate the legal system alone. Request immediate professional assistance from verified counsel.
            </p>
          </div>
          <a
            href="/request-service"
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-xs sm:text-sm rounded transition-all shrink-0 uppercase tracking-wider whitespace-nowrap"
          >
            Get Emergency Help
          </a>
        </div>
      </section>

    </div>
  );
};

export default LegalHelpGuide;