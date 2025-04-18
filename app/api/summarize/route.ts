import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { pdfText } = await request.json()

    if (!pdfText) {
      return NextResponse.json({ error: "PDF text is required" }, { status: 400 })
    }

    // Use the Gemini AI API to summarize the PDF
    const summary = await summarizePdfWithGemini(pdfText)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error summarizing PDF:", error)
    return NextResponse.json({ error: "Failed to summarize PDF" }, { status: 500 })
  }
}

async function summarizePdfWithGemini(pdfText: string) {
  try {
    // Use Gemini AI to summarize the PDF
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
      Please summarize the following academic paper. 
      Focus on the key findings, methodology, and conclusions.
      Provide a comprehensive yet concise summary that captures the essence of the paper.
      
      Paper content:
      ${pdfText.substring(0, 10000)} // Limit text length to avoid token limits
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    return summary
  } catch (error) {
    console.error("Error using Gemini AI:", error)
    return generateFallbackSummary(pdfText)
  }
}

function generateFallbackSummary(pdfText: string) {
  // Simple fallback summary generator
  const sentences = pdfText.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const importantSentences = sentences.slice(0, Math.min(5, sentences.length))
  return importantSentences.join(". ") + "."
}
