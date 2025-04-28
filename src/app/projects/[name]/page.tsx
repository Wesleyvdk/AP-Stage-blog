import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Star,
  GitFork,
  Clock,
  Users,
  Code,
} from "lucide-react";
import { ProjectPreview } from "@/components/project-preview";
import linksData from "@/lib/links.json";
import type { Endpoints } from "@octokit/types";
import {
  getReadme,
  getRepository,
  getCommits,
  getRepositoryLanguages,
  getRepositoryContributors,
  extractRepoInfo,
} from "@/lib/github-service";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// Define types based on our JSON structure
interface ProjectData {
  github: string;
  demo: string;
  category: string;
  featured: boolean;
  technologies: string[];
}

interface ProjectsData {
  [key: string]: ProjectData;
}

// Define types for GitHub data used in this component
type LanguageData =
  Endpoints["GET /repos/{owner}/{repo}/languages"]["response"]["data"];
type ContributorData =
  Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"][number]; // Type for a single contributor
type CommitData =
  Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][number]; // Type for a single commit

export default async function ProjectDetailPage({
  params,
}: {
  params: { name: string };
}) {
  const { name } = await params;
  const projects = linksData.projects as ProjectsData;
  const projectData = projects[name];

  // If project doesn't exist in our data, return 404
  if (!projectData) {
    notFound();
  }

  // Extract owner and repo from GitHub URL
  const { owner, repo } = extractRepoInfo(projectData.github);

  // Fetch repository data, README, commits, languages, and contributors from GitHub
  const [repository, readme, commits, languages, contributors] =
    await Promise.all([
      getRepository(owner, repo),
      getReadme(owner, repo),
      getCommits(owner, repo, 5),
      getRepositoryLanguages(owner, repo),
      getRepositoryContributors(owner, repo, 5),
    ]);

  // Format dates
  const createdAt = new Date(repository.created_at).toLocaleDateString();
  const updatedAt = new Date(repository.updated_at).toLocaleDateString();

  // Calculate language percentages (ensure languages is treated as an object)
  const languageEntries = Object.entries(languages || {});
  const totalBytes = languageEntries.reduce((sum, [, bytes]) => sum + bytes, 0);
  const languagePercentages =
    totalBytes > 0
      ? languageEntries.map(([langName, bytes]) => ({
          name: langName,
          percentage: Math.round((bytes / totalBytes) * 100),
        }))
      : [];

  return (
    <div className="container py-12 space-y-8">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all projects
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{name}</h1>
            <div className="text-xl text-muted-foreground">
              <MarkdownRenderer content={repository.description ?? ""} />
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden">
            <ProjectPreview
              url={projectData.demo}
              title={name}
              aspectRatio="video"
              size="large"
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {projectData.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link
                href={projectData.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href={projectData.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>README</h2>
            <MarkdownRenderer content={readme} />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Repository Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{updatedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Primary Language</span>
                <span>{repository.language}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stars</span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {repository.stargazers_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Forks</span>
                <span className="flex items-center">
                  <GitFork className="h-4 w-4 mr-1" />
                  {repository.forks_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Open Issues</span>
                <span>{repository.open_issues_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge>{projectData.category}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {languagePercentages.map(({ name, percentage }) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contributors.map((contributor: ContributorData) => (
                  <Link
                    key={contributor.id}
                    href={contributor.html_url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors"
                  >
                    <Image
                      src={contributor.avatar_url ?? "/placeholder.svg"}
                      alt={contributor.login ?? "Contributor"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {contributor.login ?? "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contributor.contributions} commits
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Commits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {commits.map((commit: CommitData) => (
                <div
                  key={commit.sha}
                  className="border-b pb-3 last:border-0 last:pb-0"
                >
                  <Link
                    href={commit.html_url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary"
                  >
                    {commit.commit.message.split("\n")[0]}
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {commit.commit.author?.date && (
                      <time dateTime={commit.commit.author.date}>
                        {new Date(
                          commit.commit.author.date
                        ).toLocaleDateString()}
                      </time>
                    )}
                    {commit.commit.author?.name && (
                      <>
                        <span className="mx-1">by</span>
                        <span>{commit.commit.author.name}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
