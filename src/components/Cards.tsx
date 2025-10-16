interface props {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "gradient" | "glass" | "bordered";
}

function Cards({ className = "", children, variant = "default" }: props) {
  const getVariantStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-500/10";
      case "glass":
        return "bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl";
      case "bordered":
        return "bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300";
      default:
        return "bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100";
    }
  };

  return (
    <article
      className={`
        ${getVariantStyles()}
        min-h-[10rem] 
        h-auto 
        rounded-2xl 
        p-6 
        transition-all 
        duration-300 
        ${className}
      `}
    >
      {children}
    </article>
  );
}

export default Cards;
