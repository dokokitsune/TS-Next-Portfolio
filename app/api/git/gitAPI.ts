import gitColors from './gitColors.json'

import { Octokit } from "@octokit/rest"

type colorMapping = { [key: string]: string }
const langColors: colorMapping = gitColors
const octokit = new Octokit({
	auth: process.env.GIT_TOKEN

})

//TODO
//return repositories not owned by me but committed to as well as owned repositories
//
interface latestCommit {
	sha?: string,
	message?: string,
	date?: string,
}

export interface gitResponse {
	id: number,
	name: string,
	html_url: string,
	language?: string,
	languageColor?: string,
	latestCommit: latestCommit
}

function getColorLang(lang: string): string | undefined {
	return langColors[lang]
}

function getShortMessage(fullMessage: string): string {
	const parts = fullMessage.split('\n')
	return parts.length > 1 ? parts.slice(1).join('\n').trim() : '';
}

function getTimeAgo(commitDate: string) {
	const present = new Date(Date.now())
	const pastDate = new Date(commitDate)

	const diffMs = Math.abs(present.getTime() - pastDate.getTime())


	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

	if (days > 0) {
		return `${days} day${days > 1 ? 's' : ''} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else if (minutes > 0) {
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	} else {
		return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
	}
}


export default async function fetchGitData() {
	const gitProjectFetch = await octokit.request('GET /users/{username}/repos', {
		username: 'dokokitsune',
		sort: "updated",
		headers: { 'X-GitHub-Api-Version': '2022-11-28' }
	})

	const gitCommits = async (repoName: string) => {
		return await octokit.request('GET /repos/{owner}/{repo}/commits', {
			owner: 'dokokitsune',
			repo: repoName,
			headers: { 'X-GitHub-Api-Version': '2022-11-28' }


		})
	}


	const projectList = gitProjectFetch.data;

	type gitData = gitResponse[]

	const data: gitData = []



	for (const repos of projectList) {
		if (data.length > 5)
			break
		let commitList
		try {
			commitList = await gitCommits(repos.name)
		}
		catch (err: any) {
			if (err.status === 409 && err.message.includes("Git Repository is empty")) {
				console.log(`Skipping empty repository: ${repos.name}`);
				continue;
			}
			// If it's a different error, you might want to handle it differently
			console.error(`Error fetching commits for ${repos.name}:`, err);
			continue;
		}
		const commitData = commitList.data.at(0)
		const commitDate: any = commitData?.commit.committer?.date

		const fullMessage: string = commitData?.commit.message
		let shortedMessage
		if (fullMessage.includes('\n')) {
			shortedMessage = getShortMessage(fullMessage)
		}
		else {
			shortedMessage = fullMessage

		}
		const commitEntry: latestCommit = {
			sha: commitData?.sha,
			message: shortedMessage,
			date: getTimeAgo(commitDate)
		}




		const gitEntry: gitResponse = {
			id: repos.id,
			name: repos.name,
			html_url: repos.html_url,
			language: repos.language,
			languageColor: getColorLang(repos.language),
			latestCommit: commitEntry
		}

		data.push(gitEntry)
	}

	return data


}
