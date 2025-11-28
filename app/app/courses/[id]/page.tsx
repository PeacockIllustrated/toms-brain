import { createClient } from "@/lib/supabase/server"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, HelpCircle, PenTool, Trophy } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function CoursePage({ params }: PageProps) {
    const supabase = await createClient()
    const { id } = await params

    const { data: course } = await supabase
        .from("courses")
        .select(`
      *,
      modules:course_modules(
        *,
        lessons:course_lessons(*)
      )
    `)
        .eq("id", id)
        .single()

    if (!course) {
        notFound()
    }

    const modules = course.modules?.sort((a: any, b: any) => a.order_index - b.order_index)
    modules?.forEach((m: any) => {
        m.lessons?.sort((a: any, b: any) => a.order_index - b.order_index)
    })

    // Calculate fake progress for demo
    const totalLessons = modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0
    const completedLessons = 0 // TODO: Implement tracking
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    return (
        <div className="space-y-8 pb-20">
            <div>
                <Link
                    href={`/app/learning/topics/${course.learning_topic_id}`}
                    className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Topic
                </Link>
                <div className="space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{course.title}</h1>
                        <Badge variant="outline" className="w-fit">{course.difficulty}</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">{course.short_summary}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {course.estimated_total_minutes} mins
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            {modules?.length} Modules
                        </div>
                        <div className="flex items-center gap-1.5 text-primary font-medium">
                            <Trophy className="h-4 w-4" />
                            0 XP Earned
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                            <span>Course Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {modules?.map((module: any, index: number) => (
                    <Card key={module.id} className="overflow-hidden border-none shadow-md ring-1 ring-border/50">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                                    {index + 1}
                                </span>
                                {module.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground pl-11">
                                {module.summary}
                            </p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Accordion type="single" collapsible className="w-full">
                                {module.lessons?.map((lesson: any, lIndex: number) => (
                                    <AccordionItem key={lesson.id} value={lesson.id} className="px-4 md:px-6 border-b-0 [&:not(:last-child)]:border-b">
                                        <AccordionTrigger className="hover:no-underline py-5">
                                            <div className="flex flex-col items-start text-left gap-1">
                                                <span className="text-base font-semibold text-foreground/90">
                                                    {lesson.title}
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                                    {lesson.estimated_minutes} min
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-6 pt-2 pb-6">
                                            <div className="rounded-xl bg-primary/5 p-5 border border-primary/10">
                                                <h4 className="mb-2 font-bold text-primary flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Objective
                                                </h4>
                                                <p className="text-foreground/80 leading-relaxed">{lesson.objective}</p>
                                            </div>

                                            <div>
                                                <h4 className="mb-3 font-bold text-foreground/90">Key Points</h4>
                                                <ul className="grid gap-2">
                                                    {lesson.key_points?.map((point: string, i: number) => (
                                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                                                            <span className="leading-relaxed">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {lesson.practice_task && (
                                                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                                                    <div className="mb-2 flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400">
                                                        <PenTool className="h-4 w-4" />
                                                        Practice Task
                                                    </div>
                                                    <p className="text-sm text-foreground/80 leading-relaxed">{lesson.practice_task}</p>
                                                </div>
                                            )}

                                            {lesson.quiz_question && (
                                                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/30 dark:bg-amber-900/10">
                                                    <div className="mb-2 flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
                                                        <HelpCircle className="h-4 w-4" />
                                                        Quiz Question
                                                    </div>
                                                    <p className="text-sm italic text-foreground/80">{lesson.quiz_question}</p>
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
