interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "gradient";
  size?: "sm" | "md" | "lg";
}

function Button({
  children,
  className = "",
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105";
      case "secondary":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200";
      case "outline":
        return "bg-transparent text-indigo-600 border-2 border-indigo-500 hover:bg-indigo-50";
      default:
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <button
      className={`
        flex items-center justify-center font-semibold rounded-2xl 
        transition-all duration-300 
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
