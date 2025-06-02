// Only import puppeteer on server side
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

interface PageToExport {
  route: string;
  title: string;
}

// Get the base URL for the site
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

// Convert route to filename
function routeToFilename(route: string, baseUrl: string): string {
  let filename = route;
  
  // Remove the base domain if present
  if (filename.includes('.vercel.app')) {
    const domain = new URL(baseUrl).hostname;
    filename = filename.replace(domain, '');
  }
  
  // Remove protocol and domain
  filename = filename.replace(/https?:\/\/[^\/]+/, '');
  
  // Convert / to _ and remove leading/trailing underscores
  filename = filename.replace(/\//g, '_');
  filename = filename.replace(/^_+|_+$/g, '');
  
  // If empty, use 'home'
  if (!filename) {
    filename = 'home';
  }
  
  return filename;
}

// Simplified route discovery - just use a predefined list of all routes
async function discoverAllRoutes(baseUrl: string, options: ExportOptions = {}): Promise<Set<string>> {
  console.log('Starting route discovery...');
  const discoveredRoutes = new Set<string>();
  
  // Add all known static routes
  const staticRoutes = [
    '',           // Home
    '/blog',      // Blog listing
    '/projects',  // Projects
    '/about',     // About
    '/contact',   // Contact
    '/resume'     // Resume
  ];
  
  // Add all known blog post routes (published posts)
  // UPDATE THIS LIST when new posts are published or when you want to add/remove published posts
  const publishedBlogRoutes = [
    '/blog/5',
    '/blog/18', 
    '/blog/22',
    '/blog/23',
    '/blog/24',
    '/blog/1',
    '/blog/2',
    '/blog/3',
    '/blog/4',
    '/blog/6',
    '/blog/7',
    '/blog/8',
    '/blog/9',
    '/blog/10',
    '/blog/11',
    '/blog/12',
    '/blog/13',
    '/blog/14',
    '/blog/15',
    '/blog/16',
    '/blog/17',
    '/blog/19',
    '/blog/20',
    '/blog/21'
  ];
  
  // Add all known blog post routes (draft posts) - only if includeDrafts is true
  // UPDATE THIS LIST when you create new drafts or want to add/remove draft posts
  // Note: These IDs are based on assumption - update with actual draft post IDs
  const draftBlogRoutes = [
    '/blog/1',
    '/blog/2',
    '/blog/3',
    '/blog/4',
    '/blog/6',
    '/blog/7',
    '/blog/8',
    '/blog/9',
    '/blog/10',
    '/blog/11',
    '/blog/12',
    '/blog/13',
    '/blog/14',
    '/blog/15',
    '/blog/16',
    '/blog/17',
    '/blog/19',
    '/blog/20',
    '/blog/21'
    // Add more draft routes as needed - update this list as you create more posts
  ];
  
  // Add static routes
  staticRoutes.forEach(route => {
    discoveredRoutes.add(route);
    console.log(`Added static route: ${route}`);
  });
  
  // Add published blog posts
  publishedBlogRoutes.forEach(route => {
    discoveredRoutes.add(route);
    console.log(`Added published blog post route: ${route}`);
  });
  
  // Add draft blog posts if includeDrafts is true
  if (options.includeDrafts) {
    draftBlogRoutes.forEach(route => {
      discoveredRoutes.add(route);
      console.log(`Added draft blog post route: ${route}`);
    });
  }

  console.log(`Route discovery completed. Found ${discoveredRoutes.size} unique routes`);
  const routeArray = Array.from(discoveredRoutes);
  console.log('All discovered routes:', routeArray);
  return discoveredRoutes;
}

// Generate PDF from a single page using a fresh browser instance
async function generateSinglePDF(
  url: string,
  filename: string,
  options: ExportOptions = {}
): Promise<Buffer> {
  console.log(`Generating PDF for: ${url}`);
  
  let browser = null;
  let page = null;
  
  try {
    // Launch a fresh browser instance for this PDF
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images'
      ]
    });

    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Set a shorter timeout and simpler wait strategy
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    // Wait for any specific selector if provided
    if (options.waitForSelector) {
      try {
        await page.waitForSelector(options.waitForSelector, { timeout: 5000 });
      } catch (error) {
        console.warn(`Selector ${options.waitForSelector} not found for ${url}, continuing anyway...`);
      }
    }

    // Additional delay if specified
    if (options.delay && options.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, Math.min(options.delay as number, 3000)));
    }

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log(`Successfully generated PDF: ${filename}.pdf`);
    return Buffer.from(pdf);
    
  } catch (error) {
    console.error(`Error generating PDF for ${url}:`, error);
    throw error;
  } finally {
    // Always close browser instance
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.warn('Error closing browser:', closeError);
      }
    }
  }
}

