"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, LogOut } from "lucide-react"
import { PdfCard } from "@/components/pdf-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThumbsUp } from "lucide-react"


type PDFSummary = {
  id: string
  title: string
  author: string
  uploadDate: string
  summary: string
  tags: string[]
  upvotes: number
}

export default function UserFeed() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [votedPapers, setVotedPapers] = useState<string[]>([])

  // Mock data for PDF summaries
  const [pdfSummaries, setPdfSummaries] = useState<PDFSummary[]>([
    {
      id: "1",
      title: "Advanced Machine Learning Techniques",
      author: "Dr. Jane Smith",
      uploadDate: "2025-04-15",
      summary:
        "This paper explores cutting-edge machine learning algorithms and their applications...",
      tags: ["Machine Learning", "AI", "Computer Science"],
      upvotes: 0,
    },
    {
      id: "2",
      title: "Quantum Computing: A Comprehensive Review",
      author: "Prof. Robert Johnson",
      uploadDate: "2025-04-10",
      summary:
        "A detailed analysis of recent advancements in quantum computing...",
      tags: ["Quantum Computing", "Physics", "Computer Science"],
      upvotes: 0,
    },
    {
      id: "3",
      title: "Sustainable Energy Solutions",
      author: "Dr. Maria Garcia",
      uploadDate: "2025-04-05",
      summary:
        "This research presents innovative approaches to renewable energy generation...",
      tags: ["Renewable Energy", "Sustainability", "Engineering"],
      upvotes: 0,
    },
    {
      id: "4",
      title: "Cognitive Psychology: Memory and Learning",
      author: "Prof. David Chen",
      uploadDate: "2025-04-01",
      summary:
        "An exploration of human memory systems and learning processes...",
      tags: ["Psychology", "Neuroscience", "Education"],
      upvotes: 0,
    },
    {
      id: "5",
      title: "Climate Change Mitigation Strategies",
      author: "Dr. Sarah Williams",
      uploadDate: "2025-03-28",
      summary:
        "A comprehensive analysis of current and proposed strategies to mitigate climate change...",
      tags: ["Climate Science", "Environmental Studies", "Policy"],
      upvotes: 0,
    },
  ])
  const filteredPdfs = pdfSummaries.filter(
    (pdf) =>
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )
  const handleUpvote = (id: string) => {
    if (votedPapers.includes(id)) return // Already voted
  
    setPdfSummaries((prev) =>
      prev.map((pdf) =>
        pdf.id === id ? { ...pdf, upvotes: pdf.upvotes + 1 } : pdf,
      ),
    )
    setVotedPapers((prev) => [...prev, id])
  }
  
  const handleSignOut = () => {
    // In a real app, this would sign out the user
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
    <header className="border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">AcademiShare</Link>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold dark:text-white">Academic Summaries</h1>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search papers..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => (
            <Card key={pdf.id} className="dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-semibold">{pdf.title}</h2>
                    <p className="text-sm text-gray-500">By {pdf.author} • {pdf.uploadDate}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-1 text-blue-500"
                    onClick={() => handleUpvote(pdf.id)}
                    disabled={votedPapers.includes(pdf.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{pdf.upvotes}</span>
                  </Button>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{pdf.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pdf.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No papers found matching your search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  </div>
  )
}
