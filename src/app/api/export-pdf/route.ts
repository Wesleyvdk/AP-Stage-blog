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
    
    const result = await exportAllPagesToPDF({
      baseUrl: exportBaseUrl,
      waitForSelector: 'main', // Wait for main content to load
      delay: 1000, // 1 second delay to ensure everything is loaded
      includeDrafts // Pass the includeDrafts option
    });

    if (result.success) {
      // Convert buffers to base64 for JSON response
      const files = result.files.map(file => ({
        filename: file.filename,
        buffer: file.buffer.toString('base64'),
        title: file.title
      }));

      return NextResponse.json({
        success: true,
        files,
        errors: result.errors,
        message: `Successfully generated ${files.length} PDF(s)`
      });
    } else {
      return NextResponse.json({
        success: false,
        files: [],
        errors: result.errors,
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