interface latestCommit {
	sha?: string,
	message?: string,
	date?: string,
    relative_time?: string	
}
export interface gitResponse {
	id: number,
	name: string,
	html_url: string,
	language?: string,
	languageColor?: string,
	latestCommit: latestCommit
}