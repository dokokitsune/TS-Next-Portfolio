"use client";

import { useState } from "react";
import type { gitResponse } from "../lib/gitInterfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faStar, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "../home.module.css";
import projectsStyles from "./projects.module.css";
import { projectOverviews } from "./projectOverviews";

const pageSize = 6;
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

function websiteUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function commitTime(project: gitResponse): number {
  const timestamp = Date.parse(project.latestCommit?.date ?? "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function RepositoryCard({ project }: { project: gitResponse }) {
  const description = project.description || projectOverviews[project.name];
  const homepage = websiteUrl(project.homepage);
  const commit = project.latestCommit;
  const hasCommitDate = !!commit?.date && Number.isFinite(Date.parse(commit.date));
  const commitUrl = commit?.sha
    ? `${project.html_url}/commit/${encodeURIComponent(commit.sha)}`
    : `${project.html_url}/commits`;

  return (
    <article className={projectsStyles.repositoryCard} aria-labelledby={`repo-${project.id}`}>
      <div className={projectsStyles.cardBody}>
        <div className={styles.gitCardContainer}>
          <h4 id={`repo-${project.id}`} className={styles.activityTitle}>
            <a href={project.html_url} target="_blank" rel="noreferrer">{project.name}</a>
          </h4>
          {(project.archived || project.isFork) && (
            <span className={projectsStyles.repoBadge}>{project.archived ? "Archived" : "Fork"}</span>
          )}
        </div>
        {description && <p className={styles.gitDescription}>{description}</p>}
        {!!project.topics?.length && (
          <ul className={styles.repoTopics} aria-label="Repository topics">
            {project.topics.slice(0, 5).map(topic => <li key={topic}>{topic}</li>)}
          </ul>
        )}
        <ul className={projectsStyles.repoMetadata} aria-label="Repository details">
          {project.language && (
            <li className={styles.gitLang}>
              <span className={styles.langDot} style={{ backgroundColor: project.languageColor ?? undefined }} aria-hidden="true" />
              {project.language}
            </li>
          )}
          {project.stars !== undefined && (
            <li><FontAwesomeIcon icon={faStar} aria-hidden="true" /> {project.stars.toLocaleString("en-US")} {project.stars === 1 ? "star" : "stars"}</li>
          )}
          {project.forks !== undefined && (
            <li><FontAwesomeIcon icon={faCodeBranch} aria-hidden="true" /> {project.forks.toLocaleString("en-US")} {project.forks === 1 ? "fork" : "forks"}</li>
          )}
          {project.license && <li>{project.license}</li>}
        </ul>
        {commit?.message && (
          <div className={projectsStyles.latestCommit}>
            <p className={projectsStyles.commitLabel}>
              {commit.sha && (
                <a
                  href={commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={projectsStyles.commitSha}
                  aria-label={`Commit ${commit.sha.slice(0, 7)}`}
                >
                  {commit.sha.slice(0, 7)}
                </a>
              )}
              <span>Latest commit</span>
              {hasCommitDate && <> · <time dateTime={commit.date}>{dateFormat.format(new Date(commit.date!))}</time></>}
            </p>
            <a href={commitUrl} target="_blank" rel="noreferrer" className={projectsStyles.commitLink}>
              {commit.message}
            </a>
          </div>
        )}
      </div>
      <footer className={projectsStyles.cardFooter}>
        <a href={project.html_url} target="_blank" rel="noreferrer" aria-label={`View ${project.name} code on GitHub`}>
          View code <span aria-hidden="true">↗</span>
        </a>
        {homepage && (
          <a href={homepage} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name} website`}>
            Website <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
          </a>
        )}
        {!commit?.message && <span className={projectsStyles.emptyCommit}>No commits yet</span>}
      </footer>
    </article>
  );
}

export default function GitCard({ data }: { data: gitResponse[] }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const languages = Array.from(new Set(data.flatMap(project => project.language ? [project.language] : []))).sort();
  const search = query.trim().toLowerCase();
  const filteredProjects = data.filter(project => (
    (!language || project.language === language)
    && (!search || [project.name, project.description || projectOverviews[project.name], project.language, ...(project.topics ?? [])]
      .filter(Boolean).join(" ").toLowerCase().includes(search))
  )).sort((a, b) => {
    if (sort === "stars") return (b.stars ?? 0) - (a.stars ?? 0) || a.name.localeCompare(b.name);
    if (sort === "name") return a.name.localeCompare(b.name);
    return commitTime(b) - commitTime(a) || a.name.localeCompare(b.name);
  });
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasFilters = !!query || !!language;

  function resetFilters() {
    setQuery("");
    setLanguage("");
    setVisibleCount(pageSize);
  }

  function showMoreProjects() {
    const nextProject = filteredProjects[visibleCount];
    setVisibleCount(count => count + pageSize);
    // Keep keyboard navigation at the newly revealed cards when the button disappears.
    requestAnimationFrame(() => {
      document.getElementById(`repo-${nextProject.id}`)?.querySelector("a")?.focus();
    });
  }

  return (
    <>
      <form className={projectsStyles.toolbar} role="search" aria-label="Search GitHub projects" onSubmit={event => event.preventDefault()}>
        <div className={projectsStyles.searchField}>
          <label htmlFor="project-search">Search projects</label>
          <input id="project-search" type="search" value={query} placeholder="Name, description, or topic…" onChange={event => { setQuery(event.target.value); setVisibleCount(pageSize); }} />
        </div>
        <div>
          <label htmlFor="project-language">Language</label>
          <select id="project-language" value={language} onChange={event => { setLanguage(event.target.value); setVisibleCount(pageSize); }}>
            <option value="">All languages</option>
            {languages.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="project-sort">Sort by</label>
          <select id="project-sort" value={sort} onChange={event => { setSort(event.target.value); setVisibleCount(pageSize); }}>
            <option value="recent">Latest commit</option>
            <option value="stars">Most stars</option>
            <option value="name">Name</option>
          </select>
        </div>
      </form>
      <div className={projectsStyles.resultsRow}>
        <p role="status" aria-live="polite" aria-atomic="true">
          Showing {visibleProjects.length} of {filteredProjects.length} {filteredProjects.length === 1 ? "repository" : "repositories"}
          {hasFilters && " matching your filters"}
        </p>
        {hasFilters && <button type="button" className={projectsStyles.clearButton} onClick={resetFilters}>Clear filters</button>}
      </div>
      {visibleProjects.length ? (
        <div id="github-repositories" className={styles.gitContainer}>
          {visibleProjects.map(project => <RepositoryCard key={project.id} project={project} />)}
        </div>
      ) : (
        <div className={projectsStyles.emptyState}>
          <h4>No matching projects</h4>
          <p>Try a different search or choose another language.</p>
          <button type="button" className={styles.socialLink} onClick={resetFilters}>Show all projects</button>
        </div>
      )}
      <div className={projectsStyles.browserFooter}>
        {filteredProjects.length > visibleCount && (
          <button type="button" className={styles.socialLink} aria-controls="github-repositories" onClick={showMoreProjects}>
            Show {Math.min(pageSize, filteredProjects.length - visibleCount)} more projects
          </button>
        )}
        <a href="https://github.com/dokokitsune?tab=repositories" target="_blank" rel="noreferrer">
          All repositories on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}
