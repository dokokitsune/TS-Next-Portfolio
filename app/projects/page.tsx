"use client";
import React, { useEffect, useState } from "react";
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

export default function Projects() {

	const [Projects, setProjects] = useState<projectArray>([]);
	useEffect(() => {
		const fetchData = async () => {
			const projects = await getProjects();

			const projectArray: projectArray = [];

			if (projects.Items) {
				projects.Items.forEach((item) => {
					const uProject: projectProps = {
						id: 0,
						imgUrls: [],
						Title: "",
						Summary: "",
						Description: "",
						Skills: []
					};

					const unMarshallItem = unmarshall(item)
					uProject["Title"] = unMarshallItem.title;
					uProject["Skills"] = Array.from(unMarshallItem.skills)
					uProject["id"] = unMarshallItem.id;
					uProject["imgUrls"] = Array.from(unMarshallItem.pictures);
					uProject["Summary"] = unMarshallItem.sum;
					uProject["Description"] = unMarshallItem.desc;
					projectArray.push(uProject);


				})

			}


			setProjects(projectArray);





		};

		fetchData();
	}, [])



	return (
		<main className={styles.projectContainer}>
			<h1 style={{ padding: "25px 0 25px 0" }}>My Projects</h1>
			<ProjectCard data={Projects} />
		</main>
	);
}
