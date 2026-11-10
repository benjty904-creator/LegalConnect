import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getActiveUser } from "../services/authService";
import { getRequestsByUser } from "../services/caseService";
import { getDocumentsByRequestId } from "../services/documentService";
import { ServiceRequest, StoredDocument } from "../types";
import Modal from "../components/Modal";
import { formatFileSize } from "../utils/formatters";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const activeUser = user || getActiveUser();

  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const current = getActiveUser();
    return current ? getRequestsByUser(current.id, current.email) : [];
  });
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestDocs, setRequestDocs] = useState<StoredDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  // Profile Edit State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    location: "",
  });
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadRequests = useCallback(() => {
    const current = user || getActiveUser();
    if (current) {
      const userReqs = getRequestsByUser(current.id, current.email);
      setRequests(userReqs);
    }
  }, [user]);

  useEffect(() => {
    loadRequests();

    const handleStorageChange = () => {
      loadRequests();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadRequests();
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
  }, [loadRequests]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        location: user.location || "Lagos",
      });
    }
  }, [user]);

  const handleOpenRequestDetails = async (req: ServiceRequest) => {
    setSelectedRequest(req);
    setLoadingDocs(true);
    try {
      const docs = await getDocumentsByRequestId(req.id);
      setRequestDocs(docs);
    } catch (e) {
      console.error(e);
      setRequestDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!profileData.fullName.trim()) {
      setProfileMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }

    const res = updateProfile({
      fullName: profileData.fullName.trim(),
      phone: profileData.phone.trim(),
      location: profileData.location.trim(),
    });

    if (res.success) {
      setProfileMessage({ type: "success", text: "Profile details updated successfully." });
      setTimeout(() => {
        setIsEditProfileOpen(false);
        setProfileMessage(null);
      }, 1200);
    } else {
      setProfileMessage({ type: "error", text: res.error || "Failed to update profile." });
    }
  };

  const filteredRequests =
    selectedFilter === "All"
      ? requests
      : requests.filter((r) => r.status === selectedFilter);

  const getStatusBadge = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "Pending Assignment":
      case "Under Review":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Assigned":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "In Court":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  // Dynamic Metrics
  const totalCount = requests.length;
  const activeCount = requests.filter(
    (r) => r.status !== "Completed" && r.status !== "Rejected"
  ).length;
  const completedCount = requests.filter((r) => r.status === "Completed").length;
  const assignedLawyersCount = new Set(
    requests.map((r) => r.assignedLawyerName).filter(Boolean)
  ).size;

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 pb-16">
      
      {/* 1. HEADER BANNER */}
      <section className="bg-[#0F2B5B] text-white py-10 sm:py-14 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                Citizen Portal
              </span>
              <span className="text-xs text-slate-300">
                {activeUser?.email} • {activeUser?.location || "Nigeria"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome Back, <span className="text-[#D4AF37]">{activeUser?.fullName || "Citizen"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage your legal assistance applications, active retainers, and assigned counsel.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded transition-all border border-white/20"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => navigate("/request-service")}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] font-bold text-xs sm:text-sm rounded transition-all shadow-md active:scale-95"
            >
              + New Legal Request
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm rounded transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS OVERVIEW - DYNAMIC */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Requests</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F2B5B]">{totalCount}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Cases</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">{activeCount}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Completed Legal Aid</span>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{completedCount}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Assigned Counsel</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F2B5B]">
              {assignedLawyersCount} {assignedLawyersCount === 1 ? "Lawyer" : "Lawyers"}
            </p>
          </div>
        </div>
      </section>

      {/* 3. REQUESTS MANAGEMENT TABLE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F2B5B]">My Legal Cases & Applications</h2>
              <p className="text-xs text-slate-500">Track real-time progress and lawyer communications.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Pending Assignment", "Assigned", "In Progress", "Completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    selectedFilter === filter
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
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <span className="text-4xl block">📁</span>
              <p className="text-sm font-semibold text-slate-700">No requests found in this view.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {requests.length === 0
                  ? "You haven't submitted any legal assistance requests yet. Click below to submit your first matter."
                  : "No requests match the selected status filter."}
              </p>
              {requests.length === 0 && (
                <button
                  onClick={() => navigate("/request-service")}
                  className="px-4 py-2 bg-[#0F2B5B] text-[#D4AF37] font-bold text-xs rounded hover:bg-[#163a75] transition-all"
                >
                  Submit Legal Request
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#0F2B5B]">
                        {req.referenceCode}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-semibold rounded">
                        {req.serviceType}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        ● {req.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {req.category}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                      <span>Submitted: <strong className="text-slate-700">{req.dateSubmitted}</strong></span>
                      <span>Assigned Advocate: <strong className="text-[#0F2B5B]">{req.assignedLawyerName || "Unassigned (Triage)"}</strong></span>
                      <span>Urgency: <strong className="text-amber-700">{req.urgency}</strong></span>
                      {req.documentNames && req.documentNames.length > 0 && (
                        <span>Documents: <strong className="text-slate-700">{req.documentNames.length} attached</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => handleOpenRequestDetails(req)}
                      className="w-full md:w-auto px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition-all text-center"
                    >
                      View Details
                    </button>
                    {req.assignedLawyerName ? (
                      <button
                        onClick={() => navigate("/find-a-lawyer")}
                        className="w-full md:w-auto px-4 py-2 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs rounded transition-all text-center"
                      >
                        Contact Lawyer
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* REQUEST DETAILS MODAL */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `Request Details: ${selectedRequest.referenceCode}` : "Request Details"}
        maxWidth="lg"
      >
        {selectedRequest && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Reference Code</span>
                <span className="font-mono font-bold text-[#0F2B5B] text-sm">{selectedRequest.referenceCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Current Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border mt-0.5 ${getStatusBadge(selectedRequest.status)}`}>
                  ● {selectedRequest.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Track Type</span>
                <span className="font-semibold text-slate-800">{selectedRequest.serviceType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Date Submitted</span>
                <span className="font-semibold text-slate-800">{selectedRequest.dateSubmitted}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Urgency Level</span>
                <span className="font-semibold text-amber-800">{selectedRequest.urgency}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Assigned Advocate</span>
                <span className="font-semibold text-[#0F2B5B]">{selectedRequest.assignedLawyerName || "Pending Triage"}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Practice Category</h4>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">{selectedRequest.category}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Case Brief & Details</h4>
              <p className="text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedRequest.details}
              </p>
            </div>

            {/* Uploaded Documents List */}
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Attached Documents</h4>
              {loadingDocs ? (
                <p className="text-slate-400 text-xs">Loading local attachments...</p>
              ) : requestDocs.length > 0 ? (
                <div className="space-y-1.5">
                  {requestDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>📎</span>
                        <span className="font-medium truncate">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">({formatFileSize(doc.size)})</span>
                      </div>
                      <a
                        href={doc.dataUrl}
                        download={doc.name}
                        className="px-2.5 py-1 bg-[#0F2B5B] text-[#D4AF37] font-bold text-[11px] rounded hover:bg-[#163a75] transition-all shrink-0"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : selectedRequest.documentNames && selectedRequest.documentNames.length > 0 ? (
                <div className="space-y-1">
                  {selectedRequest.documentNames.map((name, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-600">
                      📄 {name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">No documents were attached to this request.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* PROFILE EDIT MODAL */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => {
          setIsEditProfileOpen(false);
          setProfileMessage(null);
        }}
        title="Edit Profile Information"
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
            <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Primary Location</label>
            <select
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
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
              Save Profile Changes
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default UserDashboard;
