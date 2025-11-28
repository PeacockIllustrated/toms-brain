import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { COURSE_SYSTEM_PROMPT } from "@/lib/ai/courseSystemPrompt"
import { GeneratedCoursePayload } from "@/types/learning"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await request.json()
        const { learningTopicId, prompt, difficulty } = body

        if (!learningTopicId || !prompt || !difficulty) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Verify topic ownership
        const { data: topic } = await supabase
            .from("learning_topics")
            .select("*")
            .eq("id", learningTopicId)
            .eq("user_id", user.id)
            .single()

        if (!topic) {
            return new NextResponse("Topic not found or unauthorized", { status: 404 })
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-4-turbo
            messages: [
                { role: "system", content: COURSE_SYSTEM_PROMPT },
                {
                    role: "user",
                    content: JSON.stringify({
                        topicTitle: topic.title,
                        topicDescription: topic.description,
                        contextArea: topic.context_area,
                        difficulty,
                        userPrompt: prompt,
                    }),
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        })

        const content = completion.choices[0].message.content
        if (!content) {
            throw new Error("No content received from AI")
        }

        const coursePayload: GeneratedCoursePayload = JSON.parse(content)

        // Insert Course
        const { data: course, error: courseError } = await supabase
            .from("courses")
            .insert({
                learning_topic_id: topic.id,
                title: coursePayload.title,
                short_summary: coursePayload.short_summary,
                difficulty: coursePayload.difficulty,
                estimated_total_minutes: coursePayload.estimated_total_minutes,
                status: "active",
                source_prompt: prompt,
            })
            .select()
            .single()

        if (courseError || !course) {
            throw new Error("Failed to insert course")
        }

        // Insert Modules
        for (const [mIndex, module] of coursePayload.modules.entries()) {
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

            if (moduleError || !moduleData) continue

            // Insert Lessons
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

            await supabase.from("course_lessons").insert(lessonsToInsert)
        }

        return NextResponse.json({ courseId: course.id })
    } catch (error) {
        console.error("Course generation error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
