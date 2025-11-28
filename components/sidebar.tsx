"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, LogOut, Brain, Trophy, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/auth/login")
    }

    const links = [
        { href: "/app/learning", label: "Learning", icon: BookOpen },
    ]

    return (
        <div className="hidden h-full w-64 flex-col border-r bg-card md:flex">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/app/learning" className="flex items-center gap-2 font-bold text-xl">
                    <Brain className="h-6 w-6 text-primary" />
                    <span>Tom's Brain</span>
                </Link>
            </div>
            <div className="flex-1 py-6 px-4">
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname.startsWith(link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        )
                    })}

                    <div className="pt-4 mt-4 border-t">
                        <p className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                            Your Progress
                        </p>
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground opacity-70 cursor-not-allowed">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            Achievements
                        </div>
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground opacity-70 cursor-not-allowed">
                            <Zap className="h-4 w-4 text-orange-500" />
                            Daily Streak: 0
                        </div>
                    </div>
                </nav>
            </div>
            <div className="border-t p-4">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
