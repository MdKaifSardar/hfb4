"use server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { revalidatePath } from "next/cache"
import { v2 as cloudinary } from "cloudinary"
import { Paper } from "../models/paper.model"
import * as pdfjsLib from 'pdfjs-dist'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 3. Upload PDF (mock)
export async function uploadPdf(file: File) {
  console.log("Uploading PDF:", file.name)

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const pdf = {
    id: Math.random().toString(36).substring(7),
    title: file.name.replace(".pdf", ""),
    uploadDate: new Date().toISOString(),
    url: "/pdfs/sample.pdf",
  }

  revalidatePath("/professor/dashboard")
  return pdf
}

// 4. Get PDF by ID (mock)
export async function getPdfById(id: string) {
  console.log("Fetching PDF:", id)

  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id,
    title: "Advanced Machine Learning Techniques",
    author: "Dr. Jane Smith",
    uploadDate: "2025-04-15",
    summary: "This paper explores cutting-edge machine learning algorithms...",
    tags: ["Machine Learning", "AI", "Computer Science"],
    pdfUrl: "/pdfs/sample.pdf",
  }
}

// Extract text from PDF using pdf-lib
async function extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument(fileBuffer);
    const pdf = await loadingTask.promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ');
    }

    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error)
    throw new Error("Failed to extract text from the PDF")
  }
}

// Summarize a paper using Gemini API
async function summarizePaperWithGemini(pdfText: string): Promise<string> {
  try {
    const gemini = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!, // Use API key from .env
    })

    const { text: summary } = await generateText({
      model: gemini("gemini-1.5-pro"),
      messages: [
        {
          role: "user",
          content: `Please summarize the following academic paper. Focus on the key findings, methodology, and conclusions.\n\nPaper content:\n${pdfText.substring(0, 10000)}`, // Limit text length to avoid token limits
        },
      ],
    })

    return summary
  } catch (error) {
    console.error("Error summarizing paper with Gemini:", error)
    throw new Error("Failed to summarize the paper")
  }
}

interface CloudinaryResult {
  url: string;
  id: string;
}

// Upload PDF to Cloudinary
async function uploadPdfToCloudinary(fileBuffer: Buffer, fileName: string): Promise<CloudinaryResult> {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "hfb-paper-pdfs", // Ensure the folder is created in Cloudinary
          public_id: fileName,
        },
        (error, result) => {
          if (error) reject(error)
          if (!result) reject(new Error("Upload failed with no result"))
          if (result && result.secure_url && result.public_id) {
            resolve({ url: result.secure_url, id: result.public_id })
          } else {
            reject(new Error("Missing required fields in upload result"))
          }
        }
      ).end(fileBuffer)
    })
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error)
    throw new Error("Failed to upload PDF to Cloudinary")
  }
}

// Create a paper
export async function createPaper({ pdfFile, userId }: { pdfFile: File; userId: string }) {
  try {
    if (!pdfFile || !pdfFile.type.includes("pdf")) {
      return { error: "Please upload a valid PDF file" }
    }

    const arrayBuffer = await pdfFile.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Extract text from the PDF
    const pdfText = await extractTextFromPdf(fileBuffer)

    // Upload PDF to Cloudinary
    const cloudinaryResult = await uploadPdfToCloudinary(fileBuffer, pdfFile.name)

    // Summarize the paper using the extracted text
    const summary = await summarizePaperWithGemini(pdfText)

    // Save paper to MongoDB
    const paper = new Paper({
      userId, // Use userId instead of clerkId
      summary,
      pdf: {
        url: cloudinaryResult.url,
        id: cloudinaryResult.id,
      },
    })

    await paper.save()

    // Return plain object to avoid serialization issues
    return {
      message: "Paper created successfully",
      paper: {
        id: paper._id.toString(),
        userId: paper.userId,
        summary: paper.summary,
        pdf: paper.pdf,
      },
    }
  } catch (error) {
    console.error("Error creating paper:", error)
    return { error: "Failed to create paper" }
  }
}
