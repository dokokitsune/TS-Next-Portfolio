import styles from "../home.module.css";

export default function FeedTimestamp({ updatedAt }: { updatedAt: string }) {
  const date = new Date(updatedAt);
  if (!Number.isFinite(date.getTime())) return null;

  return (
    <p className={styles.feedTimestamp}>
      Updated{" "}
      <time dateTime={updatedAt}>
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "UTC",
        }).format(date)} UTC
      </time>
    </p>
  );
}
