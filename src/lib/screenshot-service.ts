import { extractRepoInfo } from "./github-service";
type ImageSource = "screenshot" | "og" | "github" | "placeholder";
interface ScreenshotOptions {
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  fullPage?: boolean;
}
export async function getProjectImage(
  projectName: string,
  projectData: { github: string; demo?: string },
  options: ScreenshotOptions = { width: 1200, height: 630 },
): Promise<{ url: string; source: ImageSource }> {
  if (projectData.demo) {
    try {
      const screenshotUrl = await getWebsiteScreenshot(
        projectData.demo,
        options,
      );
      return { url: screenshotUrl, source: "screenshot" };
    } catch (error) {
      console.error(`Error getting screenshot for ${projectName}:`, error);
    }
  }
  if (projectData.demo) {
    try {
      const ogImage = await getOpenGraphImage(projectData.demo);
      if (ogImage) {
        return { url: ogImage, source: "og" };
      }
    } catch (error) {
      console.error(`Error getting OG image for ${projectName}:`, error);
    }
  }
  try {
    const { owner, repo } = extractRepoInfo(projectData.github);
    const githubImage = await getGitHubSocialImage(owner, repo);
    if (githubImage) {
      return { url: githubImage, source: "github" };
    }
  } catch (error) {
    console.error(`Error getting GitHub image for ${projectName}:`, error);
  }
  return {
    url: `/placeholder.svg?height=${options.height}&width=${options.width}&query=${encodeURIComponent(
      projectName + " project screenshot",
    )}`,
    source: "placeholder",
  };
}
async function getWebsiteScreenshot(
  url: string,
  options: ScreenshotOptions,
): Promise<string> {
  const width = options.width || 1200;
  const height = options.height || 630;
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&waitFor=1000&viewport.width=${width}&viewport.height=${height}`;
}
async function getOpenGraphImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot`,
    );
    const data = await response.json();
    if (
      data.status === "success" &&
      data.data &&
      data.data.image &&
      data.data.image.url
    ) {
      return data.data.image.url;
    }
    return null;
  } catch (error) {
    console.error("Error fetching OG image:", error);
    return null;
  }
}
async function getGitHubSocialImage(
  owner: string,
  repo: string,
): Promise<string | null> {
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
}
export async function cacheProjectScreenshot(
  projectName: string,
  imageUrl: string,
  source: ImageSource,
): Promise<void> {
  console.log(
    `Would cache screenshot for ${projectName} from source: ${source}`,
  );
}
