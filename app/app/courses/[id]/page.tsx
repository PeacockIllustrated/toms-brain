import { createClient } from "@/lib/supabase/server"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, HelpCircle, PenTool } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
    params: {
        id: string
    }
}

export default async function CoursePage({ params }: PageProps) {
    const supabase = await createClient()

    // Fetch course with modules and lessons
    const { data: course } = await supabase
        .from("courses")
        .select(`
      *,
      modules:course_modules(
        *,
        lessons:course_lessons(*)
      )
    `)
        .eq("id", params.id)
        .single()

    if (!course) {
        notFound()
    }

    // Sort modules and lessons by order_index
    const modules = course.modules?.sort((a: any, b: any) => a.order_index - b.order_index)
    modules?.forEach((m: any) => {
        m.lessons?.sort((a: any, b: any) => a.order_index - b.order_index)
    })

    return (
        <div className="space-y-8 pb-20">
            <div>
                <Link
                    href={`/app/learning/topics/${course.learning_topic_id}`}
                    className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Topic
                </Link>
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                        <Badge variant="outline">{course.difficulty}</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground">{course.short_summary}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.estimated_total_minutes} mins total
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            {modules?.length} Modules
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {modules?.map((module: any, index: number) => (
                    <Card key={module.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    {index + 1}
                                </span>
                                {module.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground pl-10">
                                {module.summary}
                            </p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Accordion type="single" collapsible className="w-full">
                                {module.lessons?.map((lesson: any, lIndex: number) => (
                                    <AccordionItem key={lesson.id} value={lesson.id} className="px-6">
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex flex-col items-start text-left">
                                                <span className="text-base font-semibold">
                                                    {lesson.title}
                                                </span>
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    {lesson.estimated_minutes} mins
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-6 pt-2">
                                            <div className="rounded-lg bg-muted/30 p-4">
                                                <h4 className="mb-2 font-semibold text-primary">Objective</h4>
                                                <p>{lesson.objective}</p>
                                            </div>

                                            <div>
                                                <h4 className="mb-2 font-semibold">Key Points</h4>
                                                <ul className="list-disc space-y-1 pl-5">
                                                    {lesson.key_points?.map((point: string, i: number) => (
                                                        <li key={i}>{point}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {lesson.practice_task && (
                                                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                                                    <div className="mb-2 flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-400">
                                                        <PenTool className="h-4 w-4" />
                                                        Practice Task
                                                    </div>
                                                    <p className="text-sm">{lesson.practice_task}</p>
                                                </div>
                                            )}

                                            {lesson.quiz_question && (
                                                <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                                                    <div className="mb-2 flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
                                                        <HelpCircle className="h-4 w-4" />
                                                        Quiz Question
                                                    </div>
                                                    <p className="text-sm italic">{lesson.quiz_question}</p>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
