let puppeteer: any = null;
if (typeof window === 'undefined') {
  try {
    const puppeteerModule = require('puppeteer');
    puppeteer = puppeteerModule.default || puppeteerModule;
  } catch (error) {
    console.warn('Puppeteer not available:', error);
  }
}
export interface ExportOptions {
  baseUrl?: string;
  waitForSelector?: string;
  delay?: number;
  includeDrafts?: boolean;
}
export interface PDFExportResult {
  filename: string;
  data: string; 
}
function routeToFilename(route: string): string {
  const cleanRoute = route
    .replace(/^https?:\/\/[^\/]+/, '') 
    .replace(/^\
    .replace(/\
    .replace(/[^a-zA-Z0-9_-]/g, '_') 
    .replace(/_+/g, '_') 
    .replace(/^_|_$/g, ''); 
  return cleanRoute || 'home';
}
export async function exportAllPagesToPDF(options: ExportOptions = {}): Promise<PDFExportResult[]> {
  if (!puppeteer) {
    throw new Error('Puppeteer not available on client side');
  }
  const { baseUrl = 'http://localhost:3000', delay = 1000, includeDrafts = true } = options;
  console.log('Starting PDF export with options:', { baseUrl, delay, includeDrafts });
  const routes = await discoverAllRoutes(baseUrl, includeDrafts);
  console.log(`Discovered ${routes.length} routes:`, routes);
  const results: PDFExportResult[] = [];
  let processedCount = 0;
  for (const route of routes) {
    try {
      console.log(`Processing route ${processedCount + 1}/${routes.length}: ${route}`);
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        const fullUrl = route.startsWith('http') ? route : `${baseUrl}${route}`;
        console.log(`Navigating to: ${fullUrl}`);
        await page.goto(fullUrl, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
        await page.waitForTimeout(delay);
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          }
        });
        const base64Data = Buffer.from(pdfBuffer).toString('base64');
        const filename = `${routeToFilename(route)}.pdf`;
        results.push({
          filename,
          data: base64Data
        });
        console.log(`âœ“ Generated PDF for ${route} -> ${filename}`);
        processedCount++;
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error(`Failed to generate PDF for ${route}:`, error);
    }
  }
  console.log(`PDF export completed. Generated ${results.length} files.`);
  return results;
}
async function discoverAllRoutes(baseUrl: string, includeDrafts: boolean = true): Promise<string[]> {
  const routes = new Set<string>();
  const staticRoutes = [
    '/',
    '/blog',
    '/projects', 
    '/about',
    '/contact',
    '/resume'
  ];
  staticRoutes.forEach(route => routes.add(route));
  console.log('Added static routes:', staticRoutes);
  try {
    console.log('Fetching posts via API service...');
    const { getAllPostsForAdmin } = await import('./api-service');
    const posts = await getAllPostsForAdmin();
    console.log(`Found ${posts.length} posts via API service`);
    posts.forEach(post => {
      if (includeDrafts || post.published) {
        routes.add(`/blog/${post.id}`);
      }
    });
  } catch (error) {
    console.error('Error fetching posts via API service:', error);
  }
  try {
    console.log('Making direct API call as fallback...');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/posts`);
    if (response.ok) {
      const data = await response.json();
      console.log(`Found ${data.posts?.length || 0} posts via direct API call`);
      if (data.posts) {
        data.posts.forEach((post: any) => {
          if (includeDrafts || post.published) {
            routes.add(`/blog/${post.id}`);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error with direct API call:', error);
  }
  if (puppeteer) {
    try {
      console.log('Starting web crawling for additional route discovery...');
      const crawledRoutes = await crawlForBlogRoutes(baseUrl);
      console.log(`Found ${crawledRoutes.length} additional routes via crawling:`, crawledRoutes);
      crawledRoutes.forEach(route => routes.add(route));
    } catch (error) {
      console.error('Error during web crawling:', error);
    }
  }
  const finalRoutes = Array.from(routes).sort();
  console.log(`Total unique routes discovered: ${finalRoutes.length}`);
  return finalRoutes;
}
async function crawlForBlogRoutes(baseUrl: string): Promise<string[]> {
  if (!puppeteer) {
    console.warn('Puppeteer not available for crawling');
    return [];
  }
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    const routes = new Set<string>();
    try {
      await page.goto(`${baseUrl}/blog`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(2000);
      const blogLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/blog/"]'));
        return links.map((link: Element) => (link as HTMLAnchorElement).href);
      });
      blogLinks.forEach((link: string) => {
        const route = link.replace(baseUrl, '');
        if (route.match(/^\/blog\/\d+$/)) {
          routes.add(route);
        }
      });
      console.log(`Found ${blogLinks.length} blog post links on /blog page`);
    } catch (error) {
      console.error('Error crawling /blog page:', error);
    }
    try {
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(2000);
      const homeLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/blog/"]'));
        return links.map((link: Element) => (link as HTMLAnchorElement).href);
      });
      homeLinks.forEach((link: string) => {
        const route = link.replace(baseUrl, '');
        if (route.match(/^\/blog\/\d+$/)) {
          routes.add(route);
        }
      });
      console.log(`Found ${homeLinks.length} blog post links on home page`);
    } catch (error) {
      console.error('Error crawling home page:', error);
    }
    return Array.from(routes);
  } finally {
    await browser.close();
  }
}
