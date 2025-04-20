"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, LogOut } from "lucide-react"
import { uploadPdf } from "@/lib/actions"
import { PdfList } from "@/components/pdf-list"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ProfessorDashboard() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Mock data for uploaded PDFs
  const uploadedPdfs = [
    {
      id: "1",
      title: "Advanced Machine Learning Techniques",
      uploadDate: "2025-04-15",
      summary: "This paper explores cutting-edge machine learning algorithms...",
    },
    {
      id: "2",
      title: "Quantum Computing: A Comprehensive Review",
      uploadDate: "2025-04-10",
      summary: "A detailed analysis of recent advancements in quantum computing...",
    },
    {
      id: "3",
      title: "Sustainable Energy Solutions",
      uploadDate: "2025-04-05",
      summary: "This research presents innovative approaches to renewable energy...",
    },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    try {
      // In a real app, this would call a server action to upload the PDF
      await uploadPdf(selectedFile)

      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setSelectedFile(null)
      }, 500)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      clearInterval(interval)
    }
  }

  const handleSignOut = () => {
    // In a real app, this would sign out the user
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            TokenThesis
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
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Professor Dashboard</h1>

        <Tabs defaultValue="upload">
          <TabsList className="mb-6">
            <TabsTrigger value="upload">Upload PDF</TabsTrigger>
            <TabsTrigger value="manage">Manage PDFs</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="dark:card-gradient dark:shadow-glow">
              <CardHeader>
                <CardTitle className="dark:text-white">Upload Academic PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="dark:text-gray-200">
                      Document Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter document title"
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="dark:text-gray-200">
                      Description
                    </Label>
                    <Input
                      id="description"
                      placeholder="Enter a brief description"
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>

                  <div className="border-2 border-dashed rounded-lg p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                      {selectedFile
                        ? `Selected: ${selectedFile.name}`
                        : "Drag and drop your PDF here, or click to browse"}
                    </p>
                    <Input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                    <Label
                      htmlFor="pdf-upload"
                      className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      Browse Files
                    </Label>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-right">{uploadProgress}%</p>
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="w-full dark:button-glow"
                  >
                    {isUploading ? "Uploading..." : "Upload PDF"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card className="dark:card-gradient dark:shadow-glow">
              <CardHeader>
                <CardTitle className="dark:text-white">Your Uploaded PDFs</CardTitle>
              </CardHeader>
              <CardContent>
                <PdfList pdfs={uploadedPdfs} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
