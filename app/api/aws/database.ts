"use server";

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export async function getProjects() {
  const command = new ScanCommand({
    TableName: "projectsPortfolio",
  });

  return client.send(command);
}
