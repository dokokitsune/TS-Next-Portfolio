import React from "react";
import styles from "../home.module.css";
import { ProjectCard } from "./projectCard";

import { getProjects } from "../api/aws/database";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export interface projectProps {
	id: number;
	imgUrls: string[];
	Title: string;
	Summary: string;
	Description: string;
	Skills: string[];
}

type projectArray = projectProps[];

export default async function Projects() {

	const projects = await getProjects();

	const projectArray: projectArray = [];

	if (projects.Items) {
		projects.Items.forEach((item) => {


			const unMarshallItem = unmarshall(item)
			const uProject: projectProps = {
				Title: unMarshallItem.title,
				Skills: Array.from(unMarshallItem.skills),
				id: unMarshallItem.id,
				imgUrls: Array.from(unMarshallItem.pictures),
				Summary: unMarshallItem.sum,
				Description: unMarshallItem.desc,


			}
			projectArray.push(uProject)

		})

	}

	return (

		<main className={styles.projectContainer}>
			<ProjectCard data={projectArray} />
		</main>
	);
};
