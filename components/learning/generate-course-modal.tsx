"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Upload, FileJson } from "lucide-react"
import { LearningTopic, GeneratedCoursePayload } from "@/types/learning"
import { createClient } from "@/lib/supabase/client"

interface GenerateCourseModalProps {
    topic: LearningTopic
}

export function GenerateCourseModal({ topic }: GenerateCourseModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("guided")
    const router = useRouter()
    const supabase = createClient()

    const defaultPrompt = `Create a practical course that teaches me how to use ${topic.title}${topic.context_area ? ` in the context of ${topic.context_area}` : ""
        }. Focus on real-world workflows and what I actually need to build.`

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const prompt = formData.get("prompt") as string
        const difficulty = formData.get("difficulty") as string

        try {
            const res = await fetch("/api/generate-course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    learningTopicId: topic.id,
                    prompt,
                    difficulty,
                }),
            })

            if (!res.ok) {
                throw new Error("Failed to generate course")
            }

            const data = await res.json()
            setOpen(false)
            router.refresh()
            if (data.courseId) {
                router.push(`/app/courses/${data.courseId}`)
            }
        } catch (error) {
            console.error(error)
            alert("Failed to generate course. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const jsonString = formData.get("json") as string

        try {
            let payload: GeneratedCoursePayload
            try {
                payload = JSON.parse(jsonString)
            } catch {
                throw new Error("Invalid JSON format")
            }

            // Validate basic structure
            if (!payload.title || !payload.modules) {
                throw new Error("JSON missing required fields (title, modules)")
            }

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Unauthorized")

            // Insert Course
            const { data: course, error: courseError } = await supabase
                .from("courses")
                .insert({
                    learning_topic_id: topic.id,
                    title: payload.title,
                    short_summary: payload.short_summary,
                    difficulty: payload.difficulty || "basic",
                    estimated_total_minutes: payload.estimated_total_minutes || 0,
                    status: "active",
                    source_prompt: "Imported from JSON",
                })
                .select()
                .single()

            if (courseError) throw courseError

            // Insert Modules & Lessons
            for (const [mIndex, module] of payload.modules.entries()) {
                const { data: moduleData, error: moduleError } = await supabase
                    .from("course_modules")
                    .insert({
                        course_id: course.id,
                        order_index: mIndex,
                        title: module.title,
                        summary: module.summary,
                    })
                    .select()
                    .single()

                if (moduleError) {
                    console.error("Module insert error:", moduleError)
                    throw moduleError
                }

                if (module.lessons && module.lessons.length > 0) {
                    const lessonsToInsert = module.lessons.map((lesson, lIndex) => ({
                        module_id: moduleData.id,
                        order_index: lIndex,
                        title: lesson.title,
                        objective: lesson.objective,
                        key_points: lesson.key_points,
                        estimated_minutes: lesson.estimated_minutes,
                        practice_task: lesson.practice_task,
                        quiz_question: lesson.quiz_question,
                    }))
                    const { error: lessonError } = await supabase.from("course_lessons").insert(lessonsToInsert)
                    if (lessonError) {
                        console.error("Lesson insert error:", lessonError)
                        throw lessonError
                    }
                }
            }

            setOpen(false)
            router.refresh()
            router.push(`/app/courses/${course.id}`)
        } catch (error: any) {
            console.error(error)
            alert(`Import failed: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Course
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create Course</DialogTitle>
                    <DialogDescription>
                        Generate a course using AI or import an existing structure.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="guided">Guided</TabsTrigger>
                        <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
                        <TabsTrigger value="import">Import JSON</TabsTrigger>
                    </TabsList>

                    <TabsContent value="guided">
                        <form onSubmit={handleGenerate} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="prompt-guided" className="text-sm font-medium">
                                    Refine Prompt (Optional)
                                </label>
                                <textarea
                                    id="prompt-guided"
                                    name="prompt"
                                    defaultValue={defaultPrompt}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="difficulty-guided" className="text-sm font-medium">
                                    Difficulty
                                </label>
                                <select
                                    id="difficulty-guided"
                                    name="difficulty"
                                    defaultValue={topic.difficulty}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="basic">Basic</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate with AI"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="custom">
                        <form onSubmit={handleGenerate} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="prompt-custom" className="text-sm font-medium">
                                    Custom Prompt
                                </label>
                                <textarea
                                    id="prompt-custom"
                                    name="prompt"
                                    placeholder="Paste your full prompt here. We will automatically format the output."
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <input type="hidden" name="difficulty" value={topic.difficulty} />
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate from Prompt"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="import">
                        <div className="space-y-4 py-4">
                            <div className="rounded-md bg-muted p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="text-sm font-medium">1. Copy Prompt Structure</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => {
                                            const snippet = `Create a course about "${topic.title}" returning ONLY valid JSON with this structure:
{
  "title": "string",
  "short_summary": "string",
  "difficulty": "basic" | "intermediate" | "advanced",
  "estimated_total_minutes": number,
  "modules": [
    {
      "title": "string",
      "summary": "string",
      "lessons": [
        {
          "title": "string",
          "objective": "string",
          "key_points": ["string"],
          "estimated_minutes": number,
          "practice_task": "string",
          "quiz_question": "string"
        }
      ]
    }
  ]
}`
                                            navigator.clipboard.writeText(snippet)
                                            alert("Prompt copied to clipboard!")
                                        }}
                                    >
                                        <Sparkles className="mr-2 h-3 w-3" />
                                        Copy Prompt
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Paste this into ChatGPT/Claude to generate the JSON.
                                </p>
                            </div>

                            <form onSubmit={handleImport} className="space-y-4">
                                <div className="grid gap-2">
                                    <label htmlFor="json-import" className="text-sm font-medium">
                                        2. Paste JSON Response
                                    </label>
                                    <textarea
                                        id="json-import"
                                        name="json"
                                        placeholder='{ "title": "...", "modules": [...] }'
                                        className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={loading} variant="secondary">
                                        {loading ? (
                                            "Importing..."
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Import Course
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
