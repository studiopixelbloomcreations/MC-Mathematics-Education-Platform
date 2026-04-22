create extension if not exists "pgcrypto";

create table if not exists public.grades (
  grade integer primary key check (grade between 6 and 11),
  label text not null
);

insert into public.grades (grade, label)
values
  (6, 'Grade 6'),
  (7, 'Grade 7'),
  (8, 'Grade 8'),
  (9, 'Grade 9'),
  (10, 'Grade 10'),
  (11, 'Grade 11')
on conflict (grade) do nothing;

create table if not exists public.student_counters (
  grade integer not null references public.grades (grade) on delete cascade,
  enrollment_type text not null check (enrollment_type in ('theory', 'paper', 'both')),
  current_number integer not null default 1000,
  primary key (grade, enrollment_type)
);

create table if not exists public.users (
  user_id text primary key,
  student_id text unique,
  role text not null default 'student' check (role in ('student', 'admin')),
  full_name text,
  email text not null,
  grade integer references public.grades (grade),
  age integer check (age between 8 and 99),
  address text,
  phone_number text,
  whatsapp_number text,
  enrollment_type text check (enrollment_type in ('theory', 'paper', 'both')),
  avatar_url text,
  special_note text,
  parent_lock_password text,
  parent_lock_until timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  grade integer not null references public.grades (grade) on delete cascade,
  lesson_name text not null,
  status text not null check (status in ('completed', 'ongoing', 'upcoming')),
  completion_date date,
  order_index integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  grade integer not null references public.grades (grade) on delete cascade,
  title text not null,
  file_url text,
  status text not null check (status in ('completed', 'upcoming')),
  visible_from date,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  youtube_url text,
  external_url text,
  audience text not null default 'both' check (audience in ('public', 'students', 'both')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  class_date timestamptz not null,
  grade integer not null references public.grades (grade) on delete cascade,
  type text not null check (type in ('group', 'whole')),
  status text not null check (status in ('ongoing', 'completed', 'cancelled')),
  venue text,
  time_label text,
  end_time time,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.class_templates (
  id text primary key,
  class_name text not null,
  grade integer not null references public.grades (grade) on delete cascade,
  type text not null check (type in ('group', 'whole')),
  weekday integer not null check (weekday between 0 and 6),
  weekday_label text not null,
  start_time time not null,
  end_time time not null,
  time_label text not null,
  venue text,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.class_templates (id, class_name, grade, type, weekday, weekday_label, start_time, end_time, time_label, venue)
values
  ('g10-theory', 'Grade 10 Theory Class', 10, 'whole', 2, 'Tuesday', '17:30', '20:30', '5:30 PM - 8:30 PM', 'MC Campus'),
  ('g8-whole', 'Grade 8 Whole Class', 8, 'whole', 2, 'Tuesday', '14:30', '17:15', '2:30 PM - 5:15 PM', 'MC Campus'),
  ('g9-whole', 'Grade 9 Whole Class', 9, 'whole', 3, 'Wednesday', '14:30', '17:15', '2:30 PM - 5:15 PM', 'MC Campus'),
  ('g9-group', 'Grade 9 Group Class', 9, 'group', 3, 'Wednesday', '17:30', '20:30', '5:30 PM - 8:30 PM', 'MC Campus'),
  ('g7-whole', 'Grade 7 Whole Class', 7, 'whole', 4, 'Thursday', '14:30', '17:15', '2:30 PM - 5:15 PM', 'MC Campus'),
  ('g11-group', 'Grade 11 Group Class', 11, 'group', 4, 'Thursday', '17:30', '21:00', '5:30 PM - 9:00 PM', 'MC Campus'),
  ('g6-whole', 'Grade 6 Whole Class', 6, 'whole', 5, 'Friday', '14:30', '17:15', '2:30 PM - 5:15 PM', 'MC Campus'),
  ('g8-group', 'Grade 8 Group Class', 8, 'group', 5, 'Friday', '17:30', '19:30', '5:30 PM - 7:30 PM', 'MC Campus'),
  ('g11-whole', 'Grade 11 Whole Class', 11, 'whole', 6, 'Saturday', '07:30', '12:00', '7:30 AM - 12:00 PM', 'MC Campus'),
  ('g10-whole', 'Grade 10 Whole Class', 10, 'whole', 6, 'Saturday', '13:00', '17:00', '1:00 PM - 5:00 PM', 'MC Campus')
on conflict (id) do update
set
  class_name = excluded.class_name,
  grade = excluded.grade,
  type = excluded.type,
  weekday = excluded.weekday,
  weekday_label = excluded.weekday_label,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  time_label = excluded.time_label,
  venue = excluded.venue;

create table if not exists public.marks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users (user_id) on delete cascade,
  exam_name text not null,
  mark numeric(5,2) not null check (mark between 0 and 100),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.hall_of_fame (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('A/L', 'O/L')),
  student_name text not null,
  image_url text not null,
  achievement text not null,
  display_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  feedback text not null,
  rating integer check (rating between 1 and 5),
  grade integer references public.grades (grade),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  image_url text not null,
  bio text not null,
  display_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.generate_student_id(p_grade integer, p_enrollment text)
returns text
language plpgsql
security definer
as $$
declare
  next_number integer;
  prefix text;
begin
  if p_grade < 6 or p_grade > 11 then
    raise exception 'Invalid grade. Expected value between 6 and 11.';
  end if;

  if p_enrollment not in ('theory', 'paper', 'both') then
    raise exception 'Invalid enrollment type.';
  end if;

  insert into public.student_counters (grade, enrollment_type, current_number)
  values (p_grade, p_enrollment, 1000)
  on conflict (grade, enrollment_type)
  do update set current_number = public.student_counters.current_number + 1
  returning current_number into next_number;

  prefix := case
    when p_enrollment = 'theory' then 'TCN'
    when p_enrollment = 'paper' then 'PCN'
    else 'TPCN'
  end;

  return 'MCG' || p_grade || prefix || next_number;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.sync_monthly_classes(p_month date default timezone('utc', now())::date)
returns integer
language plpgsql
security definer
as $$
declare
  month_start date := date_trunc('month', p_month)::date;
  month_end date := (date_trunc('month', p_month) + interval '1 month')::date;
  inserted_rows integer := 0;
begin
  insert into public.classes (class_name, class_date, grade, type, status, venue, time_label, end_time)
  select
    template.class_name,
    make_timestamptz(
      extract(year from schedule.day)::integer,
      extract(month from schedule.day)::integer,
      extract(day from schedule.day)::integer,
      extract(hour from template.start_time)::integer,
      extract(minute from template.start_time)::integer,
      0,
      'Asia/Colombo'
    ),
    template.grade,
    template.type,
    'ongoing',
    template.venue,
    template.time_label,
    template.end_time
  from public.class_templates as template
  join generate_series(month_start, month_end - interval '1 day', interval '1 day') as schedule(day)
    on extract(dow from schedule.day) = template.weekday
  on conflict (class_name, grade, type, class_date)
  do update set
    venue = excluded.venue,
    time_label = excluded.time_label,
    end_time = excluded.end_time;

  get diagnostics inserted_rows = row_count;
  return inserted_rows;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute procedure public.set_updated_at();

alter table public.classes
add column if not exists end_time time;

update public.classes
set status = 'ongoing'
where status = 'scheduled';

alter table public.classes
drop constraint if exists classes_status_check;

alter table public.classes
add constraint classes_status_check
check (status in ('ongoing', 'completed', 'cancelled'));

update public.lessons
set status = 'upcoming'
where status = 'not_started';

alter table public.lessons
drop constraint if exists lessons_status_check;

alter table public.lessons
add constraint lessons_status_check
check (status in ('completed', 'ongoing', 'upcoming'));

create unique index if not exists classes_unique_schedule_idx
on public.classes (class_name, grade, type, class_date);

update public.classes as class_item
set end_time = template.end_time
from public.class_templates as template
where class_item.end_time is null
  and class_item.class_name = template.class_name
  and class_item.grade = template.grade
  and class_item.type = template.type;

alter table public.users enable row level security;
alter table public.lessons enable row level security;
alter table public.papers enable row level security;
alter table public.announcements enable row level security;
alter table public.classes enable row level security;
alter table public.class_templates enable row level security;
alter table public.marks enable row level security;
alter table public.hall_of_fame enable row level security;
alter table public.feedback enable row level security;
alter table public.team_members enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where user_id = auth.jwt() ->> 'sub'
      and role = 'admin'
  );
$$;

drop policy if exists "Users can read self" on public.users;
create policy "Users can read self"
on public.users
for select
using (
  user_id = auth.jwt() ->> 'sub'
  or public.is_admin()
);

drop policy if exists "Users can insert self" on public.users;
create policy "Users can insert self"
on public.users
for insert
with check (
  user_id = auth.jwt() ->> 'sub'
  or public.is_admin()
);

drop policy if exists "Users can update self" on public.users;
create policy "Users can update self"
on public.users
for update
using (
  user_id = auth.jwt() ->> 'sub'
  or public.is_admin()
)
with check (
  user_id = auth.jwt() ->> 'sub'
  or public.is_admin()
);

drop policy if exists "Students can read lessons" on public.lessons;
create policy "Students can read lessons"
on public.lessons
for select
using (true);

drop policy if exists "Admins manage lessons" on public.lessons;
create policy "Admins manage lessons"
on public.lessons
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students can read papers" on public.papers;
create policy "Students can read papers"
on public.papers
for select
using (true);

drop policy if exists "Admins manage papers" on public.papers;
create policy "Admins manage papers"
on public.papers
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students can read announcements" on public.announcements;
create policy "Students can read announcements"
on public.announcements
for select
using (true);

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
on public.announcements
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students can read classes" on public.classes;
create policy "Students can read classes"
on public.classes
for select
using (true);

drop policy if exists "Admins manage classes" on public.classes;
create policy "Admins manage classes"
on public.classes
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read class templates" on public.class_templates;
create policy "Public can read class templates"
on public.class_templates
for select
using (true);

drop policy if exists "Admins manage class templates" on public.class_templates;
create policy "Admins manage class templates"
on public.class_templates
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students can read own marks" on public.marks;
create policy "Students can read own marks"
on public.marks
for select
using (
  user_id = auth.jwt() ->> 'sub'
  or public.is_admin()
);

drop policy if exists "Admins manage marks" on public.marks;
create policy "Admins manage marks"
on public.marks
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read hall of fame" on public.hall_of_fame;
create policy "Public can read hall of fame"
on public.hall_of_fame
for select
using (true);

drop policy if exists "Admins manage hall of fame" on public.hall_of_fame;
create policy "Admins manage hall of fame"
on public.hall_of_fame
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read feedback" on public.feedback;
create policy "Public can read feedback"
on public.feedback
for select
using (true);

drop policy if exists "Admins manage feedback" on public.feedback;
create policy "Admins manage feedback"
on public.feedback
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read team members" on public.team_members;
create policy "Public can read team members"
on public.team_members
for select
using (true);

drop policy if exists "Admins manage team members" on public.team_members;
create policy "Admins manage team members"
on public.team_members
for all
using (public.is_admin())
with check (public.is_admin());
