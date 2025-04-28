// lib/githubService.ts
import { Octokit } from "octokit";
import type { Endpoints } from "@octokit/types"; // Import types for responses

// Initialize Octokit with PAT from environment
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Type definitions for expected response structures
type GetRepoResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];
type ListCommitsResponse = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];
type ListLanguagesResponse = Endpoints["GET /repos/{owner}/{repo}/languages"]["response"]["data"];
type ListContributorsResponse = Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"];

/**
 * Extracts the owner and repository name from a GitHub URL.
 */
export function extractRepoInfo(githubUrl: string): { owner: string; repo: string } {
  try {
    const url = new URL(githubUrl);
    const pathParts = url.pathname.split('/').filter(part => part); // Filter out empty strings
    if (pathParts.length >= 2) {
      return { owner: pathParts[0], repo: pathParts[1].replace('.git', '') };
    }
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
  }
  // Return default or throw error if parsing fails
  return { owner: '', repo: '' };
}

/**
 * Fetch basic repository details (name, description, stars, timestamps, etc.)
 */
export async function getRepository(owner: string, repo: string): Promise<GetRepoResponse> {
  console.log("Fetching repository:", owner, repo);
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return data;
}

/**
 * Fetch the README content of a repository (as plain text).
 */
export async function getReadme(owner: string, repo: string): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      mediaType: { format: "raw" }
    });
    return data as unknown as string;
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return "README not available.";
  }
}

/**
 * Fetch recent commits for a repository (e.g., last 5 commits from default branch).
 */
export async function getCommits(owner: string, repo: string, limit = 5): Promise<ListCommitsResponse> {
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: limit
    });
    return data;
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
    return [];
  }
}

/**
 * Fetch repository languages.
 */
export async function getRepositoryLanguages(owner: string, repo: string): Promise<ListLanguagesResponse> {
  try {
    const { data } = await octokit.rest.repos.listLanguages({ owner, repo });
    return data;
  } catch (error) {
    console.error(`Error fetching languages for ${owner}/${repo}:`, error);
    return {}; // Return empty object on error
  }
}

/**
 * Fetch repository contributors.
 */
export async function getRepositoryContributors(owner: string, repo: string, limit = 5): Promise<ListContributorsResponse> {
  try {
    const { data } = await octokit.rest.repos.listContributors({
      owner,
      repo,
      per_page: limit
    });
    return data;
  } catch (error) {
    console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
    return [];
  }
}
