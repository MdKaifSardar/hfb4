"use server"

import connectToDatabase from "@/lib/mongodb"
import User, { IUser } from "@/models/User"
import { type NextRequest, NextResponse } from "next/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { revalidatePath } from "next/cache"

// 1. Create User
export async function createUser(userData: {
  name: string
  email: string
  password: string
  role: string
}) {
  try {
    await connectToDatabase()

    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error("User already exists with this email.")
    }

    const newUser: IUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password, // ⚠ hash in production!
      role: userData.role,
      createdAt: new Date(),
    })

    return {
      id: newUser.id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// 2. Sign In
export async function signIn(credentials: { email: string; password: string }) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email: credentials.email })
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password")
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

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

// 5. POST endpoint to summarize PDF using Gemini AI
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File

    if (!pdfFile || !pdfFile.type.includes("pdf")) {
      return NextResponse.json({ error: "Please upload a valid PDF file" }, { status: 400 })
    }

    const arrayBuffer = await pdfFile.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    const gemini = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
    })

    const { text: summary } = await generateText({
      model: gemini("gemini-1.5-pro"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please provide a comprehensive summary of this research paper and show heading for the research paper. Include the main research question, methodology, key findings, and implications. Format the summary in clear paragraphs.",
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