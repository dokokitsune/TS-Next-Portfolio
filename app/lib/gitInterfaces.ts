interface LatestCommit {
  sha?: string;
  message?: string;
  date?: string;
}

export interface gitResponse {
  id: string;
  name: string;
  html_url: string;
  description?: string | null;
  topics?: string[];
  homepage?: string | null;
  language?: string | null;
  languageColor?: string | null;
  stars?: number;
  forks?: number;
  license?: string | null;
  archived?: boolean;
  isFork?: boolean;
  latestCommit?: LatestCommit | null;
}
