import GitCard from "./gitProjects";
import { getGitHubFeed } from "../lib/feeds/cache";
import FeedTimestamp from "../components/feedTimestamp";
import styles from "../home.module.css";

export default async function GitHubActivity() {
  const { data: projects, updatedAt } = await getGitHubFeed();

  if (projects.length === 0) {
    return <p className={styles.pageIntro}>No recent activity to show.</p>;
  }

  return (
    <>
      <GitCard data={projects} />
      <FeedTimestamp updatedAt={updatedAt} />
    </>
  );
}
