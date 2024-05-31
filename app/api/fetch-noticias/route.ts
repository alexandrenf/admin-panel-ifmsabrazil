import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/alexandrenf/dataifmsabrazil/contents/noticias.csv`;

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const result = await response.json();
    const csvContent = Buffer.from(result.content, "base64").toString("utf-8");

    return NextResponse.json({ csvContent });
  } catch (error) {
    console.error("Error fetching CSV data from GitHub:", error);
    return NextResponse.json(
      { error: "Failed to fetch CSV data from GitHub" },
      { status: 500 },
    );
  }
}
