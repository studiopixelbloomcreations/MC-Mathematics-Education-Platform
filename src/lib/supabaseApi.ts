import type { User as FirebaseUser } from 'firebase/auth'
import { buildMonthlyClasses, getClassTemplateById, getMonthRange } from '../data/classes'
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

export async function fetchLandingPageData(): Promise<LandingPageData> {
  if (!hasSupabaseConfig || !supabase) return fallbackLandingData

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
    classes: withFallbackIfEmpty(classes as ManagedClass[], fallbackLandingData.classes),
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
    classes: classes as ManagedClass[],
    announcements: announcements as Announcement[],
    lessons: lessons as Lesson[],
    papers: papers as Paper[],
  }
}

export async function fetchAdminData(): Promise<AdminData> {
  if (!hasSupabaseConfig || !supabase) return fallbackAdminData

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
    lessons: lessons as Lesson[],
    papers: papers as Paper[],
    announcements: announcements as Announcement[],
    classes: classes as ManagedClass[],
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
  const { data } = await supabase.from('lessons').insert(payload).select('*').single()
  return data as Lesson | null
}

export async function createClass(payload: Omit<ManagedClass, 'id'>) {
  if (!hasSupabaseConfig || !supabase) return null
  const { data } = await supabase.from('classes').insert(payload).select('*').single()
  return data as ManagedClass | null
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

  const { data, error } = await supabase.from('classes').insert(generatedClasses).select('*')
  if (error) throw error
  return (data ?? []) as ManagedClass[]
}

export async function updateClassStatus(classId: string, status: ManagedClass['status']) {
  if (!hasSupabaseConfig || !supabase) return null
  const { data, error } = await supabase
    .from('classes')
    .update({ status })
    .eq('id', classId)
    .select('*')
    .single()

  if (error) throw error
  return data as ManagedClass | null
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
