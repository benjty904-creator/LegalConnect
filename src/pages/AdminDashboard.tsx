import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllRequests, updateRequestStatus, assignLawyerToRequest } from "../services/caseService";
import { getAllReports, updateReportStatus } from "../services/reportService";
import { getAllUsers, updateLawyerStatus, getActiveUser } from "../services/authService";
import { getDocumentsByRequestId } from "../services/documentService";
import { ServiceRequest, AnonymousReport, User, StoredDocument, RequestStatus, LawyerVerificationStatus, WhistleblowerStatus } from "../types";
import Modal from "../components/Modal";
import { formatFileSize } from "../utils/formatters";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const activeUser = user || getActiveUser();

  const [activeTab, setActiveFilterTab] = useState<"requests" | "whistleblower" | "lawyers" | "citizens">("requests");

  const [requests, setRequests] = useState<ServiceRequest[]>(() => getAllRequests());
  const [reports, setReports] = useState<AnonymousReport[]>(() => getAllReports());
  const [lawyers, setLawyers] = useState<User[]>(() => getAllUsers().filter((u) => u.role === "lawyer"));
  const [citizens, setCitizens] = useState<User[]>(() => getAllUsers().filter((u) => u.role === "citizen"));

  // Modals
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestDocs, setRequestDocs] = useState<StoredDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  const [assigningRequest, setAssigningRequest] = useState<ServiceRequest | null>(null);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>("");

  const loadAllData = useCallback(() => {
    const allReqs = getAllRequests();
    setRequests(allReqs);

    const allReps = getAllReports();
    setReports(allReps);

    const allUsers = getAllUsers();
    setLawyers(allUsers.filter((u) => u.role === "lawyer"));
    setCitizens(allUsers.filter((u) => u.role === "citizen"));
  }, []);

  useEffect(() => {
    loadAllData();

    const handleStorageChange = () => {
      loadAllData();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadAllData();
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
  }, [loadAllData]);

  // Assign lawyer
  const handleConfirmAssignLawyer = () => {
    if (!assigningRequest || !selectedLawyerId) return;
    const targetLawyer = lawyers.find((l) => l.id === selectedLawyerId);
    if (!targetLawyer) return;

    assignLawyerToRequest(assigningRequest.id, targetLawyer.id, targetLawyer.fullName);
    setAssigningRequest(null);
    setSelectedLawyerId("");
    loadAllData();
  };

  // Status Change for Service Request
  const handleStatusChange = (requestId: string, status: RequestStatus) => {
    updateRequestStatus(requestId, status);
    loadAllData();
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Report status
  const handleReportStatusChange = (reportId: string, status: WhistleblowerStatus) => {
    updateReportStatus(reportId, status);
    loadAllData();
  };

  // Approve / Decline lawyer
  const handleLawyerVerification = (lawyerId: string, status: LawyerVerificationStatus) => {
    updateLawyerStatus(lawyerId, status);
    loadAllData();
  };

  // Open details modal
  const handleOpenDetails = async (req: ServiceRequest) => {
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

  // Dynamic Metrics
  const pendingRequestsCount = requests.filter(
    (r) => r.status === "Pending Assignment" || r.status === "Under Review"
  ).length;
  const unreviewedReportsCount = reports.filter((r) => r.status === "Unreviewed").length;
  const pendingLawyersCount = lawyers.filter((l) => l.verificationStatus === "Pending Verification").length;
  const verifiedLawyersCount = lawyers.filter((l) => l.verificationStatus === "Approved").length;

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 pb-16">
      
      {/* 1. ADMIN HEADER */}
      <section className="bg-[#0F2B5B] text-white py-10 sm:py-14 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#0F2B5B] text-xs font-extrabold uppercase tracking-wider rounded">
                Super Admin Control
              </span>
              <span className="text-xs text-slate-300">
                Logged in as: {activeUser?.fullName || "Administrator"} ({activeUser?.email})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              LegalConnect <span className="text-[#D4AF37]">Executive Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              System Triage • Case Routing • Anonymous Report Oversight • Lawyer Credential Verification
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                logout();
                navigate("/admin-login");
              }}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm rounded transition-all shadow"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>
   
      {/* 2. DYNAMIC SYSTEM METRICS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Pending Triage</span>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">
              {pendingRequestsCount} {pendingRequestsCount === 1 ? "Request" : "Requests"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Unreviewed Whistleblower</span>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">
              {unreviewedReportsCount} {unreviewedReportsCount === 1 ? "Report" : "Reports"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Pending Bar Verification</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F2B5B]">
              {pendingLawyersCount} {pendingLawyersCount === 1 ? "Lawyer" : "Lawyers"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Verified Directory</span>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {verifiedLawyersCount} Active
            </p>
          </div>
        </div>
      </section>

      {/* 3. MANAGEMENT TABS & TABLES */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-6 space-y-6">
          
          {/* TAB BUTTONS */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            <button
              onClick={() => setActiveFilterTab("requests")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === "requests"
                  ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📋 Legal Service Intake ({requests.length})
            </button>
            <button
              onClick={() => setActiveFilterTab("whistleblower")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === "whistleblower"
                  ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🔒 Whistleblower Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveFilterTab("lawyers")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === "lawyers"
                  ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ⚖️ Bar Approvals ({lawyers.length})
            </button>
            <button
              onClick={() => setActiveFilterTab("citizens")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === "citizens"
                  ? "bg-[#0F2B5B] text-[#D4AF37] shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              👤 Registered Citizens ({citizens.length})
            </button>
          </div>

          {/* TAB 1: SERVICE REQUESTS TRIAGE */}
          {activeTab === "requests" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#0F2B5B]">Incoming Citizen Service Requests</h3>
                <span className="text-xs text-slate-500">Live storage registry</span>
              </div>

              {requests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">📁</span>
                  <p className="text-sm font-semibold">No service requests have been submitted yet.</p>
                  <p className="text-xs">Requests submitted through "Request Legal Service" will appear here automatically.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0F2B5B]">{r.referenceCode}</span>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-semibold rounded">
                            {r.serviceType}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                            r.status === "Assigned" || r.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : r.status === "Rejected"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}>
                            ● {r.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{r.category}</h4>
                        <p className="text-xs text-slate-500">
                          Applicant: <strong className="text-slate-700">{r.applicantName}</strong> ({r.location}) • Phone: <strong className="text-slate-700">{r.phone}</strong> • Urgency: <strong className="text-red-700">{r.urgency}</strong> • Submitted: <strong>{r.dateSubmitted}</strong>
                        </p>
                        {r.assignedLawyerName && (
                          <p className="text-xs text-[#0F2B5B] font-semibold">
                            Assigned Advocate: {r.assignedLawyerName}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
                        <button
                          onClick={() => handleOpenDetails(r)}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded transition-all"
                        >
                          Details & Files
                        </button>

                        <button
                          onClick={() => {
                            setAssigningRequest(r);
                            setSelectedLawyerId("");
                          }}
                          className="px-3 py-1.5 bg-[#0F2B5B] text-[#D4AF37] font-bold text-xs rounded hover:bg-[#163a75] transition-all"
                        >
                          {r.assignedLawyerName ? "Reassign Lawyer" : "Assign Lawyer"}
                        </button>

                        {/* Status dropdown */}
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value as RequestStatus)}
                          className="px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Pending Assignment">Pending Assignment</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="In Court">In Court</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANONYMOUS WHISTLEBLOWER REPORTS */}
          {activeTab === "whistleblower" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F2B5B]">Encrypted Whistleblower Reports</h3>

              {reports.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">🔒</span>
                  <p className="text-sm font-semibold">No anonymous reports on record.</p>
                  <p className="text-xs">Citizen reports submitted through "Anonymous Whistleblower Reporting" will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-red-700">{rep.trackingCode}</span>
                          <span className="text-xs font-semibold text-slate-800">{rep.category}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${
                          rep.status === "Unreviewed"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : rep.status === "Investigating"
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : rep.status === "Action Taken"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-slate-100 text-slate-800 border-slate-300"
                        }`}>
                          ● {rep.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">
                        {rep.description}
                      </p>

                      {rep.involvedParties && (
                        <p className="text-xs text-slate-700 bg-slate-100/60 p-2 rounded">
                          <strong>Reported Entities / Suspects:</strong> {rep.involvedParties}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-slate-500">
                          Jurisdiction: <strong>{rep.location}</strong> • Incident Date: <strong>{rep.incidentDate || "Undisclosed"}</strong> • Submitted: <strong>{rep.dateSubmitted}</strong>
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReportStatusChange(rep.id, "Investigating")}
                            className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded transition-all"
                          >
                            Mark Investigating
                          </button>
                          <button
                            onClick={() => handleReportStatusChange(rep.id, "Action Taken")}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded transition-all"
                          >
                            Action Taken
                          </button>
                          <button
                            onClick={() => handleReportStatusChange(rep.id, "Dismissed")}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded transition-all"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LAWYER BAR VERIFICATION */}
          {activeTab === "lawyers" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F2B5B]">Registered Legal Practitioners ({lawyers.length})</h3>

              {lawyers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">⚖️</span>
                  <p className="text-sm font-semibold">No lawyer accounts registered yet.</p>
                  <p className="text-xs">Lawyers registering on the platform will appear here for Supreme Court enrollment credential verification.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lawyers.map((l) => (
                    <div
                      key={l.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{l.fullName}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            l.verificationStatus === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : l.verificationStatus === "Declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {l.verificationStatus || "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Bar Enrollment: <strong className="font-mono text-slate-800">{l.barNumber || "N/A"}</strong> • Specialty: <strong>{l.specialty || "General Law"}</strong> • Location: <strong>{l.state || l.location}</strong>
                        </p>
                        <p className="text-xs text-slate-400">
                          Email: {l.email} • Phone: {l.phone} • Registered: {l.createdAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {l.verificationStatus !== "Approved" && (
                          <button
                            onClick={() => handleLawyerVerification(l.id, "Approved")}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded transition-all shadow"
                          >
                            Approve Credentials
                          </button>
                        )}
                        {l.verificationStatus !== "Declined" && (
                          <button
                            onClick={() => handleLawyerVerification(l.id, "Declined")}
                            className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition-all shadow"
                          >
                            Decline
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REGISTERED CITIZENS */}
          {activeTab === "citizens" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F2B5B]">Registered Citizens ({citizens.length})</h3>

              {citizens.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">👤</span>
                  <p className="text-sm font-semibold">No citizen accounts registered yet.</p>
                  <p className="text-xs">Citizens who sign up will be listed here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {citizens.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">{c.fullName}</h4>
                        <p className="text-xs text-slate-500">
                          Email: <strong className="text-slate-700">{c.email}</strong> • Phone: <strong className="text-slate-700">{c.phone}</strong> • Location: <strong>{c.location}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Joined on: {c.createdAt}
                        </p>
                      </div>

                      <div className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded">
                        Active Requests: {requests.filter((r) => r.userId === c.id).length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* REQUEST DETAILS & DOCUMENTS MODAL */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `Triage File: ${selectedRequest.referenceCode}` : "Case File"}
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
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold border mt-0.5 bg-amber-100 text-amber-800">
                  {selectedRequest.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Applicant</span>
                <span className="font-semibold text-slate-800">{selectedRequest.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Contact</span>
                <span className="font-semibold text-slate-800">{selectedRequest.phone} • {selectedRequest.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Urgency</span>
                <span className="font-semibold text-red-700">{selectedRequest.urgency}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Assigned Advocate</span>
                <span className="font-semibold text-[#0F2B5B]">{selectedRequest.assignedLawyerName || "Unassigned"}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Full Matter Brief</h4>
              <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedRequest.details}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Applicant Documents</h4>
              {loadingDocs ? (
                <p className="text-slate-400 text-xs">Loading documents...</p>
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
                        className="px-2.5 py-1 bg-[#0F2B5B] text-[#D4AF37] font-bold text-[11px] rounded hover:bg-[#163a75] transition-all"
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
                <p className="text-slate-400 text-xs italic">No documents attached.</p>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  setAssigningRequest(selectedRequest);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold rounded text-xs transition-all"
              >
                Assign / Reassign Advocate
              </button>
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

      {/* ASSIGN LAWYER MODAL */}
      <Modal
        isOpen={!!assigningRequest}
        onClose={() => setAssigningRequest(null)}
        title={assigningRequest ? `Assign Counsel: ${assigningRequest.referenceCode}` : "Assign Counsel"}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Select a verified legal practitioner from the registry to assign to this matter ({assigningRequest?.category}).
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Available Legal Practitioners</label>
            {lawyers.length === 0 ? (
              <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded">
                No lawyers are currently registered on this system. Once a lawyer registers via the "Legal Advocate" registration, they will be selectable here.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {lawyers.map((lawyer) => (
                  <label
                    key={lawyer.id}
                    className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${
                      selectedLawyerId === lawyer.id
                        ? "bg-blue-50/60 border-[#0F2B5B]"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="lawyerChoice"
                      value={lawyer.id}
                      checked={selectedLawyerId === lawyer.id}
                      onChange={() => setSelectedLawyerId(lawyer.id)}
                      className="mt-1"
                    />
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{lawyer.fullName}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          lawyer.verificationStatus === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {lawyer.verificationStatus || "Pending"}
                        </span>
                      </div>
                      <p className="text-slate-500 font-mono text-[11px]">{lawyer.barNumber || "No Bar SCN"}</p>
                      <p className="text-slate-600">{lawyer.specialty} • {lawyer.state || lawyer.location}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setAssigningRequest(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!selectedLawyerId}
              onClick={handleConfirmAssignLawyer}
              className="px-4 py-2 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold rounded text-xs transition-all disabled:opacity-50"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
