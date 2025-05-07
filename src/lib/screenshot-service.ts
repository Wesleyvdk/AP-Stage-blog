import { extractRepoInfo } from "./github-service";

// Types of image sources
type ImageSource = "screenshot" | "og" | "github" | "placeholder";

interface ScreenshotOptions {
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  fullPage?: boolean;
}

// Function to get the best available image for a project
export async function getProjectImage(
  projectName: string,
  projectData: { github: string; demo?: string },
  options: ScreenshotOptions = { width: 1200, height: 630 },
): Promise<{ url: string; source: ImageSource }> {
  // Try to get a screenshot of the demo site if available
  if (projectData.demo) {
    try {
      const screenshotUrl = await getWebsiteScreenshot(
        projectData.demo,
        options,
      );
      return { url: screenshotUrl, source: "screenshot" };
    } catch (error) {
      console.error(`Error getting screenshot for ${projectName}:`, error);
      // Continue to fallbacks
    }
  }

  // Try to get Open Graph image from the demo site
  if (projectData.demo) {
    try {
      const ogImage = await getOpenGraphImage(projectData.demo);
      if (ogImage) {
        return { url: ogImage, source: "og" };
      }
    } catch (error) {
      console.error(`Error getting OG image for ${projectName}:`, error);
      // Continue to fallbacks
    }
  }

  // Try to get GitHub repository social preview image
  try {
    const { owner, repo } = extractRepoInfo(projectData.github);
    const githubImage = await getGitHubSocialImage(owner, repo);
    if (githubImage) {
      return { url: githubImage, source: "github" };
    }
  } catch (error) {
    console.error(`Error getting GitHub image for ${projectName}:`, error);
    // Continue to fallbacks
  }

  // Fallback to a placeholder image
  return {
    url: `/placeholder.svg?height=${options.height}&width=${options.width}&query=${encodeURIComponent(
      projectName + " project screenshot",
    )}`,
    source: "placeholder",
  };
}

// Function to get a screenshot of a website using a free screenshot service
async function getWebsiteScreenshot(
  url: string,
  options: ScreenshotOptions,
): Promise<string> {
  // OPTION 1: Microlink API (free tier with rate limits)
  // This is one of the best free options with a generous free tier
  const width = options.width || 1200;
  const height = options.height || 630;
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&waitFor=1000&viewport.width=${width}&viewport.height=${height}`;

  // OPTION 2: Urlbox.io with their free tier
  // const apiKey = process.env.URLBOX_API_KEY || "free" // Use "free" for the free tier
  // const secret = process.env.URLBOX_SECRET || "free"  // Use "free" for the free tier
  // return `https://api.urlbox.io/v1/${apiKey}/png?url=${encodeURIComponent(url)}&width=${options.width || 1200}&height=${options.height || 630}&ttl=604800&full_page=${options.fullPage ? "true" : "false"}`

  // OPTION 3: Shot.screenshotapi.net (limited free tier)
  // return `https://shot.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}&width=${options.width || 1200}&height=${options.height || 630}&fresh=true&output=image&file_type=png`

  // OPTION 4: Thum.io (limited free tier)
  // return `https://image.thum.io/get/width/${options.width || 1200}/crop/${options.height || 630}/viewportWidth/${options.width || 1200}/${encodeURIComponent(url)}`
}

// Function to get Open Graph image from a website
async function getOpenGraphImage(url: string): Promise<string | null> {
  try {
    // Use Microlink's API to extract OG image (more reliable than custom parsing)
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

// Function to get GitHub repository social preview image
async function getGitHubSocialImage(
  owner: string,
  repo: string,
): Promise<string | null> {
  // GitHub social preview image URL pattern
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
}

// Function to cache screenshots to avoid hitting API limits
export async function cacheProjectScreenshot(
  projectName: string,
  imageUrl: string,
  source: ImageSource,
): Promise<void> {
  // This would be implemented with a database or file system storage
  // For now, we'll just log that we would cache this
  console.log(
    `Would cache screenshot for ${projectName} from source: ${source}`,
  );
  // In a real implementation, you would:
  // 1. Download the image
  // 2. Store it in your project's public directory or a CDN
  // 3. Update a database or JSON file with the cached URL
}
