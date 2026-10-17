import styles from "./layout.module.css";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageTransition}>{children}</div>
  );
}
