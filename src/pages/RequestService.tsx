import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createServiceRequest } from "../services/caseService";
import { getActiveUser } from "../services/authService";
import { saveDocument, validateDocumentFile } from "../services/documentService";
import { formatFileSize } from "../utils/formatters";
import { ServiceRequest, UrgencyLevel } from "../types";

const RequestService: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeAccount = user || getActiveUser();

  const [serviceType, setServiceType] = useState<"Free Pro-Bono" | "Paid Retainer">("Free Pro-Bono");
  const [formData, setFormData] = useState({
    fullName: activeAccount?.fullName || "",
    email: activeAccount?.email || "",
    phone: activeAccount?.phone || "",
    location: activeAccount?.location || "Lagos",
    legalCategory: "Human Rights & Criminal Defense",
    urgency: "Medium" as UrgencyLevel,
    details: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  // Pre-fill user information if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        location: user.location || prev.location,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const validFiles: File[] = [];

    for (const file of filesArray) {
      const validation = validateDocumentFile(file);
      if (!validation.valid) {
        setFileError(validation.error || "Invalid file.");
        return;
      }
      validFiles.push(file);
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please provide your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Please provide your phone number.");
      return;
    }
    if (!formData.details.trim()) {
      setError("Please provide a summary of your legal matter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const docNames = uploadedFiles.map((f) => f.name);

      const res = createServiceRequest(
        {
          serviceType,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          category: formData.legalCategory,
          urgency: formData.urgency,
          details: formData.details,
          documentNames: docNames,
        },
        user
      );

      if (!res.success || !res.request) {
        setError(res.error || "Failed to submit request.");
        setIsSubmitting(false);
        return;
      }

      // Persist documents in IndexedDB linked to request ID
      for (const file of uploadedFiles) {
        await saveDocument(file, res.request.id);
      }

      setSubmittedRequest(res.request);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Submission error:", err);
      setError("An unexpected error occurred while saving your request.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#0F2B5B] text-white py-10 sm:py-16 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Official Assistance Intake
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Request <span className="text-[#D4AF37]">Legal Service</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Submit your legal matter securely. Your submission is recorded locally and immediately dispatched for administrative case triage.
          </p>
        </div>
      </section>

      {/* 2. FORM SECTION */}
      <section className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {submittedRequest ? (
          /* SUCCESS MESSAGE */
          <div className="bg-white p-6 sm:p-10 rounded-xl border border-emerald-300 shadow-md text-center space-y-5">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto font-bold shadow-xs">
              ✓
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F2B5B]">
              Legal Request Recorded Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Your matter has been entered into the case management registry. It is now active and awaiting administrative triage.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
                <span className="text-slate-500">Official Reference Code:</span>
                <span className="font-mono font-bold text-[#0F2B5B] text-sm">
                  {submittedRequest.referenceCode}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Track Type:</span>
                <span className="font-semibold text-slate-800">{submittedRequest.serviceType}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Legal Practice Area:</span>
                <span className="font-semibold text-slate-800">{submittedRequest.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Current Status:</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                  ● {submittedRequest.status}
                </span>
              </div>
              {submittedRequest.documentNames && submittedRequest.documentNames.length > 0 && (
                <div className="text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Uploaded Documents:</span>
                  <span className="font-semibold text-slate-700 ml-1">
                    {submittedRequest.documentNames.join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSubmittedRequest(null);
                  setUploadedFiles([]);
                  setFormData({
                    fullName: user?.fullName || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    location: user?.location || "Lagos",
                    legalCategory: "Human Rights & Criminal Defense",
                    urgency: "Medium",
                    details: "",
                  });
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F2B5B] font-bold text-xs sm:text-sm rounded transition-all"
              >
                + Submit Another Request
              </button>
              <button
                onClick={() => navigate("/user-dashboard")}
                className="px-5 py-2.5 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs sm:text-sm rounded transition-all shadow"
              >
                Track in Citizen Dashboard →
              </button>
            </div>
          </div>
        ) : (
          /* INTAKE FORM */
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm space-y-6"
          >
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs sm:text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* SERVICE TYPE TOGGLE */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-[#0F2B5B]">
                Select Assistance Track
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceType("Free Pro-Bono")}
                  className={`py-3 px-4 rounded-lg text-xs sm:text-sm font-bold border transition-all text-center ${
                    serviceType === "Free Pro-Bono"
                      ? "bg-[#0F2B5B] text-[#D4AF37] border-[#0F2B5B] shadow"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Free Pro-Bono Aid
                </button>
                <button
                  type="button"
                  onClick={() => setServiceType("Paid Retainer")}
                  className={`py-3 px-4 rounded-lg text-xs sm:text-sm font-bold border transition-all text-center ${
                    serviceType === "Paid Retainer"
                      ? "bg-[#0F2B5B] text-[#D4AF37] border-[#0F2B5B] shadow"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Paid Attorney Retainer
                </button>
              </div>
            </div>

            {/* CONTACT DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Olamide Johnson"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">State / Location *</label>
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
                  <option value="Other">Other Location</option>
                </select>
              </div>
            </div>

            {/* CATEGORY AND URGENCY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Legal Practice Area *</label>
                <select
                  name="legalCategory"
                  value={formData.legalCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                >
                  <option value="Human Rights & Criminal Defense">Human Rights & Criminal Defense</option>
                  <option value="Corporate & Commercial Law">Corporate & Commercial Law</option>
                  <option value="Property & Real Estate">Property & Real Estate</option>
                  <option value="Family & Tenancy Dispute">Family & Tenancy Dispute</option>
                  <option value="Labor & Employment">Labor & Employment</option>
                  <option value="Intellectual Property & Tech">Intellectual Property & Tech</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Urgency Level</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
                >
                  <option value="Low">Low (General Inquiry)</option>
                  <option value="Medium">Medium (Standard Matter)</option>
                  <option value="High">High (Court Date Pending)</option>
                  <option value="High / Emergency">Emergency (Immediate Arrest / Threat)</option>
                </select>
              </div>
            </div>

            {/* CASE DETAILS */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Summary of Legal Matter *</label>
              <textarea
                name="details"
                required
                rows={4}
                placeholder="Provide concise details regarding your situation, key dates, opposing parties, and relief sought..."
                value={formData.details}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:border-[#0F2B5B]"
              ></textarea>
            </div>

            {/* DOCUMENT UPLOAD (IndexedDB persistent) */}
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0F2B5B]">
                  Supporting Case Documents (Optional)
                </label>
                <span className="text-[11px] text-slate-400">PDF, Word, Images (Max 5MB each)</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-[#0F2B5B] rounded-lg p-4 text-center bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                >
                  <span className="text-2xl">📎</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#0F2B5B]">
                    Click to browse files
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Court summons, letters, IDs, or lease agreements (stored locally via browser IndexedDB)
                  </span>
                </label>
              </div>

              {fileError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">⚠️ {fileError}</p>
              )}

              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Selected Files ({uploadedFiles.length}):
                  </span>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-slate-500">📄</span>
                          <span className="font-medium text-slate-800 truncate">{file.name}</span>
                          <span className="text-slate-400 text-[10px]">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 text-xs shrink-0"
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] font-bold text-xs sm:text-sm rounded transition-all shadow-md uppercase tracking-wider active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting & Encrypting..." : "Submit Assistance Request"}
            </button>
          </form>
        )}
      </section>

    </div>
  );
};

export default RequestService;
