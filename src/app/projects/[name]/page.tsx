import Link from "next/link";
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
  Lock,
} from "lucide-react";
import { ProjectPreview } from "@/components/project-preview";
import linksData from "@/lib/links.json";
import {
  getReadme,
  getRepository,
  getCommits,
  getRepositoryLanguages,
  getRepositoryContributors,
  extractRepoInfo,
} from "@/lib/github-service";

interface ProjectData {
  github: string;
  demo: string | null;
  category: string;
  featured: boolean;
  technologies: string[];
  isPrivate?: boolean;
  projectType?: string;
}

interface ProjectsData {
  [key: string]: ProjectData;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const projects = linksData.projects as ProjectsData;
  const projectData = projects[name];

  if (!projectData) {
    notFound();
  }

  const { owner, repo } = extractRepoInfo(projectData.github);

  let repository: any = {
    description: "No description available.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    language: "Unknown",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
  };
  let readme = "No README available.";
  let commits: any[] = [];
  let languages: Record<string, number> = {};
  let contributors: any[] = [];

  try {
    [repository, readme, commits, languages, contributors] = await Promise.all([
      getRepository(owner, repo),
      getReadme(owner, repo),
      getCommits(owner, repo, 5),
      getRepositoryLanguages(owner, repo),
      getRepositoryContributors(owner, repo, 5),
    ]);
  } catch (error) {
    console.error(`Error fetching repository data for ${name}:`, error);
  }

  const createdAt = new Date(repository.created_at).toLocaleDateString();
  const updatedAt = new Date(repository.updated_at).toLocaleDateString();

  const totalBytes = Object.values(languages).reduce(
    (sum, bytes) => sum + bytes,
    0,
  );
  const languagePercentages = Object.entries(languages).map(
    ([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 100),
    }),
  );

  return (
    <div className="container py-8 md:py-12 space-y-6 md:space-y-8">
      <Button variant="ghost" asChild className="mb-4 md:mb-8">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all projects
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 md:mb-4">
              {name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {repository.description}
            </p>
            {projectData.isPrivate && (
              <Badge
                variant="outline"
                className="bg-indigo-100 text-indigo-600 mt-4 flex items-center w-fit gap-1"
              >
                <Lock className="h-3 w-3" />
                Private Repository
              </Badge>
            )}
          </div>

          <div className="relative rounded-lg overflow-hidden">
            <ProjectPreview
              url={projectData.demo}
              title={name}
              aspectRatio="video"
              size="large"
              className="w-full"
              projectType={projectData.projectType}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {projectData.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-indigo-100 text-indigo-600 text-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {projectData.demo && (
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
            )}
            {!projectData.isPrivate && (
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
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
            <h2>README</h2>
            <div dangerouslySetInnerHTML={{ __html: readme }} />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Repository Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
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
              {!projectData.isPrivate && (
                <>
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
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge
                  variant="outline"
                  className="bg-indigo-100 text-indigo-600"
                >
                  {projectData.category}
                </Badge>
              </div>
              {projectData.projectType && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge
                    variant="outline"
                    className="bg-indigo-100 text-indigo-600"
                  >
                    {projectData.projectType}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {languagePercentages.length > 0 && (
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
          )}

          {contributors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contributors.map((contributor: any) => (
                    <Link
                      key={contributor.id}
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors"
                    >
                      <img
                        src={contributor.avatar_url || "/placeholder.svg"}
                        alt={contributor.login}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {contributor.login}
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
          )}

          {commits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Commits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {commits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
                    <Link
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary line-clamp-2"
                    >
                      {commit.commit.message.split("\n")[0]}
                    </Link>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <time dateTime={commit.commit.author.date}>
                        {new Date(
                          commit.commit.author.date,
                        ).toLocaleDateString()}
                      </time>
                      <span className="mx-1">by</span>
                      <span>{commit.commit.author.name}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
