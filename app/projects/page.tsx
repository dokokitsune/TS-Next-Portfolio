"use client";
import React from "react";
import styles from "../home.module.css";
import { ProjectCard } from "./projectCard";
import AWS from "aws-sdk";
import {
  DynamoDBClient,
  ListTablesCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});
const doClient = DynamoDBDocumentClient.from(client);

export interface tempProps {
  imgUrl: string;
  Title: string;
  Summary: string;
}

export default function Projects() {
  const tempProject: tempProps[] = [
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 1",
      Summary: "Brief Description",
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 2",
      Summary: "Brief Description",
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 3",
      Summary: "Brief Description",
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 4",
      Summary: "Brief Description",
    },
    {
      imgUrl: "/cardTestImg.png",
      Title: "Project Title 5",
      Summary: "Brief Description",
    },
  ];

  const fetchData = async () => {
    const command = new GetCommand({
      TableName: "projectsPortfolio",
      Key: {
        id: 0,
      }
    });
    const response = await doClient.send(command);
    
  };

  fetchData();

  return (
    <main className={styles.projectContainer}>
      <h1 style={{ padding: "50px 0 50px 0" }}>My Projects</h1>
      <ProjectCard data={tempProject} />
    </main>
  );
}
