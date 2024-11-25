"use client"
import { Card } from "react-bootstrap";
import { Game } from "../lib/steamInterfaces";
import Image from "next/image";
import React from "react";

import styles from "../home.module.css"

interface localGamesProps {
	data: Game[];
}

const timeFormat = (hour: number, minute: number) => {
	const formatNumber = (num: number) => {
		return num >= 1000 ? num.toLocaleString() : num.toString();
	};

	if (hour === 0) {
		return `${formatNumber(minute)} minute${minute !== 1 ? 's' : ''}`;
	} else if (minute === 0) {
		return `${formatNumber(hour)} hour${hour !== 1 ? 's' : ''}`;
	} else {
		return `${formatNumber(hour)} hour${hour !== 1 ? 's' : ''} ${formatNumber(minute)} minute${minute !== 1 ? 's' : ''}`;
	}
}

const SteamCard: React.FC<localGamesProps> = ({ data }) => {

	return (
		<div className={styles.steamContainer}>

			{data && data.map((e) =>
				<Card key={e.appId} style={{ backgroundColor: "#1c1c1c", color: "white" }}>
					<Card.Body className={styles.steamCardContianer}>
						<div className={styles.steamBody}>
							<Card.Title style={{ textAlign: "center" }}>
								<a href={e.storePageUrl} target="_blank">{e.title}</a>
							</Card.Title>
							<div style={{ textAlign: "center", marginBottom: "5px" }}>
								Playtime: {timeFormat(e.playHour, e.playMinutes)}
							</div>
							<div className={styles.gameCard}>
								<Image src={e.flyer} alt="Flyer Not Found" width={150} height={226} />
								<ul className={styles.achievementsList}>
									<li style={{ fontSize: "1.25em" }}><u>Recent Achievements</u></li>
									{e.recentAchievements.length > 0 ? (
										e.recentAchievements.map((a, index) =>
											<li key={`${e.appId}-achievement-${index}`}>
												<div className={styles.achievements}>
													<Image src={a.imgUrl || ""} alt="Pic Not Found" width={50} height={50} />
													<p className={styles.achievementItem}>{a.name}</p>
												</div>
											</li>
										)
									) : (
										<li>No Recent Achievements</li>
									)}
								</ul>
							</div>
						</div>
					</Card.Body>
				</Card>
			)}
		</div>

	)
}

export default SteamCard
