import type { AnonymousReport, WhistleblowerStatus } from "../types";
import { generateId, generateTrackingCode } from "./cryptoService";
import { getItem, setItem, STORAGE_KEYS } from "./storageService";
import { formatDate } from "../utils/formatters";

export interface CreateReportInput {
  category: string;
  location: string;
  incidentDate?: string;
  description: string;
  involvedParties?: string;
}

export function getAllReports(): AnonymousReport[] {
  return getItem<AnonymousReport[]>(STORAGE_KEYS.REPORTS, []);
}

export function createAnonymousReport(
  input: CreateReportInput
): { success: boolean; report?: AnonymousReport; error?: string } {
  if (!input.description.trim()) {
    return { success: false, error: "Please provide a factual description of the incident." };
  }

  const newReport: AnonymousReport = {
    id: generateId(),
    trackingCode: generateTrackingCode("ANON"),
    category: input.category,
    location: input.location,
    incidentDate: input.incidentDate,
    description: input.description.trim(),
    involvedParties: input.involvedParties?.trim(),
    status: "Unreviewed",
    dateSubmitted: formatDate(),
  };

  const reports = getAllReports();
  reports.unshift(newReport);
  setItem(STORAGE_KEYS.REPORTS, reports);

  return { success: true, report: newReport };
}

export function updateReportStatus(
  reportId: string,
  status: WhistleblowerStatus
): { success: boolean; error?: string } {
  const reports = getAllReports();
  const index = reports.findIndex((r) => r.id === reportId);
  if (index === -1) {
    return { success: false, error: "Report not found." };
  }

  reports[index] = {
    ...reports[index],
    status,
  };

  setItem(STORAGE_KEYS.REPORTS, reports);
  return { success: true };
}
