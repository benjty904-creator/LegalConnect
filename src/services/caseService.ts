import type { ServiceRequest, RequestStatus, UrgencyLevel, User } from "../types";
import { generateId, generateReferenceCode } from "./cryptoService";
import { getItem, setItem, STORAGE_KEYS } from "./storageService";
import { formatDate } from "../utils/formatters";

export interface CreateServiceRequestInput {
  serviceType: "Free Pro-Bono" | "Paid Retainer";
  fullName: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  urgency: UrgencyLevel;
  details: string;
  documentNames?: string[];
}

export function getAllRequests(): ServiceRequest[] {
  return getItem<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, []);
}

export function getRequestsByUser(userId: string, userEmail?: string): ServiceRequest[] {
  const all = getAllRequests();
  return all.filter(
    (r) =>
      r.userId === userId ||
      (userEmail && r.email && r.email.toLowerCase() === userEmail.toLowerCase())
  );
}

export function getRequestsForLawyer(lawyerId: string, lawyerName?: string): ServiceRequest[] {
  const all = getAllRequests();
  return all.filter(
    (r) =>
      r.assignedLawyerId === lawyerId ||
      (lawyerName && r.assignedLawyerName && r.assignedLawyerName.toLowerCase() === lawyerName.toLowerCase())
  );
}

export function getRequestById(id: string): ServiceRequest | undefined {
  const all = getAllRequests();
  return all.find((r) => r.id === id);
}

export function createServiceRequest(
  input: CreateServiceRequestInput,
  user?: User | null
): { success: boolean; request?: ServiceRequest; error?: string } {
  if (!input.fullName.trim()) {
    return { success: false, error: "Applicant name is required." };
  }
  if (!input.email.trim()) {
    return { success: false, error: "Email address is required." };
  }
  if (!input.phone.trim()) {
    return { success: false, error: "Phone number is required." };
  }
  if (!input.details.trim()) {
    return { success: false, error: "Case summary/details are required." };
  }

  const registeredUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const activeUser =
    user ||
    getItem<User | null>(STORAGE_KEYS.ACTIVE_USER, null) ||
    registeredUsers.find((u) => u.email.toLowerCase() === input.email.trim().toLowerCase());

  const newRequest: ServiceRequest = {
    id: generateId(),
    referenceCode: generateReferenceCode("LC"),
    userId: activeUser ? activeUser.id : "guest-" + generateId(),
    applicantName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    location: input.location || "Lagos",
    serviceType: input.serviceType,
    category: input.category,
    urgency: input.urgency || "Medium",
    details: input.details.trim(),
    status: "Pending Assignment",
    dateSubmitted: formatDate(),
    updatedAt: formatDate(),
    documentNames: input.documentNames || [],
  };

  const all = getAllRequests();
  all.unshift(newRequest); // Newest first
  setItem(STORAGE_KEYS.REQUESTS, all);

  return { success: true, request: newRequest };
}

export function updateRequestStatus(
  requestId: string,
  newStatus: RequestStatus
): { success: boolean; request?: ServiceRequest; error?: string } {
  const all = getAllRequests();
  const index = all.findIndex((r) => r.id === requestId);
  if (index === -1) {
    return { success: false, error: "Service request not found." };
  }

  all[index] = {
    ...all[index],
    status: newStatus,
    updatedAt: formatDate(),
  };

  setItem(STORAGE_KEYS.REQUESTS, all);
  return { success: true, request: all[index] };
}

export function assignLawyerToRequest(
  requestId: string,
  lawyerId: string,
  lawyerName: string
): { success: boolean; request?: ServiceRequest; error?: string } {
  const all = getAllRequests();
  const index = all.findIndex((r) => r.id === requestId);
  if (index === -1) {
    return { success: false, error: "Service request not found." };
  }

  all[index] = {
    ...all[index],
    assignedLawyerId: lawyerId,
    assignedLawyerName: lawyerName,
    status: "Assigned",
    updatedAt: formatDate(),
  };

  setItem(STORAGE_KEYS.REQUESTS, all);
  return { success: true, request: all[index] };
}
