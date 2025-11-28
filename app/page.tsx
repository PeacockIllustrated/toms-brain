import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, BookOpen, Layout } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6 lg:px-8">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Brain className="h-6 w-6 text-primary" />
          <span>Tom's Brain</span>
        </div>
        <nav>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Master any topic with <span className="text-primary">AI-powered</span> courses.
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Capture learning topics, generate structured courses instantly, and track your progress in a beautiful, focused environment.
            </p>
            <div className="space-x-4">
              <Link href="/auth/login">
                <Button size="lg" className="gap-2">
                  Get Started <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Layout className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Topic Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize your learning goals by context, difficulty, and priority.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Sparkles className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">AI Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn any topic into a comprehensive course with one click.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BookOpen className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Structured Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn through modules and lessons designed for clarity and retention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for Tom. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  )
}
