import type { User as FirebaseUser } from 'firebase/auth'
import { buildMonthlyClasses, getClassTemplateById, getMonthRange, getMonthValue } from '../data/classes'
import {
  fallbackAdminData,
  fallbackDashboardData,
  fallbackLandingData,
  fallbackProfile,
} from '../data/fallback'
import type {
  AdminData,
  Announcement,
  DashboardData,
  EnrollmentType,
  FeedbackEntry,
  HallOfFameEntry,
  LandingPageData,
  Lesson,
  ManagedClass,
  MarkEntry,
  Paper,
  TeamMember,
  UserProfile,
} from '../types/models'
import { hasSupabaseConfig, supabase } from './supabase'

type UserProfileUpdate = Partial<
  Omit<UserProfile, 'user_id' | 'role' | 'email'> & { email?: string; role?: UserProfile['role'] }
>

async function requireTable<T>(promise: PromiseLike<{ data: T | null; error: Error | null }>, fallback: T) {
  try {
    const { data, error } = await promise
    if (error || !data) return fallback
    return data
  } catch {
    return fallback
  }
}

function withFallbackIfEmpty<T>(data: T[], fallback: T[]) {
  return data.length ? data : fallback
}

type DatabaseClassStatus = ManagedClass['status'] | 'scheduled'
type DatabaseLessonStatus = Lesson['status'] | 'not_started'

function normalizeClassStatus(status: DatabaseClassStatus): ManagedClass['status'] {
  if (status === 'scheduled') return 'ongoing'
  return status
}

function normalizeLessonStatus(status: DatabaseLessonStatus): Lesson['status'] {
  if (status === 'not_started') return 'upcoming'
  return status
}

function normalizeManagedClass(item: ManagedClass | (Omit<ManagedClass, 'status'> & { status: DatabaseClassStatus })) {
  return {
    ...item,
    status: normalizeClassStatus(item.status),
  } as ManagedClass
}

function normalizeManagedClasses(
  items: Array<ManagedClass | (Omit<ManagedClass, 'status'> & { status: DatabaseClassStatus })>,
) {
  return items.map((item) => normalizeManagedClass(item))
}

function normalizeLesson(item: Lesson | (Omit<Lesson, 'status'> & { status: DatabaseLessonStatus })) {
  return {
    ...item,
    status: normalizeLessonStatus(item.status),
  } as Lesson
}

function normalizeLessons(items: Array<Lesson | (Omit<Lesson, 'status'> & { status: DatabaseLessonStatus })>) {
  return items.map((item) => normalizeLesson(item))
}

async function syncMonthlyClasses(monthValue = getMonthValue()) {
  if (!hasSupabaseConfig || !supabase) return

  const { error } = await supabase.rpc('sync_monthly_classes', {
    p_month: `${monthValue}-01`,
  })

  if (error) {
    const functionMissing =
      error.message.toLowerCase().includes('function') ||
      error.message.toLowerCase().includes('does not exist')

    if (!functionMissing) throw error
  }
}

async function insertClassesWithCompatibility(classes: Array<Omit<ManagedClass, 'id'>>) {
  if (!supabase) return []

  const { data, error } = await supabase.from('classes').insert(classes).select('*')
  if (!error) {
    return normalizeManagedClasses((data ?? []) as Array<ManagedClass & { status: DatabaseClassStatus }>)
  }

  const shouldRetryWithScheduled =
    classes.some((item) => item.status === 'ongoing') &&
    (error.message.toLowerCase().includes('scheduled') ||
      error.message.toLowerCase().includes('status') ||
      error.code === '23514')

  if (!shouldRetryWithScheduled) throw error

  const legacyPayload = classes.map((item) => ({
    ...item,
    status: item.status === 'ongoing' ? 'scheduled' : item.status,
  }))

  const { data: legacyData, error: legacyError } = await supabase.from('classes').insert(legacyPayload).select('*')
  if (legacyError) throw legacyError

  return normalizeManagedClasses((legacyData ?? []) as Array<ManagedClass & { status: DatabaseClassStatus }>)
}

