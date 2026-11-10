export type UserRole = "citizen" | "lawyer" | "admin";

export type LawyerVerificationStatus = "Pending Verification" | "Approved" | "Declined";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  location: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  // Lawyer specific fields
  barNumber?: string;
  specialty?: string;
  state?: string;
  verificationStatus?: LawyerVerificationStatus;
  bio?: string;
  hourlyRate?: string;
}

export type RequestStatus =
  | "Pending Assignment"
  | "Under Review"
  | "Assigned"
  | "In Progress"
  | "In Court"
  | "Completed"
  | "Rejected";

export type UrgencyLevel = "Low" | "Medium" | "High" | "High / Emergency";

export interface ServiceRequest {
  id: string;
  referenceCode: string;
  userId: string;
  applicantName: string;
  email: string;
  phone: string;
  location: string;
  serviceType: "Free Pro-Bono" | "Paid Retainer";
  category: string;
  urgency: UrgencyLevel;
  details: string;
  status: RequestStatus;
  assignedLawyerId?: string;
  assignedLawyerName?: string;
  dateSubmitted: string;
  updatedAt: string;
  documentNames?: string[];
}

export type WhistleblowerStatus = "Unreviewed" | "Investigating" | "Dismissed" | "Action Taken";

export interface AnonymousReport {
  id: string;
  trackingCode: string;
  category: string;
  location: string;
  incidentDate?: string;
  description: string;
  involvedParties?: string;
  status: WhistleblowerStatus;
  dateSubmitted: string;
}

export interface StoredDocument {
  id: string;
  requestId: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

