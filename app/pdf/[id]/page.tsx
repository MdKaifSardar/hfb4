"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { getPdfById } from "@/lib/actions/paper.actions"

export default function PdfViewerPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [pdf, setPdf] = useState<any>(null)

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        // In a real app, this would fetch the PDF data from the server
        const pdfData = await getPdfById(id)
        setPdf(pdfData)
      } catch (error) {
        console.error("Failed to fetch PDF:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPdf()
  }, [id])

  const handleSignOut = () => {
    // In a real app, this would sign out the user
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              AcademiShare
            </Link>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center dark:bg-gray-900">
          <p className="dark:text-gray-300">Loading PDF...</p>
        </main>
      </div>
    )
  }

  // Mock PDF data for demonstration
  const mockPdf = {
    id,
    title: "Advanced Machine Learning Techniques",
    author: "Dr. Jane Smith",
    uploadDate: "2025-04-15",
    summary:
      "This paper explores cutting-edge machine learning algorithms and their applications in various domains. It covers deep learning, reinforcement learning, and transfer learning approaches with practical examples and case studies.\n\nThe research begins by examining the theoretical foundations of modern machine learning approaches, including neural network architectures and optimization algorithms. It then proceeds to discuss applications in computer vision, natural language processing, and robotics.\n\nKey findings include the effectiveness of transformer models for a wide range of tasks beyond their original NLP applications, and the potential of hybrid approaches that combine deep learning with symbolic reasoning for more robust AI systems.\n\nThe paper concludes with a discussion of ethical considerations and future research directions in the field of machine learning.",
    tags: ["Machine Learning", "AI", "Computer Science"],
    pdfUrl: "/pdfs/sample.pdf",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            AcademiShare
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 dark:bg-gray-900">
        <Button variant="ghost" className="mb-6 dark:text-gray-300" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">{mockPdf.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {mockPdf.tags.map((tag) => (
              <span key={tag} className="bg-primary/10 dark:bg-primary/20 text-primary text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            By {mockPdf.author} • Published on {new Date(mockPdf.uploadDate).toLocaleDateString()}
          </p>
        </div>

        <Tabs defaultValue="summary">
          <TabsList className="mb-6">
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="pdf">Full PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card className="dark:card-gradient dark:shadow-glow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Summary</h2>
                <div className="prose max-w-none dark:prose-invert">
                  {mockPdf.summary.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 dark:text-gray-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdf">
            <Card className="dark:card-gradient dark:shadow-glow">
              <CardContent className="p-6">
                <div className="flex justify-end mb-4">
                  <Button variant="outline" className="dark:bg-gray-800 dark:text-gray-200">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="border dark:border-gray-700 rounded-lg h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">
                    PDF Viewer would be embedded here using a library like react-pdf or PDF.js
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
