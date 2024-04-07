"use server"

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";


const client = new DynamoDBClient({
    region: process.env.AWS_REGION!,
    credentials: 
    {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
    , 

});


export async function getProjects() {

    const command = new ScanCommand({
        TableName: "projectsPortfolio",
    });

     
    return client.send(command);
}