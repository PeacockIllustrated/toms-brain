import { createClient } from "@/lib/supabase/server"
import { AddTopicModal } from "@/components/learning/add-topic-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function LearningPage() {
    const supabase = await createClient()
    const { data: topics } = await supabase
        .from("learning_topics")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Learning Topics</h1>
                    <p className="text-muted-foreground">
                        Manage your learning goals and generate AI courses.
                    </p>
                </div>
                <AddTopicModal />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topics?.map((topic) => (
                    <Link key={topic.id} href={`/app/learning/topics/${topic.id}`}>
                        <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">{topic.title}</CardTitle>
                                        {topic.context_area && (
                                            <span className="text-xs text-muted-foreground">
                                                {topic.context_area}
                                            </span>
                                        )}
                                    </div>
                                    <Badge variant={topic.status === "completed" ? "default" : "secondary"}>
                                        {topic.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {topic.description || "No description provided."}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        {topic.difficulty}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {topic.priority} priority
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {topics?.length === 0 && (
                    <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        <p>No topics yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
