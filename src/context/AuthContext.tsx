import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "../types";
import {
  getActiveUser,
  loginUser,
  logoutUser,
  registerCitizen,
  registerLawyer,
  createInitialAdmin,
  updateUserProfile,
  RegisterCitizenInput,
  RegisterLawyerInput,
  CreateAdminInput,
} from "../services/authService";
import { STORAGE_KEYS } from "../services/storageService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLawyer: boolean;
  isCitizen: boolean;
  loading: boolean;
  login: (email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  registerAsCitizen: (input: RegisterCitizenInput) => Promise<{ success: boolean; error?: string }>;
  registerAsLawyer: (input: RegisterLawyerInput) => Promise<{ success: boolean; error?: string }>;
  createAdminAccount: (input: CreateAdminInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, "id" | "passwordHash" | "passwordSalt">>) => {
    success: boolean;
    error?: string;
  };
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getActiveUser());
  const [loading, setLoading] = useState<boolean>(false);

  const refreshUser = useCallback(() => {
    const current = getActiveUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refreshUser();
    setLoading(false);

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: unknown }>;
      if (!customEvent.detail || customEvent.detail.key === STORAGE_KEYS.ACTIVE_USER) {
        refreshUser();
      }
    };

    window.addEventListener("lc_storage_change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("lc_storage_change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshUser]);

  const handleLogin = async (
    email: string,
    pass: string,
    role?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await loginUser(email, pass, role);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleRegisterCitizen = async (
    input: RegisterCitizenInput
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await registerCitizen(input);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleRegisterLawyer = async (
    input: RegisterLawyerInput
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await registerLawyer(input);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleCreateAdmin = async (
    input: CreateAdminInput
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await createInitialAdmin(input);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const handleUpdateProfile = (
    updates: Partial<Omit<User, "id" | "passwordHash" | "passwordSalt">>
  ): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: "Not authenticated" };
    const res = updateUserProfile(user.id, updates);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLawyer: user?.role === "lawyer",
    isCitizen: user?.role === "citizen",
    loading,
    login: handleLogin,
    registerAsCitizen: handleRegisterCitizen,
    registerAsLawyer: handleRegisterLawyer,
    createAdminAccount: handleCreateAdmin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

