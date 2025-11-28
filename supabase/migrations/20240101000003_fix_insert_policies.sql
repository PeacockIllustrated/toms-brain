-- Drop potentially incorrect policies
drop policy if exists "Users can insert own modules" on public.course_modules;
drop policy if exists "Users can insert own lessons" on public.course_lessons;

-- Re-create with explicit column references
create policy "Users can insert own modules" on public.course_modules
  for insert with check (
    exists (
      select 1 from public.courses
      join public.learning_topics on learning_topics.id = courses.learning_topic_id
      where courses.id = course_id
      and learning_topics.user_id = auth.uid()
    )
  );

create policy "Users can insert own lessons" on public.course_lessons
  for insert with check (
    exists (
      select 1 from public.course_modules
      join public.courses on courses.id = course_modules.course_id
      join public.learning_topics on learning_topics.id = courses.learning_topic_id
      where course_modules.id = module_id
      and learning_topics.user_id = auth.uid()
    )
  );
