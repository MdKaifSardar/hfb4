import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"

interface PdfCardProps {
  pdf: {
    id: string
    title: string
    author: string
    uploadDate: string
    summary: string
    tags: string[]
  }
}

export function PdfCard({ pdf }: PdfCardProps) {
  return (
    <Card className="overflow-hidden dark:card-gradient dark:shadow-glow transition-all duration-300 dark:hover-glow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1 dark:text-white">{pdf.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              By {pdf.author} •
              <span className="inline-flex items-center ml-2">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(pdf.uploadDate).toLocaleDateString()}
              </span>
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {pdf.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 dark:bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{pdf.summary}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3">
        <Link href={`/pdf/${pdf.id}`} className="w-full">
          <Button variant="outline" className="w-full dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
