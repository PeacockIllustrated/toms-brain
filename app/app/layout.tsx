import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Brain } from "lucide-react"

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b px-4 md:hidden bg-card">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Brain className="h-6 w-6 text-primary" />
                        <span>Tom's Brain</span>
                    </div>
                    <MobileNav />
                </header>

                <main className="flex-1 overflow-auto bg-secondary/30">
                    <div className="container mx-auto max-w-5xl p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
