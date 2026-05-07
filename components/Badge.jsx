const variantMap = {
  pending: "warning",
  approved: "success",
  flagged: "danger",
  hold: "muted",
};

const badgeVariants = {
  success: "bg-success/15 text-success border-success/35",
  warning: "bg-warning/15 text-warning border-warning/35",
  danger: "bg-danger/15 text-danger border-danger/35",
  muted: "bg-white/5 text-text-secondary border-border-color",
};

export default function Badge({ variant = "muted", className = "", children }) {
  const resolvedVariant = variantMap[variant] || variant;
  const classes =
    `inline-flex items-center px-2 py-1 rounded-full text-xs border capitalize ${badgeVariants[resolvedVariant]} ${className}`.trim();

  return <span className={classes}>{children}</span>;
}
