export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type TopicStatus = 'idea' | 'planned' | 'in_progress' | 'completed';
export type CourseStatus = 'draft' | 'active' | 'archived';

export interface LearningTopic {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    context_area: string | null;
    difficulty: DifficultyLevel;
    priority: PriorityLevel;
    status: TopicStatus;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: string;
    learning_topic_id: string;
    title: string;
    short_summary: string | null;
    difficulty: DifficultyLevel | null;
    estimated_total_minutes: number | null;
    status: CourseStatus;
    source_prompt: string | null;
    created_at: string;
    updated_at: string;
}

export interface CourseModule {
    id: string;
    course_id: string;
    order_index: number;
    title: string;
    summary: string | null;
    created_at: string;
}

export interface CourseLesson {
    id: string;
    module_id: string;
    order_index: number;
    title: string;
    objective: string | null;
    key_points: string[] | null;
    estimated_minutes: number | null;
    practice_task: string | null;
    quiz_question: string | null;
    created_at: string;
}

export interface GeneratedCoursePayload {
    title: string;
    short_summary: string;
    difficulty: DifficultyLevel;
    estimated_total_minutes: number;
    modules: {
        title: string;
        summary: string;
        lessons: {
            title: string;
            objective: string;
            key_points: string[];
            estimated_minutes: number;
            practice_task: string;
            quiz_question: string;
        }[];
    }[];
}
