import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TokenThesis</h1>
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
              Funding of Research Papers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            A decentralized Web3 platform where researchers submit proposals, AI generates unbiased summaries, and token holders vote on funding through DAO governance. All proposals, votes, and fund disbursements are transparently recorded on-chain.
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
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Submit Proposal</h3>
                <p className="text-gray-600 dark:text-gray-300">
                Researchers upload their proposals (PDF/text), which are stored on IPFS and hashed on-chain.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-glow p-6 rounded-lg text-center transition-all duration-300 dark:hover-glow">
                <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">AI Summarization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                An AI model summarizes each proposal into key points like objectives, methods, and impact for fair evaluation.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-glow p-6 rounded-lg text-center transition-all duration-300 dark:hover-glow">
                <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Community Voting & Funding</h3>
                <p className="text-gray-600 dark:text-gray-300">
                Token holders review summaries, vote via DAO, and winning proposals automatically receive funds through smart contracts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>© 2025 TokenThesis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