// Get route title for a given route
function getRouteTitle(route: string): string {
  if (route === '') return 'Home';
  if (route === '/blog') return 'Blog';
  if (route === '/projects') return 'Projects';
  if (route === '/about') return 'About';
  if (route === '/contact') return 'Contact';
  if (route === '/resume') return 'Resume';
  if (route.startsWith('/blog/')) {
    const id = route.split('/')[2];
    return `Blog Post ${id}`;
  }
  return route.replace(/^\//, '').replace(/\//g, ' - ');
}

// Main export function - only works on server side
export async function exportAllPagesToPDF(options: ExportOptions = {}): Promise<{
  success: boolean;
  files: { filename: string; buffer: Buffer; title: string }[];
  errors: string[];
}> {
  if (!puppeteer) {
    throw new Error('Puppeteer not available - this function only works on the server side');
  }

  const baseUrl = options.baseUrl || getBaseUrl();
  
  // Discover all routes using multiple methods
  const allRoutes = await discoverAllRoutes(baseUrl, options);
  
  // Convert Set to Array and create queue
  const routeQueue = Array.from(allRoutes).map(route => ({
    route,
    title: getRouteTitle(route)
  }));

  console.log(`Starting PDF export for ${routeQueue.length} pages...`);
  console.log('Routes to process:', routeQueue.map(r => r.route));

  const files: { filename: string; buffer: Buffer; title: string }[] = [];
  const errors: string[] = [];
  const processedRoutes = new Set<string>();

  // Process each route in the queue
  for (const pageInfo of routeQueue) {
    // Skip if already processed (avoid duplicates)
    if (processedRoutes.has(pageInfo.route)) {
      console.log(`Skipping duplicate route: ${pageInfo.route}`);
      continue;
    }

    try {
      const fullUrl = `${baseUrl}${pageInfo.route}`;
      const filename = routeToFilename(pageInfo.route, baseUrl);
      
      console.log(`Processing page ${processedRoutes.size + 1}/${routeQueue.length}: ${pageInfo.title} (${fullUrl})`);
      
      const pdfBuffer = await generateSinglePDF(fullUrl, filename, options);
      
      files.push({
        filename: `${filename}.pdf`,
        buffer: pdfBuffer,
        title: pageInfo.title
      });
      
      // Mark as processed
      processedRoutes.add(pageInfo.route);
      
      // Small delay between pages to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      const errorMsg = `Failed to generate PDF for ${pageInfo.route}: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
      
      // Still mark as processed to avoid retrying
      processedRoutes.add(pageInfo.route);
    }
  }

  console.log(`PDF export completed. Success: ${files.length}, Errors: ${errors.length}`);
  console.log('Successfully processed routes:', Array.from(processedRoutes));

  return {
    success: files.length > 0,
    files,
    errors
  };
}

// Client-side export function (downloads files directly)
export async function exportAllPagesClient(includeDrafts: boolean = true): Promise<void> {
  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includeDrafts
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to export PDFs');
    }

    const data = await response.json();
    
    if (data.success && data.files) {
      // Download each PDF file
      for (const fileInfo of data.files) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${fileInfo.buffer}`;
        link.download = fileInfo.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      throw new Error('Export failed');
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
} 