async function updateClassStatusWithCompatibility(classId: string, status: ManagedClass['status']) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('classes')
    .update({ status })
    .eq('id', classId)
    .select('*')
    .single()

  if (!error && data) {
    return normalizeManagedClass(data as ManagedClass & { status: DatabaseClassStatus })
  }

  const canRetryWithScheduled =
    status === 'ongoing' &&
    error &&
    (error.message.toLowerCase().includes('scheduled') ||
      error.message.toLowerCase().includes('status') ||
      error.code === '23514')

  if (canRetryWithScheduled) {
    const { data: legacyData, error: legacyError } = await supabase
      .from('classes')
      .update({ status: 'scheduled' })
      .eq('id', classId)
      .select('*')
      .single()

    if (legacyError) throw legacyError
    return normalizeManagedClass(legacyData as ManagedClass & { status: DatabaseClassStatus })
  }

  if (status === 'completed' && error?.code === '23514') {
    throw new Error('The database still uses the old class status rules. Please run the updated Supabase schema before using completed status.')
  }

  if (error) throw error
  return null
}

export async function fetchLandingPageData(): Promise<LandingPageData> {
  if (!hasSupabaseConfig || !supabase) return fallbackLandingData

  try {
    await syncMonthlyClasses()
  } catch (error) {
    console.warn('Monthly class sync skipped for landing data.', error)
  }

  const [announcements, classes, hallOfFame, feedback, teamMembers] = await Promise.all([
    requireTable(
      supabase
        .from('announcements')
        .select('*')
        .in('audience', ['public', 'both'])
        .order('created_at', { ascending: false }),
      fallbackLandingData.announcements,
    ),
    requireTable(
      supabase.from('classes').select('*').order('class_date', { ascending: true }),
      fallbackLandingData.classes,
    ),
    requireTable(
      supabase.from('hall_of_fame').select('*').order('display_order', { ascending: true }),
      fallbackLandingData.hallOfFame,
    ),
    requireTable(
      supabase.from('feedback').select('*'),
      fallbackLandingData.feedback,
    ),
    requireTable(
      supabase.from('team_members').select('*'),
      fallbackLandingData.teamMembers,
    ),
  ])

  return {
    announcements: withFallbackIfEmpty(
      announcements as Announcement[],
      fallbackLandingData.announcements,
    ),
    classes: withFallbackIfEmpty(
      normalizeManagedClasses(classes as Array<ManagedClass & { status: DatabaseClassStatus }>),
      fallbackLandingData.classes,
    ),
    hallOfFame: withFallbackIfEmpty(
      hallOfFame as HallOfFameEntry[],
      fallbackLandingData.hallOfFame,
    ),
    feedback: withFallbackIfEmpty(feedback as FeedbackEntry[], fallbackLandingData.feedback),
    teamMembers: withFallbackIfEmpty(
      teamMembers as TeamMember[],
      fallbackLandingData.teamMembers,
    ),
  }
}

export async function syncFirebaseUser(firebaseUser: FirebaseUser): Promise<UserProfile> {
  if (!hasSupabaseConfig || !supabase) {
    return {
      ...fallbackProfile,
      user_id: firebaseUser.uid,
      email: firebaseUser.email ?? fallbackProfile.email,
      full_name: firebaseUser.displayName ?? fallbackProfile.full_name,
      avatar_url: firebaseUser.photoURL,
    }
  }

  const payload = {
    user_id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    full_name: firebaseUser.displayName,
    avatar_url: firebaseUser.photoURL,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single()

  if (error || !data) {
    return {
      ...fallbackProfile,
      user_id: firebaseUser.uid,
      email: firebaseUser.email ?? fallbackProfile.email,
      full_name: firebaseUser.displayName ?? fallbackProfile.full_name,
      avatar_url: firebaseUser.photoURL,
    }
  }

  return data as UserProfile
}

export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  if (!hasSupabaseConfig || !supabase) return fallbackDashboardData

  try {
    await syncMonthlyClasses()
  } catch (error) {
    console.warn('Monthly class sync skipped for dashboard data.', error)
  }

  const profile = await requireTable(
    supabase.from('users').select('*').eq('user_id', userId).single(),
    fallbackDashboardData.profile,
  )

  const grade = (profile as UserProfile).grade ?? fallbackDashboardData.profile.grade ?? 8
  const [marks, classes, announcements, lessons, papers] = await Promise.all([
    requireTable(
      supabase.from('marks').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      fallbackDashboardData.marks,
    ),
    requireTable(
      supabase.from('classes').select('*').eq('grade', grade).order('class_date', { ascending: true }),
      fallbackDashboardData.classes,
    ),
    requireTable(
      supabase
        .from('announcements')
        .select('*')
        .in('audience', ['students', 'both'])
        .order('created_at', { ascending: false }),
      fallbackDashboardData.announcements,
    ),
    requireTable(
      supabase.from('lessons').select('*').eq('grade', grade).order('order_index', { ascending: true }),
      fallbackDashboardData.lessons,
    ),
    requireTable(
      supabase.from('papers').select('*').eq('grade', grade).order('visible_from', { ascending: true }),
      fallbackDashboardData.papers,
    ),
  ])

  return {
    profile: profile as UserProfile,
    marks: marks as MarkEntry[],
    classes: normalizeManagedClasses(classes as Array<ManagedClass & { status: DatabaseClassStatus }>),
    announcements: announcements as Announcement[],
    lessons: normalizeLessons(lessons as Array<Lesson & { status: DatabaseLessonStatus }>),
    papers: papers as Paper[],
  }
}

