import styles from "./ui.module.css";

const variantMap = {
  pending: "warning",
  approved: "success",
  flagged: "danger",
  hold: "muted",
};

export default function Badge({ variant = "muted", className = "", children }) {
  const resolvedVariant = variantMap[variant] || variant;
  const classes = [styles.badge, styles[resolvedVariant], className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
