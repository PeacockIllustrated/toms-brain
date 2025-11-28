import { Sidebar } from "@/components/sidebar"

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-background">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="container mx-auto max-w-5xl p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
