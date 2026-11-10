import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLawyerById } from "../services/lawyerService";

interface LawyerDetail {
  id: string;
  name: string;
  barNumber: string;
  specialty: string;
  location: string;
  experienceYears: number;
  rating: number;
  casesWon: number;
  hourlyRate: string;
  bio: string;
  education: string[];
  practiceAreas: string[];
  notableCases: string[];
  isVerified: boolean;
}

const directoryLawyersData: Record<string, LawyerDetail> = {
  "lawyer-1": {
    id: "lawyer-1",
    name: "Barr. Chinedu Okafor",
    barNumber: "NBA/SCN/2010/04821",
    specialty: "Corporate & Commercial Law",
    location: "Lagos",
    experienceYears: 14,
    rating: 4.9,
    casesWon: 180,
    hourlyRate: "$150 / hr",
    bio: "Barr. Chinedu Okafor is a Senior Legal Practitioner specializing in corporate restructuring, cross-border commercial transactions, and regulatory compliance under Nigerian company law (CAMA). He regularly advises tech firms, financial institutions, and multinational entities.",
    education: [
      "LL.B (Hons) - University of Lagos (UNILAG)",
      "B.L - Nigerian Law School, Abuja",
      "LL.M (Corporate Law) - University of London",
    ],
    practiceAreas: [
      "Mergers & Acquisitions",
      "CAMA Regulatory Compliance",
      "Contract Negotiation & Drafting",
      "Taxation & Financial Advisory",
    ],
    notableCases: [
      "Led legal advisory on a $12M FinTech acquisition in Lagos (2022).",
      "Successfully defended a major telecommunications firm in a regulatory compliance suit (2021).",
    ],
    isVerified: true,
  },
  "lawyer-2": {
    id: "lawyer-2",
    name: "Barr. Amina Bello",
    barNumber: "NBA/SCN/2014/08912",
    specialty: "Criminal Defense & Human Rights",
    location: "Abuja",
    experienceYears: 10,
    rating: 4.8,
    casesWon: 145,
    hourlyRate: "Pro Bono & $100/hr",
    bio: "Barr. Amina Bello is a fierce human rights advocate and criminal defense attorney based in Abuja. She is dedicated to protecting fundamental human rights, securing bail, and offering pro-bono representation to underprivileged citizens.",
    education: [
      "LL.B (Hons) - Ahmadu Bello University (ABU) Zaria",
      "B.L - Nigerian Law School, Bwari, Abuja",
    ],
    practiceAreas: [
      "Fundamental Human Rights Enforcement",
      "Criminal Defense & Trial Advocacy",
      "Bail Applications & Habeas Corpus",
      "Public Interest Litigation",
    ],
    notableCases: [
      "Secured the discharge and acquittal of 15 wrongfully detained peaceful protesters in Abuja (2023).",
      "Enforced fundamental human rights judgment against unlawful detention (2022).",
    ],
    isVerified: true,
  },
};

const LawyerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Check if ID matches a registered lawyer in storage
  const registeredLawyer = id ? getLawyerById(id) : undefined;

  let lawyer: LawyerDetail;

  if (registeredLawyer) {
    lawyer = {
      id: registeredLawyer.id,
      name: registeredLawyer.fullName,
      barNumber: registeredLawyer.barNumber || "NBA/SCN/REGISTERED",
      specialty: registeredLawyer.specialty || "Legal Practice",
      location: registeredLawyer.state || registeredLawyer.location || "Nigeria",
      experienceYears: 5,
      rating: 5.0,
      casesWon: 15,
      hourlyRate: registeredLawyer.hourlyRate || "Standard Retainer",
      bio: registeredLawyer.bio || "Active legal practitioner registered on LegalConnect.",
      education: [
        "LL.B (Hons) - Accredited Faculty of Law",
        "B.L - Nigerian Law School",
      ],
      practiceAreas: [registeredLawyer.specialty || "General Law", "Civil Litigation"],
      notableCases: ["Handled multiple civil and commercial briefs with distinction."],
      isVerified: registeredLawyer.verificationStatus === "Approved",
    };
  } else if (id && directoryLawyersData[id]) {
    lawyer = directoryLawyersData[id];
  } else {
    lawyer = {
      id: id || "unknown",
      name: "Barr. Legal Practitioner",
      barNumber: "NBA/SCN/2018/00000",
      specialty: "General Legal Counsel",
      location: "Lagos",
      experienceYears: 8,
      rating: 4.8,
      casesWon: 80,
      hourlyRate: "Standard Retainer",
      bio: "A seasoned legal practitioner providing dedicated counsel and litigation support across Nigerian courts.",
      education: [
        "LL.B (Hons) - Faculty of Law",
        "B.L - Nigerian Law School",
      ],
      practiceAreas: ["Commercial Litigation", "Corporate Law", "Property Matters"],
      notableCases: ["Handled various landmark commercial and civil cases."],
      isVerified: true,
    };
  }

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 pb-16">
      
      {/* 1. PROFILE HEADER */}
      <section className="bg-[#0F2B5B] text-white py-10 sm:py-14 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          
          {/* Avatar Placeholder */}
          <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-[#163a75] border-4 border-[#D4AF37] flex items-center justify-center text-4xl sm:text-5xl font-bold text-[#D4AF37] shrink-0 shadow-xl">
            {lawyer.name.replace("Barr. ", "").charAt(0)}
          </div>

          {/* Info */}
          <div className="space-y-3 text-center md:text-left grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl sm:text-3xl font-extrabold text-white">
                {lawyer.name}
              </h1>
              {lawyer.isVerified ? (
                <span className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                  ✔ Verified Practitioner
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-600/20 border border-amber-500 text-amber-400 text-xs font-semibold rounded-full flex items-center gap-1">
                  ⏳ Verification In Progress
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#D4AF37] font-semibold">
              {lawyer.specialty} • <span className="text-slate-300">{lawyer.location}, Nigeria</span>
            </p>

            <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
              Supreme Court Enrollment No: {lawyer.barNumber}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2 text-xs">
              <div className="px-3 py-1.5 bg-[#163a75] rounded border border-slate-700">
                <span className="text-slate-300 block text-[10px]">Experience</span>
                <span className="font-bold text-white">{lawyer.experienceYears} Years</span>
              </div>
              <div className="px-3 py-1.5 bg-[#163a75] rounded border border-slate-700">
                <span className="text-slate-300 block text-[10px]">Cases Won</span>
                <span className="font-bold text-[#D4AF37]">{lawyer.casesWon}+</span>
              </div>
              <div className="px-3 py-1.5 bg-[#163a75] rounded border border-slate-700">
                <span className="text-slate-300 block text-[10px]">Rating</span>
                <span className="font-bold text-amber-400">★ {lawyer.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate("/request-service")}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-xs sm:text-sm rounded transition-all shadow-md text-center active:scale-95 uppercase tracking-wider"
            >
              Hire This Lawyer
            </button>
            <button
              onClick={() => navigate("/find-a-lawyer")}
              className="px-6 py-2.5 bg-transparent border border-white hover:bg-white hover:text-[#0F2B5B] text-white font-semibold text-xs rounded transition-all text-center"
            >
              ← Back to Directory
            </button>
          </div>

        </div>
      </section>

      {/* 2. BODY CONTENT */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column: Bio & Practice Areas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-[#0F2B5B] border-b border-slate-100 pb-2">
              Professional Biography
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {lawyer.bio}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-[#0F2B5B] border-b border-slate-100 pb-2">
              Practice Areas & Key Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {lawyer.practiceAreas.map((area, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="text-[#D4AF37] font-bold">✔</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-[#0F2B5B] border-b border-slate-100 pb-2">
              Notable Representation
            </h2>
            <ul className="space-y-2 pt-1">
              {lawyer.notableCases.map((c, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#0F2B5B] font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Credentials & Education */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F2B5B] uppercase tracking-wider border-b border-slate-100 pb-2">
              Verification Details
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Bar Association</span>
                <span className="font-bold text-slate-800">Nigerian Bar Association (NBA)</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Enrollment No (SCN)</span>
                <span className="font-mono font-bold text-slate-800">{lawyer.barNumber}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Jurisdiction</span>
                <span className="font-semibold text-slate-800">High Courts & Supreme Court of Nigeria</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Billing Estimate</span>
                <span className="font-semibold text-emerald-700">{lawyer.hourlyRate}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0F2B5B] uppercase tracking-wider border-b border-slate-100 pb-2">
              Education & Qualifications
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {lawyer.education.map((edu, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">🎓</span>
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </section>

    </div>
  );
};

export default LawyerProfile;
