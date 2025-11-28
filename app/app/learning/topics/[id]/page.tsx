import { createClient } from "@/lib/supabase/server"
import { GenerateCourseModal } from "@/components/learning/generate-course-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
    params: {
        id: string
    }
}

export default async function TopicPage({ params }: PageProps) {
    const supabase = await createClient()

    // Fetch topic
    const { data: topic } = await supabase
        .from("learning_topics")
        .select("*")
        .eq("id", params.id)
        .single()

    if (!topic) {
        notFound()
    }

    // Fetch courses
    const { data: courses } = await supabase
        .from("courses")
        .select("*, course_modules(count), course_lessons(count)") // Note: simple count might need adjustment depending on schema relation, but let's try standard count
        // Actually, Supabase count on related tables via select is tricky without proper setup. 
        // Let's just fetch courses and we can fetch counts separately or just show basic info for now.
        // Better: .select("*, modules:course_modules(count)") if relation is named.
        // Let's stick to simple select for now and maybe just show static or fetch properly.
        .eq("learning_topic_id", topic.id)
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-8">
            <div>
                <Link
                    href="/app/learning"
                    className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Topics
                </Link>
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{topic.context_area}</Badge>
                            <Badge variant="outline">{topic.difficulty}</Badge>
                            <Badge variant="outline">{topic.priority} priority</Badge>
                            <Badge>{topic.status}</Badge>
                        </div>
                        {topic.description && (
                            <p className="max-w-2xl text-muted-foreground">
                                {topic.description}
                            </p>
                        )}
                    </div>
                    <GenerateCourseModal topic={topic} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Courses</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {courses?.map((course) => (
                        <Link key={course.id} href={`/app/courses/${course.id}`}>
                            <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg">{course.title}</CardTitle>
                                        <Badge variant={course.status === "active" ? "default" : "secondary"}>
                                            {course.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {course.short_summary}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {course.estimated_total_minutes} mins
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            {/* Placeholder for module count until we do a proper join/count */}
                                            View Content
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {courses?.length === 0 && (
                        <div className="col-span-full flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                            <p>No courses generated yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
