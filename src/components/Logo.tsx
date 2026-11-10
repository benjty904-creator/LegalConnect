import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="46" fill="#0F2B5B" stroke="#D4AF37" strokeWidth="4" />
      <path d="M50 20 L50 72" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="20" r="4" fill="#D4AF37" />
      <path d="M26 32 L74 32" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 32 L16 48 M26 32 L36 48" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M14 48 Q26 56 38 48 Z" fill="#D4AF37" />
      <path d="M74 32 L64 48 M74 32 L84 48" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M62 48 Q74 56 86 48 Z" fill="#D4AF37" />
      <path d="M36 74 L64 74" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;