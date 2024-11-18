import React from 'react'
import AboutMeClient from './aboutMeClient'

interface apiData {
	data: []
}



export default async function AboutMePage() {



	const [gamesRes, projectsRes] = await Promise.all([
		fetch('https://api.wwoodportfolio.com/games', { cache: "no-store" }),
		fetch('https://api.wwoodportfolio.com/projects', { cache: "no-store" })
	])

	const [steamGames, gitProjects]: apiData[] = await Promise.all([
		gamesRes.json(),
		projectsRes.json()

	])
	return (<>
		<AboutMeClient initialGames={steamGames.data} initialProjects={gitProjects.data} />

	</>)
}

