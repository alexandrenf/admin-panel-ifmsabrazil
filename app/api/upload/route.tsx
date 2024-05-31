import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const filename = formData.get("filename") as string;
  const date = formData.get("date") as string;
  const markdown = formData.get("markdown") as string;
  const resumo = formData.get("resumo") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as File | null;
  const imageFilename = formData.get("imageFilename") as string;
  const forcarPaginaInicial = formData.get("forcarPaginaInicial") as string;

  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const REPO_OWNER = "alexandrenf";
  const REPO_NAME = "dataifmsabrazil";
  const COMMIT_MESSAGE = `Add new notícia: ${title}`;
  const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/noticias/${filename}`;
  const GITHUB_API_IMAGE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/noticias/${imageFilename}`;

  const fileContent = Buffer.from(markdown).toString("base64");
  const imageContent = image
    ? Buffer.from(await image.arrayBuffer()).toString("base64")
    : "";

  const GITHUB_API_CSV_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/noticias.csv`;

  try {
    // Fetch the latest CSV file from GitHub
    const csvResponse = await fetch(GITHUB_API_CSV_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!csvResponse.ok) {
      throw new Error(`Failed to fetch the latest CSV: ${csvResponse.status}`);
    }

    const csvData = await csvResponse.json();
    const csvContent = Buffer.from(csvData.content, "base64").toString("utf-8");

    // Create the new CSV entry
    const newCsvEntry = `${date},${author},${title},${resumo},https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}/noticias/${filename},https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}/noticias/${imageFilename},${forcarPaginaInicial}`;
    const updatedCsv = `${csvContent.trim()}\n${newCsvEntry}`;

    // Check if the markdown file already exists
    let existingFileSha = "";
    const existingMarkdownResponse = await fetch(GITHUB_API_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (existingMarkdownResponse.ok) {
      const existingFileData = await existingMarkdownResponse.json();
      existingFileSha = existingFileData.sha;
    }

    // Upload the markdown file
    const markdownResponse = await fetch(GITHUB_API_URL, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: COMMIT_MESSAGE,
        content: fileContent,
        sha: existingFileSha,
        committer: {
          name: "Your Name",
          email: "your-email@example.com",
        },
      }),
    });

    const markdownResponseData = await markdownResponse.json();
    if (!markdownResponse.ok) {
      console.error("Markdown response error:", markdownResponseData);
      throw new Error(
        `GitHub API responded with status ${markdownResponse.status}`,
      );
    }

    // Check if the image file already exists
    let existingImageSha = "";
    if (imageContent) {
      const existingImageResponse = await fetch(GITHUB_API_IMAGE_URL, {
        method: "GET",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (existingImageResponse.ok) {
        const existingImageData = await existingImageResponse.json();
        existingImageSha = existingImageData.sha;
      }
    }

    // Upload the image file
    if (imageContent) {
      const imageResponse = await fetch(GITHUB_API_IMAGE_URL, {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add image for ${title}`,
          content: imageContent,
          sha: existingImageSha,
          committer: {
            name: "Your Name",
            email: "your-email@example.com",
          },
        }),
      });

      const imageResponseData = await imageResponse.json();
      if (!imageResponse.ok) {
        console.error("Image response error:", imageResponseData);
        throw new Error(
          `GitHub API responded with status ${imageResponse.status}`,
        );
      }
    }

    // Check if the CSV file already exists
    const existingCsvResponse = await fetch(GITHUB_API_CSV_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    let existingCsvSha = "";
    if (existingCsvResponse.ok) {
      const existingCsvData = await existingCsvResponse.json();
      existingCsvSha = existingCsvData.sha;
    }

    // Update the CSV file on GitHub
    const csvUpdateResponse = await fetch(GITHUB_API_CSV_URL, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update CSV for ${title}`,
        content: Buffer.from(updatedCsv, "utf-8").toString("base64"),
        sha: existingCsvSha,
        committer: {
          name: "Your Name",
          email: "your-email@example.com",
        },
      }),
    });

    const csvUpdateResponseData = await csvUpdateResponse.json();
    if (!csvUpdateResponse.ok) {
      console.error("CSV update response error:", csvUpdateResponseData);
      throw new Error(
        `GitHub API responded with status ${csvUpdateResponse.status}`,
      );
    }

    return NextResponse.json({ message: "File successfully uploaded" });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file", error: error.message },
      { status: 500 },
    );
  }
}
