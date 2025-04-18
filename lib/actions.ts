"use server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"



import { revalidatePath } from "next/cache"

// Mock user database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "professor",
  },
]

// Mock function to create a user
export async function createUser(userData: {
  name: string
  email: string
  password: string
  role: string
}) {
  // In a real app, this would create a user in the database
  console.log("Creating user:", userData)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return a mock user
  return {
    id: "3",
    name: userData.name,
    email: userData.email,
    role: userData.role,
  }
}

// Mock function to sign in a user
export async function signIn(credentials: { email: string; password: string }) {
  // In a real app, this would verify the credentials against the database
  console.log("Signing in:", credentials)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find the user
  const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

  if (!user) {
    throw new Error("Invalid credentials")
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

// Mock function to upload a PDF
export async function uploadPdf(file: File) {
  // In a real app, this would upload the file to Cloudinary
  console.log("Uploading PDF:", file.name)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return a mock PDF
  const pdf = {
    id: Math.random().toString(36).substring(7),
    title: file.name.replace(".pdf", ""),
    uploadDate: new Date().toISOString(),
    url: "/pdfs/sample.pdf",
  }

  revalidatePath("/professor/dashboard")

  return pdf
}

// Mock function to get a PDF by ID
export async function getPdfById(id: string) {
  // In a real app, this would fetch the PDF from the database
  console.log("Fetching PDF:", id)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return a mock PDF
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

// Mock function to summarize a PDF using Gemini AI
// export async function summarizePdf(pdfUrl: string) {
//   // In a real app, this would use the Gemini AI API to summarize the PDF
//   console.log("Summarizing PDF:", pdfUrl)

//   // Simulate a delay
//   await new Promise((resolve) => setTimeout(resolve, 3000))

//   // Return a mock summary
//   return {
//     summary:
//       "This paper explores cutting-edge machine learning algorithms and their applications in various domains...",
//   }
// }
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File

    if (!pdfFile || !pdfFile.type.includes("pdf")) {
      return NextResponse.json({ error: "Please upload a valid PDF file" }, { status: 400 })
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Initialize the Google Generative AI model
    const gemini = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
    })

    // Generate summary using Gemini
    const { text: summary } = await generateText({
      model: gemini("gemini-1.5-pro"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please provide a comprehensive summary of this research paper and show  heading for the research paper. Include the main research question, methodology, key findings, and implications. Format the summary in clear paragraphs.",
            },
            {
              type: "file",
              data: fileBuffer,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json({ error: "Failed to process the PDF file" }, { status: 500 })
  }
}

