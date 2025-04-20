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

export default function UserFeed() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for PDF summaries
  const pdfSummaries = [
    {
      id: "1",
      title: "Advanced Machine Learning Techniques",
      author: "Dr. Jane Smith",
      uploadDate: "2025-04-15",
      summary:
        "This paper explores cutting-edge machine learning algorithms and their applications in various domains. It covers deep learning, reinforcement learning, and transfer learning approaches with practical examples and case studies.",
      tags: ["Machine Learning", "AI", "Computer Science"],
    },
    {
      id: "2",
      title: "Quantum Computing: A Comprehensive Review",
      author: "Prof. Robert Johnson",
      uploadDate: "2025-04-10",
      summary:
        "A detailed analysis of recent advancements in quantum computing, including quantum algorithms, quantum error correction, and potential applications in cryptography and optimization problems.",
      tags: ["Quantum Computing", "Physics", "Computer Science"],
    },
    {
      id: "3",
      title: "Sustainable Energy Solutions",
      author: "Dr. Maria Garcia",
      uploadDate: "2025-04-05",
      summary:
        "This research presents innovative approaches to renewable energy generation and storage, with a focus on solar, wind, and hydroelectric power. It discusses efficiency improvements and integration with existing power grids.",
      tags: ["Renewable Energy", "Sustainability", "Engineering"],
    },
    {
      id: "4",
      title: "Cognitive Psychology: Memory and Learning",
      author: "Prof. David Chen",
      uploadDate: "2025-04-01",
      summary:
        "An exploration of human memory systems and learning processes, examining how information is encoded, stored, and retrieved. The paper discusses implications for educational practices and cognitive enhancement.",
      tags: ["Psychology", "Neuroscience", "Education"],
    },
    {
      id: "5",
      title: "Climate Change Mitigation Strategies",
      author: "Dr. Sarah Williams",
      uploadDate: "2025-03-28",
      summary:
        "A comprehensive analysis of current and proposed strategies to mitigate climate change, including carbon capture technologies, policy interventions, and behavioral changes at individual and societal levels.",
      tags: ["Climate Science", "Environmental Studies", "Policy"],
    },
  ]

  const filteredPdfs = pdfSummaries.filter(
    (pdf) =>
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold dark:text-white">Summaries</h1>
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
            filteredPdfs.map((pdf) => <PdfCard key={pdf.id} pdf={pdf} />)
          ) : (
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No papers found matching your search criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