export async function fetchAdminData(): Promise<AdminData> {
  if (!hasSupabaseConfig || !supabase) return fallbackAdminData

  try {
    await syncMonthlyClasses()
  } catch (error) {
    console.warn('Monthly class sync skipped for admin data.', error)
  }

  const [users, lessons, papers, announcements, classes, hallOfFame, feedback, teamMembers] = await Promise.all([
    requireTable(supabase.from('users').select('*').order('created_at', { ascending: false }), fallbackAdminData.users),
    requireTable(supabase.from('lessons').select('*').order('grade').order('order_index'), fallbackAdminData.lessons),
    requireTable(supabase.from('papers').select('*').order('grade').order('visible_from'), fallbackAdminData.papers),
    requireTable(supabase.from('announcements').select('*').order('created_at', { ascending: false }), fallbackAdminData.announcements),
    requireTable(supabase.from('classes').select('*').order('class_date'), fallbackAdminData.classes),
    requireTable(supabase.from('hall_of_fame').select('*').order('display_order'), fallbackAdminData.hallOfFame),
    requireTable(supabase.from('feedback').select('*'), fallbackAdminData.feedback),
    requireTable(supabase.from('team_members').select('*'), fallbackAdminData.teamMembers),
  ])

  return {
    users: users as UserProfile[],
    lessons: normalizeLessons(lessons as Array<Lesson & { status: DatabaseLessonStatus }>),
    papers: papers as Paper[],
    announcements: announcements as Announcement[],
    classes: normalizeManagedClasses(classes as Array<ManagedClass & { status: DatabaseClassStatus }>),
    hallOfFame: hallOfFame as HallOfFameEntry[],
    feedback: feedback as FeedbackEntry[],
    teamMembers: teamMembers as TeamMember[],
  }
}

export async function saveUserProfile(userId: string, updates: UserProfileUpdate) {
  if (!hasSupabaseConfig || !supabase) {
    return { ...fallbackProfile, user_id: userId, ...updates } as UserProfile
  }

  const normalized = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('users')
    .update(normalized)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (!error && data) return data as UserProfile

  const { data: fallbackUpdate } = await supabase
    .from('users')
    .upsert({ user_id: userId, ...normalized }, { onConflict: 'user_id' })
    .select('*')
    .single()

  return (fallbackUpdate as UserProfile) ?? ({ ...fallbackProfile, user_id: userId, ...updates } as UserProfile)
}

export async function ensureStudentId(
  userId: string,
  grade: number,
  enrollmentType: EnrollmentType,
) {
  if (!hasSupabaseConfig || !supabase) {
    return `MCG${grade}${enrollmentType === 'both' ? 'TPCN' : enrollmentType === 'paper' ? 'PCN' : 'TCN'}1001`
  }

  const { data, error } = await supabase.rpc('generate_student_id', {
    p_grade: grade,
    p_enrollment: enrollmentType,
  })

  if (error || !data) return null

  await supabase.from('users').update({ student_id: data }).eq('user_id', userId)
  return data as string
}

