import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a1e40] text-slate-300 border-t border-[#D4AF37]/20 pt-10 sm:pt-14 md:pt-16 pb-8 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 md:mb-12">
          
          {/* Column 1: Brand & Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Logo className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Legal<span className="text-[#D4AF37]">Connect</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed">
              Bridging the gap between citizens and justice. Accessible, transparent, and trusted legal services for everyone.
            </p>
            <div className="text-[10px] sm:text-xs text-[#D4AF37] font-semibold tracking-wider uppercase">
              Integrity • Justice • Accessibility
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase mb-3 sm:mb-4 border-b border-[#D4AF37]/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-a-lawyer" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Find a Verified Lawyer
                </Link>
              </li>
              <li>
                <Link to="/request-service" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Request Legal Assistance
                </Link>
              </li>
              <li>
                <Link to="/legal-help-guide" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Legal Help Guide & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Services */}
          <div>
            <h3 className="text-white text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase mb-3 sm:mb-4 border-b border-[#D4AF37]/30 pb-2">
              Services
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                <Link to="/free-legal-assistance" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Free Legal Aid (Pro Bono)
                </Link>
              </li>
              <li>
                <Link to="/paid-legal-services" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Paid Premium Services
                </Link>
              </li>
              <li>
                <Link to="/anonymous-reporting" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Anonymous Whistleblowing
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[#D4AF37] transition-colors block py-0.5">
                  Join as a Legal Professional
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency / Contact */}
          <div>
            <h3 className="text-white text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase mb-3 sm:mb-4 border-b border-[#D4AF37]/30 pb-2">
              Confidential Help
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-400 mb-3 leading-relaxed">
              Need immediate emergency legal aid or anonymous reporting?
            </p>
            <Link
              to="/anonymous-reporting"
              className="inline-block w-full text-center px-3 py-2.5 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F2B5B] font-semibold text-xs sm:text-sm rounded transition-all tracking-wider uppercase"
            >
              Report Confidentially
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} LegalConnect. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="hover:text-[#D4AF37] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#D4AF37] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#D4AF37] cursor-pointer">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
