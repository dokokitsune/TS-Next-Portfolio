"use client";

import { Card } from "react-bootstrap";
import { Game } from "../lib/steamInterfaces";
import Image from "next/image";
import { useState } from "react";
import styles from "../home.module.css";

interface localGamesProps {
  data: Game[];
}

function GameCover({ game }: { game: Game }) {
  const [src, setSrc] = useState(game.flyer);
  return (
    <Image
      src={src}
      className={styles.gameImage}
      alt={`${game.title} cover art`}
      width={150}
      height={226}
      sizes="100px"
      onError={() => {
        if (game.iconUrl && src !== game.iconUrl) setSrc(game.iconUrl);
      }}
    />
  );
}

const timeFormat = (hour: number, minute: number) => {
  const formatNumber = (num: number) => {
    return num >= 1000 ? num.toLocaleString() : num.toString();
  };

  if (hour === 0) {
    return `${formatNumber(minute)} minute${minute !== 1 ? "s" : ""}`;
  } else if (minute === 0) {
    return `${formatNumber(hour)} hour${hour !== 1 ? "s" : ""}`;
  } else {
    return `${formatNumber(hour)} hour${hour !== 1 ? "s" : ""} ${formatNumber(minute)} minute${minute !== 1 ? "s" : ""}`;
  }
};

export default function SteamCard({ data }: localGamesProps) {
  return (
    <div className={styles.steamContainer}>
      {data.map((game) => (
        <Card key={game.appId} className={styles.activityCard}>
          <Card.Body className={styles.steamBody}>
            <h4 className={styles.activityTitle}>
              <a href={game.storePageUrl} target="_blank" rel="noreferrer">
                {game.title} <span aria-hidden="true">↗</span>
              </a>
            </h4>
            <p className={styles.activityMeta}>
              Playtime: {timeFormat(game.playHour, game.playMinutes)}
            </p>
            <div className={styles.gameCard}>
              <GameCover game={game} />
              <ul className={styles.achievementsList}>
                <li className={styles.achievementsHeading}>Recent achievements</li>
                {game.recentAchievements.length > 0 ? (
                  game.recentAchievements.map((achievement, index) => (
                    <li key={`${game.appId}-achievement-${index}`}>
                      <div className={styles.achievements}>
                        {achievement.imgUrl && (
                          <Image src={achievement.imgUrl} alt="" width={32} height={32} unoptimized />
                        )}
                        <p className={styles.achievementItem}>{achievement.name}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No recent achievements</li>
                )}
              </ul>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
