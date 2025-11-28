"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, LogOut, Menu, Brain, Trophy, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/auth/login")
        setOpen(false)
    }

    const links = [
        { href: "/app/learning", label: "Learning", icon: BookOpen },
        // Placeholder gamification links
        { href: "#", label: "Achievements", icon: Trophy, disabled: true },
        { href: "#", label: "Daily Streak", icon: Zap, disabled: true },
    ]

    return (
        <div className="flex items-center gap-4 md:hidden">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[300px] sm:w-[400px] h-full rounded-none border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed left-0 top-0 z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out duration-300">
                    <DialogHeader className="text-left">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Brain className="h-6 w-6 text-primary" />
                            Tom's Brain
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col justify-between h-full pb-6">
                        <nav className="grid gap-2 py-6">
                            {links.map((link) => {
                                const Icon = link.icon
                                const isActive = pathname.startsWith(link.href)
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => !link.disabled && setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-accent hover:text-accent-foreground",
                                            link.disabled && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </nav>
                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="justify-start gap-3"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
