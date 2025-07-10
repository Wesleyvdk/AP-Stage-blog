import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import { ProjectPreview } from "@/components/project-preview";
import linksData from "@/lib/links.json";
import { getRepository, extractRepoInfo } from "@/lib/github-service";
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
async function ProjectCard({
  name,
  data,
}: {
  name: string;
  data: ProjectData;
}) {
  const { owner, repo } = extractRepoInfo(data.github);
  let repository: any = { description: "No description available." };
  try {
    repository = await getRepository(owner, repo);
  } catch (error) {
    console.error(`Error fetching repository for ${name}:`, error);
  }
  return (
    <Card
      key={name}
      className={data.featured ? "overflow-hidden" : "flex flex-col h-full"}
    >
      {data.featured ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden">
            <ProjectPreview
              url={data.demo}
              title={name}
              aspectRatio="video"
              size="large"
              projectType={data.projectType}
            />
          </div>
          <div className="flex flex-col p-4 sm:p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl sm:text-2xl">{name}</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-4 flex-grow">
              <p className="text-muted-foreground text-sm md:text-base">
                {repository.description || "No description available."}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {data.technologies.map((tech) => (
                  <Badge key={tech} className="bg-indigo-100 text-indigo-600">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                {!data.isPrivate && (
                  <>
                    <div>â­ {repository.stargazers_count || 0}</div>
                    <div>ðŸ´ {repository.forks_count || 0}</div>
                  </>
                )}
                <div>
                  Updated:{" "}
                  {repository.updated_at
                    ? new Date(repository.updated_at).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-0 pb-0 flex flex-wrap gap-4">
              {!data.isPrivate && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="sm:size-md"
                >
                  <Link
                    href={data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </Link>
                </Button>
              )}
              {data.demo && (
                <Button asChild size="sm" className="sm:size-md">
                  <Link
                    href={data.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button
                asChild
                className="bg-indigo-600 text-white hover:bg-indigo-700 size-sm sm:size-md"
              >
                <Link href={`/projects/${name}`}>Details</Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <ProjectPreview
              url={data.demo}
              title={name}
              aspectRatio="video"
              size="small"
              projectType={data.projectType}
            />
          </div>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground text-sm">
              {repository.description || "No description available."}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.technologies.map((tech) => (
                <Badge
                  key={tech}
                  className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {!data.isPrivate && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Code
                </Link>
              </Button>
            )}
            {data.demo && (
              <Button asChild size="sm">
                <Link
                  href={data.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button asChild variant="secondary" size="sm">
              <Link href={`/projects/${name}`}>Details</Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
function ProjectCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <Card className={featured ? "overflow-hidden" : "flex flex-col h-full"}>
      {featured ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-video overflow-hidden bg-muted animate-pulse"></div>
          <div className="flex flex-col p-6">
            <div className="h-8 bg-muted rounded animate-pulse mb-4"></div>
            <div className="h-20 bg-muted rounded animate-pulse mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex gap-2 mt-auto">
              <div className="h-10 w-28 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-28 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative aspect-video bg-muted animate-pulse"></div>
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-16 bg-muted rounded animate-pulse mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
export default function ProjectsPage() {
  const projects = linksData.projects as ProjectsData;
  const featuredProjects = Object.entries(projects)
    .filter(([_, data]) => data.featured)
    .map(([name, data]) => ({ name, data }));
  const otherProjects = Object.entries(projects)
    .filter(([_, data]) => !data.featured)
    .map(([name, data]) => ({ name, data }));
  return (
    <div className="container py-8 md:py-12 space-y-10 md:space-y-16">
      <section className="space-y-4 md:space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          My Projects
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          A collection of projects I've built during my studies, professional work,
          and personal time.
        </p>
      </section>
      {featuredProjects.length > 0 && (
        <section className="space-y-4 md:space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {featuredProjects.map(({ name, data }) => (
              <Suspense key={name} fallback={<ProjectCardSkeleton featured />}>
                <ProjectCard name={name} data={data} />
              </Suspense>
            ))}
          </div>
        </section>
      )}
      {otherProjects.length > 0 && (
        <section className="space-y-4 md:space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Other Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {otherProjects.map(({ name, data }) => (
              <Suspense key={name} fallback={<ProjectCardSkeleton />}>
                <ProjectCard name={name} data={data} />
              </Suspense>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
