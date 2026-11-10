import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getActiveUser } from "../services/authService";
import { getRequestsForLawyer, updateRequestStatus } from "../services/caseService";
import { getDocumentsByRequestId } from "../services/documentService";
import { ServiceRequest, StoredDocument, RequestStatus } from "../types";
import Modal from "../components/Modal";
import { formatFileSize } from "../utils/formatters";

const LawyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const activeUser = user || getActiveUser();

  const [casesList, setCasesList] = useState<ServiceRequest[]>(() => {
    const current = getActiveUser();
    return current ? getRequestsForLawyer(current.id, current.fullName) : [];
  });
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedCase, setSelectedCase] = useState<ServiceRequest | null>(null);
  const [caseDocs, setCaseDocs] = useState<StoredDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  // Profile Edit State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    specialty: "",
    bio: "",
    state: "",
  });
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadCases = useCallback(() => {
    const current = user || getActiveUser();
    if (current) {
      const assigned = getRequestsForLawyer(current.id, current.fullName);
      setCasesList(assigned);
    }
  }, [user]);

  useEffect(() => {
    loadCases();

    const handleStorageChange = () => {
      loadCases();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCases();
      }
    };

    window.addEventListener("lc_storage_change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    window.addEventListener("pageshow", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("lc_storage_change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
      window.removeEventListener("pageshow", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadCases]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        specialty: user.specialty || "Corporate & Commercial Law",
        bio: user.bio || "",
        state: user.state || user.location || "Lagos",
      });
    }
  }, [user]);

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    const res = updateRequestStatus(id, newStatus);
    if (res.success) {
      loadCases();
      if (selectedCase && selectedCase.id === id) {
        setSelectedCase(res.request || null);
      }
    }
  };

  const handleOpenCaseDetails = async (c: ServiceRequest) => {
    setSelectedCase(c);
    setLoadingDocs(true);
    try {
      const docs = await getDocumentsByRequestId(c.id);
      setCaseDocs(docs);
    } catch (e) {
      console.error(e);
      setCaseDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    const res = updateProfile({
      fullName: profileData.fullName.trim(),
      phone: profileData.phone.trim(),
      specialty: profileData.specialty.trim(),
      bio: profileData.bio.trim(),
      state: profileData.state.trim(),
    });

    if (res.success) {
      setProfileMessage({ type: "success", text: "Advocate credentials saved." });
      setTimeout(() => {
        setIsEditProfileOpen(false);
        setProfileMessage(null);
      }, 1200);
    } else {
      setProfileMessage({ type: "error", text: res.error || "Failed to update profile." });
    }
  };

  const filteredCases =
    activeFilter === "All"
      ? casesList
      : casesList.filter((c) => {
          if (activeFilter === "Pending Acceptance") {
            return c.status === "Assigned";
          }
          if (activeFilter === "Active Case") {
            return c.status === "In Progress";
          }
          if (activeFilter === "In Court") {
            return c.status === "In Court";
          }
          if (activeFilter === "Resolved") {
            return c.status === "Completed";
          }
          return c.status === activeFilter;
        });

  const getStatusBadge = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "Assigned":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "In Progress":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "In Court":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "Completed":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  // Dynamic Statistics
  const totalAssigned = casesList.length;
  const pendingAcceptance = casesList.filter((c) => c.status === "Assigned").length;
  const activeLitigation = casesList.filter((c) => c.status === "In Progress" || c.status === "In Court").length;
  const successfullyResolved = casesList.filter((c) => c.status === "Completed").length;

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 pb-16">
      
      {/* 1. ADVOCATE PORTAL HEADER */}
      <section className="bg-[#0F2B5B] text-white py-10 sm:py-14 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                Legal Practitioner Portal
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  activeUser?.verificationStatus === "Approved"
                    ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
                    : activeUser?.verificationStatus === "Declined"
                    ? "bg-red-600/20 text-red-300 border-red-500/40"
                    : "bg-amber-600/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {activeUser?.verificationStatus === "Approved"
                  ? "✔ Active NBA Verified"
                  : activeUser?.verificationStatus === "Declined"
                  ? "✖ Bar Credentials Declined"
                  : "⏳ Pending Bar Verification"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome Counsel, <span className="text-[#D4AF37]">{activeUser?.fullName || "Counsel"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Supreme Court Enrollment: <span className="font-mono text-slate-200">{activeUser?.barNumber || "N/A"}</span> • Specialty: {activeUser?.specialty || "Legal Practice"} • Practice State: {activeUser?.state || activeUser?.location || "National"}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0 items-center">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded transition-all border border-white/20"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm rounded transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS METRICS - DYNAMIC */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Assigned Matters</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F2B5B]">
              {totalAssigned} {totalAssigned === 1 ? "Case" : "Cases"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Pending Acceptance</span>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">
              {pendingAcceptance} Pending
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Litigation</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
              {activeLitigation} Active
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Successfully Resolved</span>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {successfullyResolved} Resolved
            </p>
          </div>
        </div>
      </section>

      {/* 3. CASE MANAGEMENT SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F2B5B]">Assigned Client Cases & Briefs</h2>
              <p className="text-xs text-slate-500">Review intake briefs, accept incoming matters, or update litigation status.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Pending Acceptance", "Active Case", "In Court", "Resolved"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeFilter === filter
                      ? "bg-[#0F2B5B] text-[#D4AF37]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          {filteredCases.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <span className="text-3xl block">⚖️</span>
              <p className="text-sm font-semibold text-slate-700">No matters assigned under this category.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {casesList.length === 0
                  ? "When an administrator assigns client service requests to you, they will appear in this triage portal."
                  : "No cases match the selected filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#0F2B5B]">{c.applicantName}</span>
                      <span className="font-mono text-xs font-semibold text-slate-600">({c.referenceCode})</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        c.serviceType === "Free Pro-Bono" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {c.serviceType}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${getStatusBadge(c.status)}`}>
                        ● {c.status}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500">
                      Submitted: <strong className="text-slate-700">{c.dateSubmitted}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                      {c.category}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                      <strong className="text-[#0F2B5B]">Case Brief:</strong> {c.details}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>Jurisdiction: <strong className="text-slate-700">{c.location}</strong></span>
                      <span>Priority: <strong className="text-amber-700">{c.urgency}</strong></span>
                      <span>Contact: <strong className="text-slate-700">{c.phone}</strong> ({c.email})</span>
                      {c.documentNames && c.documentNames.length > 0 && (
                        <span>Files: <strong className="text-slate-700">{c.documentNames.length} attached</strong></span>
                      )}
                    </div>

                    {/* Quick Status Action Buttons */}
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleOpenCaseDetails(c)}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded transition-all"
                      >
                        Inspect Files
                      </button>

                      {c.status === "Assigned" && (
                        <button
                          onClick={() => handleStatusChange(c.id, "In Progress")}
                          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded transition-all shadow"
                        >
                          Accept Case
                        </button>
                      )}

                      {c.status === "In Progress" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(c.id, "In Court")}
                            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded transition-all"
                          >
                            Mark as In Court
                          </button>
                          <button
                            onClick={() => handleStatusChange(c.id, "Completed")}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded transition-all"
                          >
                            Mark Resolved
                          </button>
                        </>
                      )}

                      {c.status === "In Court" && (
                        <button
                          onClick={() => handleStatusChange(c.id, "Completed")}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded transition-all"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* CASE DETAILS & FILES MODAL */}
      <Modal
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        title={selectedCase ? `Case File: ${selectedCase.referenceCode}` : "Case File"}
        maxWidth="lg"
      >
        {selectedCase && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-semibold text-[10px]">Client</span>
                <span className="font-bold text-slate-800">{selectedCase.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-semibold text-[10px]">Contact</span>
                <span className="font-medium text-slate-700">{selectedCase.phone} • {selectedCase.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-semibold text-[10px]">Track</span>
                <span className="font-medium text-slate-700">{selectedCase.serviceType}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-semibold text-[10px]">Current Status</span>
                <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${getStatusBadge(selectedCase.status)}`}>
                  {selectedCase.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Matter Description</h4>
              <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedCase.details}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Attached Evidentiary Documents</h4>
              {loadingDocs ? (
                <p className="text-slate-400 text-xs">Loading files...</p>
              ) : caseDocs.length > 0 ? (
                <div className="space-y-1.5">
                  {caseDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>📄</span>
                        <span className="font-medium truncate">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">({formatFileSize(doc.size)})</span>
                      </div>
                      <a
                        href={doc.dataUrl}
                        download={doc.name}
                        className="px-2.5 py-1 bg-[#0F2B5B] text-[#D4AF37] font-bold text-[11px] rounded hover:bg-[#163a75] transition-all"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : selectedCase.documentNames && selectedCase.documentNames.length > 0 ? (
                <div className="space-y-1">
                  {selectedCase.documentNames.map((name, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-600">
                      📄 {name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">No documents were submitted with this brief.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition-all"
              >
                Close File
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* LAWYER PROFILE EDIT MODAL */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => {
          setIsEditProfileOpen(false);
          setProfileMessage(null);
        }}
        title="Edit Advocate Profile"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {profileMessage && (
            <div
              className={`p-3 rounded text-xs ${
                profileMessage.type === "success"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                  : "bg-red-50 border border-red-300 text-red-800"
              }`}
            >
              {profileMessage.text}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Full Professional Name *</label>
            <input
              type="text"
              required
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Practice State</label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Legal Specialty</label>
            <input
              type="text"
              value={profileData.specialty}
              onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Advocate Biography / Practice Scope</label>
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold rounded text-xs transition-all shadow"
            >
              Update Credentials
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default LawyerDashboard;
