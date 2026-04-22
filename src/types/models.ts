export type EnrollmentType = 'theory' | 'paper' | 'both'
export type UserRole = 'student' | 'admin'
export type LessonStatus = 'completed' | 'ongoing' | 'not_started'
export type PaperStatus = 'completed' | 'upcoming'
export type ClassStatus = 'scheduled' | 'cancelled'
export type ClassAudience = 'group' | 'whole'
export type HallOfFameCategory = 'A/L' | 'O/L'

export interface UserProfile {
  user_id: string
  student_id: string | null
  role: UserRole
  full_name: string | null
  email: string
  grade: number | null
  age: number | null
  address: string | null
  phone_number: string | null
  whatsapp_number: string | null
  enrollment_type: EnrollmentType | null
  avatar_url: string | null
  special_note: string | null
  parent_lock_password: string | null
  parent_lock_until: string | null
  created_at?: string
  updated_at?: string
}

export interface HallOfFameEntry {
  id: string
  category: HallOfFameCategory
  student_name: string
  image_url: string
  achievement: string
  display_order: number
}

export interface Lesson {
  id: string
  grade: number
  lesson_name: string
  status: LessonStatus
  completion_date: string | null
  order_index: number
}

export interface Paper {
  id: string
  grade: number
  title: string
  file_url: string | null
  status: PaperStatus
  visible_from: string | null
}

export interface Announcement {
  id: string
  title: string
  body: string
  youtube_url: string | null
  external_url: string | null
  audience: 'public' | 'students' | 'both'
  created_at: string
}

export interface ManagedClass {
  id: string
  class_name: string
  class_date: string
  grade: number
  type: ClassAudience
  status: ClassStatus
  venue: string | null
  time_label: string | null
}

export interface MarkEntry {
  id: string
  user_id: string
  mark: number
  exam_name: string
  created_at: string
}

export interface LandingPageData {
  announcements: Announcement[]
  classes: ManagedClass[]
  hallOfFame: HallOfFameEntry[]
}

export interface DashboardData {
  profile: UserProfile
  marks: MarkEntry[]
  classes: ManagedClass[]
  announcements: Announcement[]
  lessons: Lesson[]
  papers: Paper[]
}

export interface AdminData {
  users: UserProfile[]
  lessons: Lesson[]
  papers: Paper[]
  announcements: Announcement[]
  classes: ManagedClass[]
  hallOfFame: HallOfFameEntry[]
}
