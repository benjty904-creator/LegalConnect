import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "font-bold rounded transition-all duration-200 inline-flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs sm:text-sm",
    lg: "px-6 py-3 text-sm sm:text-base",
  }[size];

  const variantClasses = {
    primary: "bg-[#0F2B5B] hover:bg-[#163a75] text-[#D4AF37] shadow-sm",
    secondary: "bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0F2B5B] shadow-sm",
    outline: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

