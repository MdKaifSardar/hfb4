import Link from "next/link"
import { FileText, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfListProps {
  pdfs: {
    id: string
    title: string
    uploadDate: string
    summary: string
  }[]
}

export function PdfList({ pdfs }: PdfListProps) {
  if (pdfs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">You haven't uploaded any PDFs yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium dark:text-white">{pdf.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(pdf.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link href={`/pdf/${pdf.id}`}>
            <Button variant="ghost" size="sm" className="dark:text-gray-300">
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
