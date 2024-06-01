import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

interface Noticia {
  "dia-mes-ano": string;
  autor: string;
  titulo: string;
  resumo: string;
  link: string;
  "imagem-link": string;
  "forcar-pagina-inicial": string;
}

export async function POST(req: NextRequest) {
  const { index } = await req.json();
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const REPO_OWNER = "alexandrenf";
  const REPO_NAME = "dataifmsabrazil";
  const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/noticias.csv`;

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

    // Parse the CSV content using csv-parse/sync
    const parsedData: Noticia[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    // Extract the markdown and image links
    const { link, "imagem-link": imagemLink } = parsedData[index];

    // Log the filenames for debugging
    console.log(`Attempting to delete markdown file: ${link}`);
    console.log(`Attempting to delete image file: ${imagemLink}`);

    // Remove the selected entry from the CSV
    const updatedData = parsedData.filter((_, i) => i !== index);
    const updatedCsv = stringify(updatedData, {
      header: true,
    });

    // Delete the markdown file from GitHub
    const markdownUrl = link.replace(
      "https://cdn.jsdelivr.net/gh/",
      "https://api.github.com/repos/"
    ).replace(
      "dataifmsabrazil/",
      "dataifmsabrazil/contents/"
    );
    const markdownResponse = await fetch(markdownUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!markdownResponse.ok) {
      throw new Error(
        `Failed to fetch markdown file: ${markdownResponse.status}`
      );
    }

    const markdownData = await markdownResponse.json();
    const markdownDeleteResponse = await fetch(markdownUrl, {
      method: "DELETE",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete markdown file for notícia at index ${index}`,
        sha: markdownData.sha,
        committer: {
          name: "Your Name",
          email: "your-email@example.com",
        },
      }),
    });

    if (!markdownDeleteResponse.ok) {
      throw new Error(
        `Failed to delete markdown file: ${markdownDeleteResponse.status}`
      );
    }

    // Delete the image file from GitHub
    if (imagemLink) {
      const imageUrl = imagemLink.replace(
        "https://cdn.jsdelivr.net/gh/",
        "https://api.github.com/repos/"
      ).replace(
        "dataifmsabrazil/",
        "dataifmsabrazil/contents/"
      );
      const imageResponse = await fetch(imageUrl, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image file: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();
      const imageDeleteResponse = await fetch(imageUrl, {
        method: "DELETE",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete image file for notícia at index ${index}`,
          sha: imageData.sha,
          committer: {
            name: "Your Name",
            email: "your-email@example.com",
          },
        }),
      });

      if (!imageDeleteResponse.ok) {
        throw new Error(
          `Failed to delete image file: ${imageDeleteResponse.status}`
        );
      }
    }

    // Update the CSV file on GitHub
    const csvUpdateResponse = await fetch(GITHUB_API_URL, {
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

    if (!csvUpdateResponse.ok) {
      throw new Error(
        `GitHub API responded with status ${csvUpdateResponse.status}`
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
