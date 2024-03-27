"use client";
import React, { useEffect, useState } from "react";
import styles from "../home.module.css";
import { ProjectCard } from "./projectCard";

import {
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";



const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});
const doClient = DynamoDBDocumentClient.from(client);

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
    const command = new ScanCommand({
      TableName: "projectsPortfolio",
    
    })
    const resp= await client.send(command);
    const projectArray: projectArray = [];
    
    if(resp.Items){
      resp.Items.forEach((item) => {
        const uProject : projectProps = {
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
      <h1 style={{ padding: "50px 0 50px 0" }}>My Projects</h1>
      <ProjectCard data={Projects} />
    </main>
  );
}
