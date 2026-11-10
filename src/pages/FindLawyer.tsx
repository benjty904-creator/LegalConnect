import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRegisteredLawyers } from "../services/lawyerService";

interface Lawyer {
  id: string;
  name: string;
  specialty: string;
  location: string;
  experienceYears: number;
  rating: number;
  casesWon: number;
  hourlyRate: string;
  bio: string;
  isVerified: boolean;
}

const initialDirectoryLawyers: Lawyer[] = [
  {
    id: "lawyer-1",
    name: "Barr. Chinedu Okafor",
    specialty: "Corporate & Commercial Law",
    location: "Lagos",
    experienceYears: 14,
    rating: 4.9,
    casesWon: 180,
    hourlyRate: "$150 / hr",
    bio: "Specializes in corporate governance, mergers & acquisitions, and financial regulatory compliance under CAMA.",
    isVerified: true,
  },
  {
    id: "lawyer-2",
    name: "Barr. Amina Bello",
    specialty: "Criminal Defense & Human Rights",
    location: "Abuja",
    experienceYears: 10,
    rating: 4.8,
    casesWon: 145,
    hourlyRate: "Pro Bono & $100/hr",
    bio: "Passionate human rights advocate with extensive court trial experience in high-profile fundamental rights enforcement.",
    isVerified: true,
  },
  {
    id: "lawyer-3",
    name: "Barr. Emeka Nwosu",
    specialty: "Real Estate & Property Law",
    location: "Benin City",
    experienceYears: 8,
    rating: 4.7,
    casesWon: 95,
    hourlyRate: "$120 / hr",
    bio: "Expert in land title perfection, commercial leases, and real estate litigation across southern states.",
    isVerified: true,
  },
  {
    id: "lawyer-4",
    name: "Barr. Funke Adeyemi",
    specialty: "Family & Estate Planning",
    location: "Lagos",
    experienceYears: 12,
    rating: 4.9,
    casesWon: 210,
    hourlyRate: "$130 / hr",
    bio: "Compassionate counsel specializing in marital settlements, child custody, and high-net-worth estate planning.",
    isVerified: true,
  },
  {
    id: "lawyer-5",
    name: "Barr. Ibrahim Musa",
    specialty: "Intellectual Property & Tech Law",
    location: "Port Harcourt",
    experienceYears: 6,
    rating: 4.6,
    casesWon: 60,
    hourlyRate: "$110 / hr",
    bio: "Focuses on tech startup advisory, trademark registrations, software licensing, and NDPR data privacy compliance.",
    isVerified: true,
  },
  {
    id: "lawyer-6",
    name: "Barr. Ngozi Eze",
    specialty: "Labor & Employment Law",
    location: "Delta State",
    experienceYears: 9,
    rating: 4.8,
    casesWon: 120,
    hourlyRate: "Pro Bono & $90/hr",
    bio: "Dedicated advocate for wrongful workplace termination, wage dispute claims, and labor union negotiations.",
    isVerified: true,
  },
];

const specialties = [
  "All Specialties",
  "Corporate & Commercial Law",
  "Criminal Defense & Human Rights",
  "Real Estate & Property Law",
  "Family & Estate Planning",
  "Intellectual Property & Tech Law",
  "Labor & Employment Law",
];

const locations = [
  "All Locations",
  "Lagos",
  "Abuja",
  "Benin City",
  "Port Harcourt",
  "Delta State",
  "Oyo State",
];

const FindLawyer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("" );
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All Specialties");
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [lawyersList, setLawyersList] = useState<Lawyer[]>(initialDirectoryLawyers);

  useEffect(() => {
    // Load registered lawyers from localStorage and merge
    const registered = getAllRegisteredLawyers();
    const formattedRegistered: Lawyer[] = registered.map((reg) => ({
      id: reg.id,
      name: reg.fullName,
      specialty: reg.specialty || "General Law Practice",
      location: reg.state || reg.location || "Lagos",
      experienceYears: 5,
      rating: 5.0,
      casesWon: 20,
      hourlyRate: reg.hourlyRate || "Standard Retainer",
      bio: reg.bio || `Licensed legal practitioner. Supreme Court Enrollment No: ${reg.barNumber || "Enrolled"}`,
      isVerified: reg.verificationStatus === "Approved",
    }));

    // Avoid duplicating if already present
    const combined = [...formattedRegistered, ...initialDirectoryLawyers.filter(
      (m) => !formattedRegistered.some((r) => r.name.toLowerCase() === m.name.toLowerCase())
    )];

    setLawyersList(combined);
  }, []);

  const filteredLawyers = lawyersList.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" || lawyer.specialty === selectedSpecialty;

    const matchesLocation =
      selectedLocation === "All Locations" || lawyer.location === selectedLocation;

    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800">
      
      {/* 1. HERO & SEARCH BAR */}
      <section className="bg-[#0F2B5B] text-white py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Verified Legal Directory
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Find A Verified Lawyer <span className="text-[#D4AF37]">You Can Trust</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search through licensed Nigerian attorneys by specialty, city, experience, and client ratings.
          </p>

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-slate-200 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-800">
            <div>
              <input
                type="text"
                placeholder="Search lawyer name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>

            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LAWYERS LISTING GRID */}
      <section className="py-10 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Showing <span className="text-[#0F2B5B] font-bold">{filteredLawyers.length}</span> verified attorneys
          </p>
          {(searchTerm || selectedSpecialty !== "All Specialties" || selectedLocation !== "All Locations") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("All Specialties");
                setSelectedLocation("All Locations");
              }}
              className="text-xs text-[#0F2B5B] font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredLawyers.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 text-center rounded-xl border border-slate-200 space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-[#0F2B5B]">No Lawyers Match Your Search</h3>
            <p className="text-xs sm:text-sm text-slate-600">Try adjusting your filters or searching with different keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#0F2B5B]">
                          {lawyer.name}
                        </h3>
                        {lawyer.isVerified && (
                          <span className="text-emerald-600 text-xs font-bold" title="Bar Association Verified">
                            ✔
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#D4AF37]">{lawyer.specialty}</p>
                    </div>

                    <div className="px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-bold text-amber-800 flex items-center gap-1 shrink-0">
                      <span>★</span> {lawyer.rating}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {lawyer.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Location</span>
                      <span className="font-medium text-slate-800">{lawyer.location}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Experience</span>
                      <span className="font-medium text-slate-800">{lawyer.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Cases Won</span>
                      <span className="font-medium text-slate-800">{lawyer.casesWon}+</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Rate</span>
                      <span className="font-medium text-slate-800">{lawyer.hourlyRate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0F2B5B] font-bold text-xs rounded transition-all"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate("/request-service")}
                    className="w-full py-2 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs rounded transition-all shadow-sm"
                  >
                    Hire Lawyer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default FindLawyer;
