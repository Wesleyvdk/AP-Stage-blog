import { Octokit } from "octokit";
import type { Endpoints } from "@octokit/types"; 
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
type GetRepoResponse =
  Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];
type ListCommitsResponse =
  Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];
type ListLanguagesResponse =
  Endpoints["GET /repos/{owner}/{repo}/languages"]["response"]["data"];
type ListContributorsResponse =
  Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"];
export function extractRepoInfo(githubUrl: string): {
  owner: string;
  repo: string;
} {
  try {
    const url = new URL(githubUrl);
    const pathParts = url.pathname.split("/").filter((part) => part); 
    if (pathParts.length >= 2) {
      return { owner: pathParts[0], repo: pathParts[1].replace(".git", "") };
    }
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
  }
  return { owner: "", repo: "" };
}
export async function getRepository(
  owner: string,
  repo: string,
): Promise<GetRepoResponse> {
  console.log("Fetching repository:", owner, repo);
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return data;
}
export async function getReadme(owner: string, repo: string): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      mediaType: { format: "raw" },
    });
    return data as unknown as string;
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return "README not available.";
  }
}
export async function getCommits(
  owner: string,
  repo: string,
  limit = 5,
): Promise<ListCommitsResponse> {
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: limit,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
    return [];
  }
}
export async function getRepositoryLanguages(
  owner: string,
  repo: string,
): Promise<ListLanguagesResponse> {
  try {
    const { data } = await octokit.rest.repos.listLanguages({ owner, repo });
    return data;
  } catch (error) {
    console.error(`Error fetching languages for ${owner}/${repo}:`, error);
    return {}; 
  }
}
export async function getRepositoryContributors(
  owner: string,
  repo: string,
  limit = 5,
): Promise<ListContributorsResponse> {
  try {
    const { data } = await octokit.rest.repos.listContributors({
      owner,
      repo,
      per_page: limit,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
    return [];
  }
}
