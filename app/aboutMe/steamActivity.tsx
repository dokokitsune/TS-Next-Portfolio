import { getSteamFeed } from "../lib/feeds/cache";
import FeedTimestamp from "../components/feedTimestamp";
import SteamCard from "./steamGames";
import styles from "../home.module.css";

export default async function SteamActivity() {
  const { data: games, updatedAt } = await getSteamFeed();
  return (
    <>
      {games.length ? <SteamCard data={games} /> : (
        <p className={styles.sectionIntro}>No recently played games to show.</p>
      )}
      <FeedTimestamp updatedAt={updatedAt} />
    </>
  );
}