export async function createAnnouncement(payload: Omit<Announcement, 'id' | 'created_at'>) {
  if (!hasSupabaseConfig || !supabase) return null
  const { data } = await supabase.from('announcements').insert(payload).select('*').single()
  return data as Announcement | null
}

export async function createLesson(payload: Omit<Lesson, 'id'>) {
  if (!hasSupabaseConfig || !supabase) return null
  const { data, error } = await supabase.from('lessons').insert(payload).select('*').single()
  if (!error && data) return normalizeLesson(data as Lesson & { status: DatabaseLessonStatus })

  const canRetryWithLegacyStatus =
    payload.status === 'upcoming' &&
    error &&
    (error.message.toLowerCase().includes('not_started') ||
      error.message.toLowerCase().includes('status') ||
      error.code === '23514')

  if (canRetryWithLegacyStatus) {
    const { data: legacyData, error: legacyError } = await supabase
      .from('lessons')
      .insert({ ...payload, status: 'not_started' })
      .select('*')
      .single()

    if (legacyError) throw legacyError
    return normalizeLesson(legacyData as Lesson & { status: DatabaseLessonStatus })
  }

  if (error) throw error
  return null
}

export async function createClass(payload: Omit<ManagedClass, 'id'>) {
  if (!hasSupabaseConfig || !supabase) return null
  const inserted = await insertClassesWithCompatibility([payload])
  return inserted[0] ?? null
}

export async function generateMonthlyClasses(payload: {
  templateId: string
  monthValue: string
  status: ManagedClass['status']
  venue?: string | null
}) {
  const template = getClassTemplateById(payload.templateId)
  if (!template) {
    throw new Error('Selected class template could not be found.')
  }

  const generatedClasses = buildMonthlyClasses({
    template,
    monthValue: payload.monthValue,
    status: payload.status,
    venue: payload.venue,
  })

  if (!hasSupabaseConfig || !supabase) {
    return generatedClasses.map((item, index) => ({
      ...item,
      id: `${template.id}-${payload.monthValue}-${index + 1}`,
    })) as ManagedClass[]
  }

  const { start_iso, end_iso } = getMonthRange(payload.monthValue)

  const { error: deleteError } = await supabase
    .from('classes')
    .delete()
    .eq('class_name', template.class_name)
    .eq('grade', template.grade)
    .eq('type', template.type)
    .gte('class_date', start_iso)
    .lt('class_date', end_iso)

  if (deleteError) throw deleteError

  return insertClassesWithCompatibility(generatedClasses)
}

export async function updateClassStatus(classId: string, status: ManagedClass['status']) {
  if (!hasSupabaseConfig || !supabase) return null
  return updateClassStatusWithCompatibility(classId, status)
}

export async function ensureCurrentMonthClasses(monthValue = getMonthValue()) {
  await syncMonthlyClasses(monthValue)
}

export async function resetDashboardTestingData() {
  if (!hasSupabaseConfig || !supabase) return

  const operations = await Promise.all([
    supabase.from('marks').delete().not('id', 'is', null),
    supabase.from('lessons').delete().not('id', 'is', null),
    supabase.from('papers').delete().not('id', 'is', null),
    supabase.from('announcements').delete().not('id', 'is', null),
    supabase.from('classes').delete().not('id', 'is', null),
    supabase
      .from('users')
      .update({
        special_note: null,
        parent_lock_password: null,
        parent_lock_until: null,
      })
      .eq('role', 'student'),
  ])

  const firstError = operations.find((result) => result.error)?.error
  if (firstError) throw firstError
}

export async function createPaper(payload: Omit<Paper, 'id'>) {
  if (!hasSupabaseConfig || !supabase) return null
  const { data } = await supabase.from('papers').insert(payload).select('*').single()
  return data as Paper | null
}

export async function createMark(payload: Omit<MarkEntry, 'id' | 'created_at'>) {
  if (!hasSupabaseConfig || !supabase) return null
  const { data } = await supabase.from('marks').insert(payload).select('*').single()
  return data as MarkEntry | null
}

export async function deleteUser(userId: string) {
  if (!hasSupabaseConfig || !supabase) return
  await supabase.from('marks').delete().eq('user_id', userId)
  const { error } = await supabase.from('users').delete().eq('user_id', userId)
  if (error) throw error
}
