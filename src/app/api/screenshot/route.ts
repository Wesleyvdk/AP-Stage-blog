import { type NextRequest, NextResponse } from "next/server";
import { getProjectImage } from "@/lib/screenshot-service";
import linksData from "@/lib/links.json";
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectName = searchParams.get("project");
  if (!projectName) {
    return NextResponse.json(
      { error: "Project name is required" },
      { status: 400 },
    );
  }
  const projects = linksData.projects as Record<
    string,
    { github: string; demo?: string }
  >;
  const projectData = projects[projectName];
  if (!projectData) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  try {
    const width = Number.parseInt(searchParams.get("width") || "1200", 10);
    const height = Number.parseInt(searchParams.get("height") || "630", 10);
    const fullPage = searchParams.get("fullPage") === "true";
    const { url, source } = await getProjectImage(projectName, projectData, {
      width,
      height,
      fullPage,
    });
    return NextResponse.json({ url, source });
  } catch (error) {
    console.error("Error generating screenshot:", error);
    return NextResponse.json(
      { error: "Failed to generate screenshot" },
      { status: 500 },
    );
  }
}
