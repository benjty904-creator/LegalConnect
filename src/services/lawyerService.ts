import { User } from "../types";
import { getAllUsers } from "./authService";

export function getAllRegisteredLawyers(): User[] {
  return getAllUsers().filter((u) => u.role === "lawyer");
}

export function getVerifiedLawyers(): User[] {
  return getAllRegisteredLawyers().filter((l) => l.verificationStatus === "Approved");
}

export function getLawyerById(id: string): User | undefined {
  return getAllRegisteredLawyers().find((l) => l.id === id);
}

