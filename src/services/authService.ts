import type { User, UserRole, LawyerVerificationStatus } from "../types";
import { generateId, generateSalt, hashPassword, verifyPassword } from "./cryptoService";
import { getItem, setItem, removeItem, STORAGE_KEYS } from "./storageService";
import { isValidEmail, validatePassword } from "../utils/validation";
import { formatDate } from "../utils/formatters";

export interface RegisterCitizenInput {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  password: string;
}

export interface RegisterLawyerInput {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  barNumber: string;
  specialty: string;
  state: string;
  password: string;
}

export interface CreateAdminInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export function getAllUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

export function getActiveUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.ACTIVE_USER, null);
}

export function setActiveUser(user: User | null): void {
  if (user) {
    setItem(STORAGE_KEYS.ACTIVE_USER, user);
  } else {
    removeItem(STORAGE_KEYS.ACTIVE_USER);
  }
}

export function hasAdminAccount(): boolean {
  const users = getAllUsers();
  return users.some((u) => u.role === "admin");
}

export async function registerCitizen(input: RegisterCitizenInput): Promise<{ success: boolean; user?: User; error?: string }> {
  const trimmedEmail = input.email.trim().toLowerCase();

  if (!input.fullName.trim()) {
    return { success: false, error: "Full Name is required." };
  }
  if (!isValidEmail(trimmedEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  const passCheck = validatePassword(input.password);
  if (!passCheck.valid) {
    return { success: false, error: passCheck.message };
  }

  const users = getAllUsers();
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: "An account with this email address already exists." };
  }

  const salt = await generateSalt();
  const passwordHash = await hashPassword(input.password, salt);

  const newUser: User = {
    id: generateId(),
    email: trimmedEmail,
    role: "citizen",
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    location: input.location?.trim() || "Lagos",
    passwordHash,
    passwordSalt: salt,
    createdAt: formatDate(),
  };

  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);
  setActiveUser(newUser);

  // Link any pre-existing guest requests submitted with this email to the new user ID
  try {
    const allRequests = getItem<Array<{ id: string; userId: string; email: string }>>(STORAGE_KEYS.REQUESTS, []);
    let updatedAny = false;
    const updatedRequests = allRequests.map((req) => {
      if (req.email && req.email.toLowerCase() === trimmedEmail && (!req.userId || req.userId.startsWith("guest-"))) {
        updatedAny = true;
        return { ...req, userId: newUser.id };
      }
      return req;
    });
    if (updatedAny) {
      setItem(STORAGE_KEYS.REQUESTS, updatedRequests);
    }
  } catch (err) {
    console.error("Error linking guest requests:", err);
  }

  return { success: true, user: newUser };
}

export async function registerLawyer(input: RegisterLawyerInput): Promise<{ success: boolean; user?: User; error?: string }> {
  const trimmedEmail = input.email.trim().toLowerCase();

  if (!input.fullName.trim()) {
    return { success: false, error: "Full Name is required." };
  }
  if (!input.barNumber.trim()) {
    return { success: false, error: "NBA Supreme Court Enrollment Number (SCN) is required." };
  }
  if (!isValidEmail(trimmedEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  const passCheck = validatePassword(input.password);
  if (!passCheck.valid) {
    return { success: false, error: passCheck.message };
  }

  const users = getAllUsers();
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: "An account with this email address already exists." };
  }

  const salt = await generateSalt();
  const passwordHash = await hashPassword(input.password, salt);

  const newLawyer: User = {
    id: generateId(),
    email: trimmedEmail,
    role: "lawyer",
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    location: input.state || "Lagos",
    passwordHash,
    passwordSalt: salt,
    createdAt: formatDate(),
    barNumber: input.barNumber.trim(),
    specialty: input.specialty || "Corporate & Commercial Law",
    state: input.state || "Lagos",
    verificationStatus: "Pending Verification",
    bio: `Legal Advocate specializing in ${input.specialty || "General Law"}. NBA Bar No: ${input.barNumber.trim()}`,
  };

  users.push(newLawyer);
  setItem(STORAGE_KEYS.USERS, users);
  setActiveUser(newLawyer);

  return { success: true, user: newLawyer };
}

export async function createInitialAdmin(input: CreateAdminInput): Promise<{ success: boolean; user?: User; error?: string }> {
  if (hasAdminAccount()) {
    return {
      success: false,
      error: "An administrator account already exists. For security, initial setup can only be run once.",
    };
  }

  const trimmedEmail = input.email.trim().toLowerCase();
  if (!input.fullName.trim()) {
    return { success: false, error: "Administrator Name is required." };
  }
  if (!isValidEmail(trimmedEmail)) {
    return { success: false, error: "Please enter a valid administrator email address." };
  }
  const passCheck = validatePassword(input.password);
  if (!passCheck.valid) {
    return { success: false, error: passCheck.message };
  }

  const salt = await generateSalt();
  const passwordHash = await hashPassword(input.password, salt);

  const adminUser: User = {
    id: generateId(),
    email: trimmedEmail,
    role: "admin",
    fullName: input.fullName.trim(),
    phone: input.phone?.trim() || "+234 800 000 0000",
    location: "National Headquarters",
    passwordHash,
    passwordSalt: salt,
    createdAt: formatDate(),
  };

  const users = getAllUsers();
  users.push(adminUser);
  setItem(STORAGE_KEYS.USERS, users);
  setItem(STORAGE_KEYS.ADMIN_SETUP, true);
  setActiveUser(adminUser);

  return { success: true, user: adminUser };
}

export async function loginUser(
  email: string,
  password: string,
  role?: UserRole
): Promise<{ success: boolean; user?: User; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getAllUsers();

  const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (!user) {
    return { success: false, error: "No account found matching this email address." };
  }

  if (role && user.role !== role) {
    return {
      success: false,
      error: `This account is registered as a ${user.role}, not a ${role}. Please select the ${user.role} tab to log in.`,
    };
  }

  const isMatch = await verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!isMatch) {
    return { success: false, error: "Invalid password. Please check your credentials." };
  }

  setActiveUser(user);
  return { success: true, user };
}

export function logoutUser(): void {
  setActiveUser(null);
}

export function updateUserProfile(
  userId: string,
  updates: Partial<Omit<User, "id" | "passwordHash" | "passwordSalt">>
): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, error: "User account not found." };
  }

  const updatedUser: User = {
    ...users[index],
    ...updates,
  };

  users[index] = updatedUser;
  setItem(STORAGE_KEYS.USERS, users);

  // If active user is the one being updated, refresh session
  const activeUser = getActiveUser();
  if (activeUser && activeUser.id === userId) {
    setActiveUser(updatedUser);
  }

  return { success: true, user: updatedUser };
}

export function updateLawyerStatus(
  lawyerId: string,
  verificationStatus: LawyerVerificationStatus
): { success: boolean; error?: string } {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === lawyerId);
  if (index === -1) {
    return { success: false, error: "Lawyer account not found." };
  }

  users[index] = {
    ...users[index],
    verificationStatus,
  };
  setItem(STORAGE_KEYS.USERS, users);

  const activeUser = getActiveUser();
  if (activeUser && activeUser.id === lawyerId) {
    setActiveUser(users[index]);
  }

  return { success: true };
}
