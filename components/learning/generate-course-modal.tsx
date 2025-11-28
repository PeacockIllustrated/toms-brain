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
import { Sparkles } from "lucide-react"
import { LearningTopic } from "@/types/learning"

interface GenerateCourseModalProps {
    topic: LearningTopic
}

export function GenerateCourseModal({ topic }: GenerateCourseModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            // Optional: Redirect to the new course
            if (data.courseId) {
                router.push(`/app/courses/${data.courseId}`)
            }
        } catch (error) {
            console.error(error)
            // TODO: Show error toast
        } finally {
            setLoading(false)
        }
    }

    const defaultPrompt = `Create a practical course that teaches me how to use ${topic.title}${topic.context_area ? ` in the context of ${topic.context_area}` : ""
        }. Focus on real-world workflows and what I actually need to build.`

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Course
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Generate AI Course</DialogTitle>
                        <DialogDescription>
                            Create a structured course using AI based on your requirements.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="prompt" className="text-sm font-medium">
                                Prompt
                            </label>
                            <textarea
                                id="prompt"
                                name="prompt"
                                defaultValue={defaultPrompt}
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="difficulty" className="text-sm font-medium">
                                Difficulty
                            </label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                defaultValue={topic.difficulty}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="basic">Basic</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate Course"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
