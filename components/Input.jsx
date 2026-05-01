import styles from "./ui.module.css";

export default function Input({ label, className = "", ...props }) {
  return (
    <label className={`${styles.field} ${className}`.trim()}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input className={styles.input} {...props} />
    </label>
  );
}
