import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
  const { index } = await req.json();
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/alexandrenf/dataifmsabrazil/contents/noticias.csv`;

  try {
    // Fetch the current CSV content
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

    // Parse the CSV content
    const parsed = Papa.parse<Noticia>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, header) => value.trim(),
    });

    // Remove the selected entry
    const updatedData = parsed.data.filter((_, i) => i !== index);
    const updatedCsv = Papa.unparse(updatedData, {
      header: true,
    });

    // Update the CSV file on GitHub
    const updateResponse = await fetch(GITHUB_API_URL, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete notícia at index ${index}`,
        content: Buffer.from(updatedCsv, "utf-8").toString("base64"),
        sha: result.sha,
        committer: {
          name: "Your Name",
          email: "your-email@example.com",
        },
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(
        `GitHub API responded with status ${updateResponse.status}`,
      );
    }

    return NextResponse.json({ message: "Notícia successfully deleted" });
  } catch (error: any) {
    console.error("Error deleting notícia:", error);
    return NextResponse.json(
      { message: "Error deleting notícia", error: error.message },
      { status: 500 },
    );
  }
}
