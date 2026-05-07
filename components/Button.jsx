export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg";

  const variantClasses = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    outline:
      "bg-transparent border border-border-color text-text-primary hover:bg-white/5",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-7 py-4",
  };

  const classes =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return <button className={classes} type={type} {...props} />;
}
