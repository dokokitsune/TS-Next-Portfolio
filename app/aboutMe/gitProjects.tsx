import React from "react"
import { gitResponse } from "../api/git/gitAPI"
import { Card, Row } from "react-bootstrap"
import styles from "../home.module.css"

interface localProjectProps {
	data: gitResponse[]
}

const GitCard: React.FC<localProjectProps> = ({ data }) => {
	return (
		<div className={styles.gitContainer} >
			{data && data.map((e) =>
				<>
					<Card style={{ backgroundColor: "#1c1c1c", color: "white", border: "1" }}>
						<Card.Body className={styles.gitBody}>
							<div className={styles.gitCardContainer}>
								<div>
									<p style={{ margin: 0 }}><a href={e.html_url} target="_blank">{e.name}</a></p>
								</div>
								<div className={styles.gitLang}>
									<span className={styles.langDot} style={{ backgroundColor: `${e.languageColor}` }}></span>
									<p className={styles.langText}>{e.language}</p>
								</div>
							</div>
							<p className={styles.gitCommitMessage}>"{e.latestCommit.message}"</p>
						</Card.Body>
						<Card.Footer className={styles.gitFooter}>Last Commit: {e.latestCommit.date}</Card.Footer>

					</Card>

				</>)}

		</div>
	)

}

export default GitCard
