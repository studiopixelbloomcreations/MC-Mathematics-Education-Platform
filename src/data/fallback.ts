import type {
  AdminData,
  Announcement,
  DashboardData,
  HallOfFameEntry,
  LandingPageData,
  Lesson,
  ManagedClass,
  MarkEntry,
  Paper,
  UserProfile,
} from '../types/models'

export const fallbackAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Term kick-off session',
    body: 'New grade-wise theory and paper batches begin this Saturday with revised exam-focused roadmaps.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    external_url: 'https://www.netlify.com/',
    audience: 'both',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Revision sprint released',
    body: 'O/L students can access the new structured revision sequence and challenge paper list from the dashboard.',
    youtube_url: null,
    external_url: null,
    audience: 'students',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export const fallbackClasses: ManagedClass[] = [
  {
    id: 'class-1',
    class_name: 'Grade 8 Theory Masterclass',
    class_date: '2026-04-25T09:00:00+05:30',
    grade: 8,
    type: 'group',
    status: 'scheduled',
    venue: 'MC Main Hall',
    time_label: '9:00 AM - 11:00 AM',
  },
  {
    id: 'class-2',
    class_name: 'Grade 11 Paper Clinic',
    class_date: '2026-04-26T14:00:00+05:30',
    grade: 11,
    type: 'whole',
    status: 'scheduled',
    venue: 'Online + Hall',
    time_label: '2:00 PM - 4:30 PM',
  },
  {
    id: 'class-3',
    class_name: 'Grade 10 Group Class',
    class_date: '2026-04-28T16:30:00+05:30',
    grade: 10,
    type: 'group',
    status: 'cancelled',
    venue: 'MC Branch 02',
    time_label: '4:30 PM - 6:30 PM',
  },
]

export const fallbackHallOfFame: HallOfFameEntry[] = [
  {
    id: 'hof-1',
    category: 'A/L',
    student_name: 'Nethuli Jayawardena',
    image_url:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    achievement: 'Island rank excellence in Combined Maths foundations',
    display_order: 1,
  },
  {
    id: 'hof-2',
    category: 'O/L',
    student_name: 'Sasindu Perera',
    image_url:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    achievement: 'A grade jump through structured theory and paper coaching',
    display_order: 2,
  },
]

export const fallbackLessons: Lesson[] = [
  {
    id: 'lesson-1',
    grade: 8,
    lesson_name: 'Algebraic Expressions',
    status: 'completed',
    completion_date: '2026-04-04',
    order_index: 1,
  },
  {
    id: 'lesson-2',
    grade: 8,
    lesson_name: 'Linear Equations',
    status: 'completed',
    completion_date: '2026-04-11',
    order_index: 2,
  },
  {
    id: 'lesson-3',
    grade: 8,
    lesson_name: 'Coordinate Geometry',
    status: 'ongoing',
    completion_date: null,
    order_index: 3,
  },
  {
    id: 'lesson-4',
    grade: 8,
    lesson_name: 'Mensuration Strategies',
    status: 'not_started',
    completion_date: null,
    order_index: 4,
  },
]

export const fallbackPapers: Paper[] = [
  {
    id: 'paper-1',
    grade: 8,
    title: 'Term 1 Paper Review',
    file_url: null,
    status: 'completed',
    visible_from: '2026-04-03',
  },
  {
    id: 'paper-2',
    grade: 8,
    title: 'Challenge Paper 02',
    file_url: null,
    status: 'upcoming',
    visible_from: '2026-04-24',
  },
]

export const fallbackMarks: MarkEntry[] = [
  {
    id: 'mark-1',
    user_id: 'demo-user',
    exam_name: 'Unit Test 01',
    mark: 72,
    created_at: '2026-02-16',
  },
  {
    id: 'mark-2',
    user_id: 'demo-user',
    exam_name: 'Unit Test 02',
    mark: 81,
    created_at: '2026-03-15',
  },
  {
    id: 'mark-3',
    user_id: 'demo-user',
    exam_name: 'Monthly Evaluation',
    mark: 88,
    created_at: '2026-04-12',
  },
]

export const fallbackProfile: UserProfile = {
  user_id: 'demo-user',
  student_id: 'MCG8TPCN1002',
  role: 'student',
  full_name: 'Demo Student',
  email: 'student@example.com',
  grade: 8,
  age: 14,
  address: 'Colombo, Sri Lanka',
  phone_number: '0710000000',
  whatsapp_number: '0710000000',
  enrollment_type: 'both',
  avatar_url: null,
  special_note: 'Brilliant recovery in paper timing. Keep pushing coordinate geometry.',
  parent_lock_password: null,
  parent_lock_until: null,
}

export const fallbackLandingData: LandingPageData = {
  announcements: fallbackAnnouncements,
  classes: fallbackClasses,
  hallOfFame: fallbackHallOfFame,
}

export const fallbackDashboardData: DashboardData = {
  profile: fallbackProfile,
  marks: fallbackMarks,
  classes: fallbackClasses.filter((item) => item.grade === 8),
  announcements: fallbackAnnouncements,
  lessons: fallbackLessons,
  papers: fallbackPapers,
}

export const fallbackAdminData: AdminData = {
  users: [fallbackProfile],
  lessons: fallbackLessons,
  papers: fallbackPapers,
  announcements: fallbackAnnouncements,
  classes: fallbackClasses,
  hallOfFame: fallbackHallOfFame,
}
