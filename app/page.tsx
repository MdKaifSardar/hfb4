import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AcademiShare</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 dark:text-white animate-fadeIn">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-blue-100">
              Academic Knowledge Sharing Made Simple
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              A platform where professors can share academic papers and students can access AI-generated summaries for
              quick understanding.
            </p>
            <Link href="/signup">
              <Button size="lg" className="px-8 dark:button-glow">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-glow p-6 rounded-lg text-center transition-all duration-300 dark:hover-glow">
                <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Professors Upload PDFs</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Professors can upload academic papers and research documents in PDF format.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-glow p-6 rounded-lg text-center transition-all duration-300 dark:hover-glow">
                <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">AI Generates Summaries</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our platform uses Gemini AI to automatically generate concise summaries of the uploaded documents.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-glow p-6 rounded-lg text-center transition-all duration-300 dark:hover-glow">
                <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Users Access Content</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Users can browse through summaries and access the full PDFs for in-depth reading.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>© 2025 AcademiShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
