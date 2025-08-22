interface props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}
function Button(props: props) {
  return (
    <button
      className={`min-w-full font-medium bg-[#FA506D] rounded-2xl text-white text-xl p-3 ${props.className}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;
