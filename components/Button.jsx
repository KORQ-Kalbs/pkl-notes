import styles from "./ui.module.css";

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} type={type} {...props} />;
}
