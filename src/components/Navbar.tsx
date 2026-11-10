import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-1.5 xl:px-3 py-2 text-xs xl:text-base font-medium transition-colors duration-200 whitespace-nowrap ${
      isActive
        ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
        : "text-slate-200 hover:text-[#D4AF37]"
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2.5 text-sm sm:text-base font-medium rounded-md transition-colors ${
      isActive
        ? "bg-[#163a75] text-[#D4AF37]"
        : "text-slate-200 hover:bg-[#163a75] hover:text-[#D4AF37]"
    }`;

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "citizen") return "/user-dashboard";
    if (user.role === "lawyer") return "/lawyer-dashboard";
    if (user.role === "admin") return "/admin-dashboard";
    return "/user-dashboard";
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";
    if (user.role === "citizen") return "Citizen Portal";
    if (user.role === "lawyer") return "Advocate Portal";
    if (user.role === "admin") return "Admin Control";
    return "Dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0F2B5B] shadow-lg border-b border-[#D4AF37]/20 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 sm:gap-3 focus:outline-none shrink-0"
          >
            <Logo className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0" />
            <div className="flex flex-col shrink-0">
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                Legal<span className="text-[#D4AF37]">Connect</span>
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-widest text-slate-300 uppercase -mt-0.5 sm:-mt-1 hidden min-[260px]:block whitespace-nowrap">
                Law & Justice
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (>= 1024px) */}
          <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-2">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/free-legal-assistance" className={navLinkClasses}>
              Free Legal Help
            </NavLink>
            <NavLink to="/paid-legal-services" className={navLinkClasses}>
              Paid Services
            </NavLink>
            <NavLink to="/find-a-lawyer" className={navLinkClasses}>
              Find a Lawyer
            </NavLink>
            <NavLink to="/anonymous-reporting" className={navLinkClasses}>
              Anonymous Report
            </NavLink>
            <NavLink to="/legal-help-guide" className={navLinkClasses}>
              Legal Guide
            </NavLink>
          </div>

          {/* Desktop CTA Buttons & Dashboard Link (>= 1024px) */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <NavLink
                  to={getDashboardPath()}
                  className={({ isActive }) =>
                    `text-xs xl:text-sm font-semibold px-2.5 py-1.5 rounded transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-[#D4AF37] text-[#0F2B5B]"
                        : "text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-[#0F2B5B]"
                    }`
                  }
                >
                  {getDashboardLabel()}
                </NavLink>

                <span className="text-xs text-slate-300 max-w-[120px] truncate" title={user.fullName}>
                  {user.fullName.split(" ")[0]}
                </span>

                <button
                  onClick={handleLogout}
                  className="text-xs text-red-300 hover:text-red-100 hover:underline px-1.5 py-1"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs xl:text-base font-medium text-slate-200 hover:text-white transition-colors px-1.5 py-1 whitespace-nowrap"
              >
                Log In
              </Link>
            )}

            <button
              onClick={() => navigate("/request-service")}
              className="px-3 py-1.5 xl:px-4 xl:py-2 text-xs xl:text-sm font-semibold text-[#0F2B5B] bg-[#D4AF37] hover:bg-[#e0be4d] rounded-md transition-all duration-200 shadow-md active:scale-95 whitespace-nowrap"
            >
              Get Legal Help
            </button>
          </div>

          {/* Mobile Hamburger Button (< 1024px) */}
          <div className="flex lg:hidden shrink-0">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-1.5 sm:p-2 rounded-md text-slate-200 hover:text-[#D4AF37] hover:bg-[#163a75] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (< 1024px) */}
      {isOpen && (
        <div className="lg:hidden bg-[#0a1e40] border-b border-[#D4AF37]/20 px-3 sm:px-6 pt-3 pb-6 space-y-1 sm:space-y-2">
          {isAuthenticated && user && (
            <div className="p-3 mb-2 bg-[#163a75] rounded-md border border-[#D4AF37]/30 flex items-center justify-between">
              <div className="text-xs text-white">
                <span className="text-[10px] uppercase text-[#D4AF37] block font-semibold">{user.role}</span>
                <span className="font-bold">{user.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-300 hover:text-white px-2 py-1 bg-red-600/30 rounded"
              >
                Log Out
              </button>
            </div>
          )}

          <NavLink to="/" onClick={closeMenu} className={mobileNavLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/free-legal-assistance" onClick={closeMenu} className={mobileNavLinkClasses}>
            Free Legal Help
          </NavLink>
          <NavLink to="/paid-legal-services" onClick={closeMenu} className={mobileNavLinkClasses}>
            Paid Services
          </NavLink>
          <NavLink to="/find-a-lawyer" onClick={closeMenu} className={mobileNavLinkClasses}>
            Find a Lawyer
          </NavLink>
          <NavLink to="/anonymous-reporting" onClick={closeMenu} className={mobileNavLinkClasses}>
            Anonymous Report
          </NavLink>
          <NavLink to="/legal-help-guide" onClick={closeMenu} className={mobileNavLinkClasses}>
            Legal Guide
          </NavLink>

          {isAuthenticated ? (
            <NavLink to={getDashboardPath()} onClick={closeMenu} className={mobileNavLinkClasses}>
              📌 {getDashboardLabel()}
            </NavLink>
          ) : (
            <NavLink to="/login" onClick={closeMenu} className={mobileNavLinkClasses}>
              🔑 Citizen / Lawyer Portal
            </NavLink>
          )}

          <div className="pt-4 border-t border-slate-700/80 flex flex-col gap-2 sm:gap-3">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-center py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white border border-slate-600 rounded"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="text-center py-2 text-xs sm:text-sm font-semibold text-[#0F2B5B] bg-white hover:bg-slate-100 rounded"
                >
                  Register
                </Link>
              </div>
            ) : null}

            <button
              onClick={() => {
                closeMenu();
                navigate("/request-service");
              }}
              className="w-full py-2.5 text-center text-sm sm:text-base font-semibold text-[#0F2B5B] bg-[#D4AF37] hover:bg-[#e0be4d] rounded-md transition-all shadow-md"
            >
              Get Legal Help
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
