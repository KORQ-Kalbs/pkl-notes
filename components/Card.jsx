import styles from "./ui.module.css";

export default function Card({ className = "", ...props }) {
  return <div className={`${styles.card} ${className}`.trim()} {...props} />;
}
