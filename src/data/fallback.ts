import type {
  AdminData,
  Announcement,
  DashboardData,
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

const hallOfFameSeed = [
  ['A/L', 'Nethuli Jayawardena'],
  ['A/L', 'Sahan Wickramasinghe'],
  ['A/L', 'Tharushi Gunawardena'],
  ['A/L', 'Ravindu Ekanayake'],
  ['A/L', 'Kavindi Perera'],
  ['A/L', 'Yenuli Rajapaksha'],
  ['A/L', 'Thisara Madushan'],
  ['A/L', 'Vihanga Senevirathna'],
  ['A/L', 'Hansika Abeykoon'],
  ['A/L', 'Kanishka Wijerathna'],
  ['A/L', 'Ashani Hettiarachchi'],
  ['A/L', 'Dulneth Fernando'],
  ['A/L', 'Nipuni Jayasekara'],
  ['A/L', 'Gihan Welagedara'],
  ['A/L', 'Piumi Rathnayaka'],
  ['A/L', 'Shavindya Pathirana'],
  ['A/L', 'Thineth Samarasinghe'],
  ['A/L', 'Maneesha Karunarathne'],
  ['A/L', 'Dileesha Silva'],
  ['A/L', 'Chamathka Jayalath'],
  ['A/L', 'Akeesha Maduranga'],
  ['A/L', 'Vidushi Lakmali'],
  ['A/L', 'Imesh Thilakarathna'],
  ['A/L', 'Sanjana Rathnasiri'],
  ['A/L', 'Harini Senadheera'],
  ['O/L', 'Sasindu Perera'],
  ['O/L', 'Nethmi Bandara'],
  ['O/L', 'Yasith Peiris'],
  ['O/L', 'Dinara Fonseka'],
  ['O/L', 'Pamodi Liyanage'],
  ['O/L', 'Kusal Abeywickrama'],
  ['O/L', 'Methuja Gunarathne'],
  ['O/L', 'Sayumi Nawarathna'],
  ['O/L', 'Tharuka Weerasekara'],
  ['O/L', 'Bimansa Jayawardena'],
  ['O/L', 'Heshani Gamage'],
  ['O/L', 'Nirmal Rodrigo'],
  ['O/L', 'Sachini Dharmasena'],
  ['O/L', 'Rivinu Karunaratne'],
  ['O/L', 'Hashini Balasuriya'],
  ['O/L', 'Oneli Nanayakkara'],
  ['O/L', 'Sethmina Kulathunga'],
  ['O/L', 'Maneesha Wickramarathna'],
  ['O/L', 'Dhanuli Wijesinghe'],
  ['O/L', 'Keshan Dissanayake'],
  ['O/L', 'Anagi Samarawickrama'],
  ['O/L', 'Yasara Kuruppu'],
  ['O/L', 'Minuri Epa'],
  ['O/L', 'Rashen Jayasundara'],
  ['O/L', 'Thilini Yapa'],
] as const

export const fallbackHallOfFame: HallOfFameEntry[] = hallOfFameSeed.map(([category, student_name], index) => ({
  id: `hof-${index + 1}`,
  category: category as 'A/L' | 'O/L',
  student_name,
  image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(student_name)}&background=0f172a&color=67e8f9&size=400`,
  achievement:
    category === 'A/L'
      ? 'Recognized for outstanding mathematical performance and consistency.'
      : 'Recognized for excellent O/L mathematics progress and exam readiness.',
  display_order: index + 1,
}))

export const fallbackTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Malinga C. Dissanayaka',
    role: 'Lead Mathematics Teacher',
    image_url: 'https://ui-avatars.com/api/?name=Malinga+C.+Dissanayaka&background=082f49&color=67e8f9&size=400',
    bio: 'Leads lesson flow, paper strategy, and the academic direction of MC Mathematics.',
  },
  {
    id: 'team-2',
    name: 'Nethmi Perera',
    role: 'Student Success Coordinator',
    image_url: 'https://ui-avatars.com/api/?name=Nethmi+Perera&background=0f172a&color=8b5cf6&size=400',
    bio: 'Supports parent communication, class scheduling, and onboarding logistics.',
  },
  {
    id: 'team-3',
    name: 'Ashen Fernando',
    role: 'Paper Practice Mentor',
    image_url: 'https://ui-avatars.com/api/?name=Ashen+Fernando&background=1e293b&color=22d3ee&size=400',
    bio: 'Works on paper discussion sessions and structured exam-timing improvement.',
  },
  {
    id: 'team-4',
    name: 'Kavindi Silva',
    role: 'Academic Support Executive',
    image_url: 'https://ui-avatars.com/api/?name=Kavindi+Silva&background=172554&color=bfdbfe&size=400',
    bio: 'Handles class support, student coordination, and follow-up on announcements.',
  },
  {
    id: 'team-5',
    name: 'Ravindu Jayasinghe',
    role: 'Operations and Media',
    image_url: 'https://ui-avatars.com/api/?name=Ravindu+Jayasinghe&background=312e81&color=e9d5ff&size=400',
    bio: 'Manages digital updates, content logistics, and platform-side communication flow.',
  },
]

export const fallbackFeedback: FeedbackEntry[] = [
  {
    id: 'feedback-1',
    student_name: 'Sachini D.',
    feedback: 'The theory explanations are clear and the paper discussions helped me improve my speed.',
    rating: 5,
    grade: 11,
  },
  {
    id: 'feedback-2',
    student_name: 'Keshan P.',
    feedback: 'I started understanding maths in a much more organized way after joining MC Mathematics.',
    rating: 5,
    grade: 10,
  },
  {
    id: 'feedback-3',
    student_name: 'Nethuli S.',
    feedback: 'Class schedules and announcements are easy to follow, and the lessons feel disciplined.',
    rating: 5,
    grade: 9,
  },
  {
    id: 'feedback-4',
    student_name: 'Thineth R.',
    feedback: 'Paper class support made a huge difference to my confidence before exams.',
    rating: 4,
    grade: 11,
  },
  {
    id: 'feedback-5',
    student_name: 'Pamodi W.',
    feedback: 'The teacher always breaks difficult ideas into steps we can actually understand.',
    rating: 5,
    grade: 8,
  },
  {
    id: 'feedback-6',
    student_name: 'Yasara K.',
    feedback: 'The class atmosphere is serious but motivating. I improved my marks steadily.',
    rating: 5,
    grade: 10,
  },
  {
    id: 'feedback-7',
    student_name: 'Harini L.',
    feedback: 'The explanations, revision structure, and paper practice all work together really well.',
    rating: 5,
    grade: 11,
  },
  {
    id: 'feedback-8',
    student_name: 'Methuja B.',
    feedback: 'I like that we always know what lesson is current and what comes next.',
    rating: 4,
    grade: 7,
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
  feedback: fallbackFeedback,
  teamMembers: fallbackTeamMembers,
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
  feedback: fallbackFeedback,
  teamMembers: fallbackTeamMembers,
}
