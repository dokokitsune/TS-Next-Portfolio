"use client"
import { Card, Row } from "react-bootstrap";
import { projectProps } from "./page";
import React, { useState } from "react";
import styles from "../home.module.css";
import { ProjectModal } from "./projectModal";

interface localProjectProps {
	data: projectProps[];
}

export interface modalProps {
	show: boolean;
	onHide: () => void;
	data: projectProps;
}

export const ProjectCard: React.FC<localProjectProps> = ({ data }) => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [selected, setSelected] = useState<projectProps>({
		id: 0,
		imgUrls: [],
		Title: "",
		Summary: "",
		Description: "",
		Skills: []
	});
	console.log(selected.imgUrls[0])
	return (
		<main className={styles.cardContainer}>
			<Row md={2} className={styles.rowContainer}>
				{data &&
					data.map((e) => (
						<>
							<Card
								className={styles.cardStyle}
								onClick={() => {
									setSelected(e);
									setOpenModal(true);
								}}
							>
								<Card.Body>
									<Card.Title>{e.Title}</Card.Title>
									<Card.Img style={{border: "solid"}} variant="top" alt="Project Img" src={e.imgUrls[0]}></Card.Img>

									<Card.Text><p style={{ fontSize: 'larger' }} className="mt-4">{e.Summary}</p></Card.Text>
								</Card.Body>
							</Card>
						</>
					))}
				<>
					<ProjectModal
						show={openModal}
						onHide={() => setOpenModal(false)}
						data={selected}

					/>
				</>
			</Row>
		</main>
	);
};
