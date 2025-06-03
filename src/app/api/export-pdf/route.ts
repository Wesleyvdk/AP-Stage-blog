import { NextRequest, NextResponse } from 'next/server';
import { exportAllPagesToPDF } from '@/lib/pdf-export-service';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting PDF export...');
    
    // Get the request body for any options
    const body = await request.json().catch(() => ({}));
    const { baseUrl, includeDrafts = false } = body;
    
    // Use the request origin if no baseUrl provided
    const exportBaseUrl = baseUrl || request.nextUrl.origin;
    
    const results = await exportAllPagesToPDF({
      baseUrl: exportBaseUrl,
      waitForSelector: 'main', // Wait for main content to load
      delay: 1000, // 1 second delay to ensure everything is loaded
      includeDrafts // Pass the includeDrafts option
    });

    // The function returns an array of PDFExportResult directly
    if (results && results.length > 0) {
      // Convert the results to the expected format
      const files = results.map(result => ({
        filename: result.filename,
        buffer: result.data, // data is already base64 encoded
        title: result.filename.replace('.pdf', '').replace(/_/g, ' ')
      }));

      return NextResponse.json({
        success: true,
        files,
        errors: [],
        message: `Successfully generated ${files.length} PDF(s)`
      });
    } else {
      return NextResponse.json({
        success: false,
        files: [],
        errors: ['No PDFs were generated'],
        message: 'Failed to generate PDFs'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json({
      success: false,
      files: [],
      errors: [String(error)],
      message: 'Internal server error during PDF generation'
    }, { status: 500 });
  }
} 