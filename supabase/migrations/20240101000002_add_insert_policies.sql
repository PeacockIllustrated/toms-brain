-- Add INSERT policy for course_modules
create policy "Users can insert own modules" on public.course_modules
  for insert with check (
    exists (
      select 1 from public.courses
      join public.learning_topics on learning_topics.id = courses.learning_topic_id
      where courses.id = course_modules.course_id
      and learning_topics.user_id = auth.uid()
    )
  );

-- Add INSERT policy for course_lessons
create policy "Users can insert own lessons" on public.course_lessons
  for insert with check (
    exists (
      select 1 from public.course_modules
      join public.courses on courses.id = course_modules.course_id
      join public.learning_topics on learning_topics.id = courses.learning_topic_id
      where course_modules.id = course_lessons.module_id
      and learning_topics.user_id = auth.uid()
    )
  );
