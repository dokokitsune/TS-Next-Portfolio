"use client"
import { Card, Row } from "react-bootstrap";
import { Game } from "../api/steam/steamAPI";
import Image from "next/image";
import React from "react";

import styles from "../home.module.css"

interface localGamesProps {
	data: Game[];
}
//TODO
//Make it so that it adds a comma to hours if above 3 digits
const timeFormat = (hour: number, minute: number) => {
	if (hour === 0) {
		return `${minute} minute${minute !== 1 ? 's' : ''}`
	}
	else if (minute === 0) {
		return `${hour} hour${hour !== 1 ? 's' : ''}`
	}
	else return `${hour} hour${hour !== 1 ? 's' : ''} ${minute} minute${minute !== 1 ? 's' : ''}`
}
//TODO 
//Some times achievements duplicate and overflow
const SteamCard: React.FC<localGamesProps> = ({ data }) => {

	return (
		<div className={styles.steamContainer}>
			{data && data.map((e) =>
				<>
					<Card style={{ backgroundColor: "#1c1c1c", color: "white" }}>
						<Card.Body className={styles.steamCardContianer}  >
							<div className={styles.steamBody}>
								<Card.Title style={{ textAlign: "center" }}><a href={e.storePageUrl} target="_blank">{e.title}</a></Card.Title>
								<div style={{ textAlign: "center", marginBottom: "5px" }}>Playtime: {timeFormat(e.playHour, e.playMinutes)}</div>
								<div className={styles.gameCard}>
									<Image src={e.flyer} alt="Flyer Not Found" width={150} height={226} />

									<ul className={styles.achievementsList}>
										<li style={{ fontSize: "1.25em" }}><u>Recent Achivements</u></li>
										{e.recentAchevements.map((a) =>
											<li key={e.appId}>
												<div className={styles.achievements}>
													<Image src={a.imgUrl} alt="Pic Not Found" width={50} height={50} />
													<p className={styles.achievementItem}>{a.name}</p>
												</div>

											</li>
										)}


									</ul>

								</div>

							</div>

						</Card.Body>
					</Card>


				</>)}
		</div>

	)
}

export default SteamCard