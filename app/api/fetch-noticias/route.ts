import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export async function GET(req: NextRequest) {
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  // Extract cache buster from the query parameters
  const { searchParams } = new URL(req.url);
  const cacheBuster = searchParams.get('t');
  console.log('Cache Buster:', cacheBuster); // For debugging purposes

  // Append cache buster to the GitHub URL
  const GITHUB_API_URL = `https://api.github.com/repos/alexandrenf/dataifmsabrazil/contents/noticias.csv?t=${cacheBuster}`;

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const result = await response.json();
    const csvContent = Buffer.from(result.content, 'base64').toString('utf-8');

    const parsedData = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    return NextResponse.json({ csvData: parsedData });
  } catch (error) {
    console.error('Error fetching CSV data from GitHub:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CSV data from GitHub' },
      { status: 500 }
    );
  }
}
