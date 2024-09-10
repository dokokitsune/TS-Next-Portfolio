import React from 'react'
import { Game, recentPlayedGames } from "../api/steam/steamAPI"
import AboutMeClient from './aboutMeClient'
import fetchGitData from '../api/git/gitAPI'

type Games = Game[]


export const revalidate = 3600

async function getGames(): Promise<Games> {
	return await recentPlayedGames()
}

async function getProjects() {
	return await fetchGitData()
}

export default async function AboutMePage() {
	const steamGames = await getGames()
	const gitProjects = await getProjects()
	return (<>
		<AboutMeClient initialGames={steamGames} initialProjects={gitProjects} />

	</>)
}

