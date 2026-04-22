import type { User as FirebaseUser } from 'firebase/auth'
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
  HallOfFameEntry,
  LandingPageData,
  Lesson,
  ManagedClass,
  MarkEntry,
  Paper,
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

  const [announcements, classes, hallOfFame] = await Promise.all([
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

  const [users, lessons, papers, announcements, classes, hallOfFame] = await Promise.all([
    requireTable(supabase.from('users').select('*').order('created_at', { ascending: false }), fallbackAdminData.users),
    requireTable(supabase.from('lessons').select('*').order('grade').order('order_index'), fallbackAdminData.lessons),
    requireTable(supabase.from('papers').select('*').order('grade').order('visible_from'), fallbackAdminData.papers),
    requireTable(supabase.from('announcements').select('*').order('created_at', { ascending: false }), fallbackAdminData.announcements),
    requireTable(supabase.from('classes').select('*').order('class_date'), fallbackAdminData.classes),
    requireTable(supabase.from('hall_of_fame').select('*').order('display_order'), fallbackAdminData.hallOfFame),
  ])

  return {
    users: users as UserProfile[],
    lessons: lessons as Lesson[],
    papers: papers as Paper[],
    announcements: announcements as Announcement[],
    classes: classes as ManagedClass[],
    hallOfFame: hallOfFame as HallOfFameEntry[],
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
