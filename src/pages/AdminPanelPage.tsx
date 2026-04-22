import { Search, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AdminFormCard } from '../components/admin/AdminFormCard'
import { StatusPill } from '../components/shared/StatusPill'
import { useAdminData } from '../hooks/useAdminData'
import {
  createAnnouncement,
  createClass,
  createLesson,
  createMark,
  createPaper,
  saveUserProfile,
} from '../lib/supabaseApi'
import type { ClassAudience, ClassStatus, LessonStatus, PaperStatus } from '../types/models'

const tabs = ['overview', 'lessons', 'papers', 'announcements', 'users', 'classes'] as const

export function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('overview')
  const [query, setQuery] = useState('')
  const { data } = useAdminData()

  const filteredUsers = useMemo(() => {
    return data.users.filter((user) =>
      [user.full_name, user.student_id, String(user.grade ?? '')]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [data.users, query])

  async function submitAnnouncement(formData: FormData) {
    const payload = {
      title: String(formData.get('title') ?? ''),
      body: String(formData.get('body') ?? ''),
      youtube_url: String(formData.get('youtube_url') ?? '') || null,
      external_url: String(formData.get('external_url') ?? '') || null,
      audience: String(formData.get('audience') ?? 'both') as 'public' | 'students' | 'both',
    }
    await createAnnouncement(payload)
    toast.success('Announcement saved')
  }

  async function submitLesson(formData: FormData) {
    await createLesson({
      grade: Number(formData.get('grade')),
      lesson_name: String(formData.get('lesson_name') ?? ''),
      status: String(formData.get('status') ?? 'not_started') as LessonStatus,
      completion_date: String(formData.get('completion_date') ?? '') || null,
      order_index: Number(formData.get('order_index') ?? 1),
    })
    toast.success('Lesson saved')
  }

  async function submitPaper(formData: FormData) {
    await createPaper({
      grade: Number(formData.get('grade')),
      title: String(formData.get('title') ?? ''),
      file_url: String(formData.get('file_url') ?? '') || null,
      status: String(formData.get('status') ?? 'upcoming') as PaperStatus,
      visible_from: String(formData.get('visible_from') ?? '') || null,
    })
    toast.success('Paper saved')
  }

  async function submitClass(formData: FormData) {
    await createClass({
      class_name: String(formData.get('class_name') ?? ''),
      class_date: String(formData.get('class_date') ?? ''),
      grade: Number(formData.get('grade')),
      type: String(formData.get('type') ?? 'group') as ClassAudience,
      status: String(formData.get('status') ?? 'scheduled') as ClassStatus,
      venue: String(formData.get('venue') ?? '') || null,
      time_label: String(formData.get('time_label') ?? '') || null,
    })
    toast.success('Class saved')
  }

  async function addMark(userId: string) {
    const exam_name = window.prompt('Exam name')
    const mark = window.prompt('Mark')
    if (!exam_name || !mark) return
    await createMark({ user_id: userId, exam_name, mark: Number(mark) })
    toast.success('Mark added')
  }

  async function addTeacherNote(userId: string) {
    const special_note = window.prompt('Special note from teacher')
    if (!special_note) return
    await saveUserProfile(userId, { special_note })
    toast.success('Teacher note updated')
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-emerald-300">
                <ShieldCheck size={16} />
                Private route
              </div>
              <h1 className="font-display mt-4 text-4xl font-semibold text-white">Admin Panel</h1>
              <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-300">
                Grade-based management for lessons, papers, announcements, classes, and student performance. All core data is stored in Supabase.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-cyan-400/14 bg-cyan-400/[0.04] p-4 text-sm leading-7 text-slate-300">
              Firebase handles sign-in. Supabase handles storage, database, realtime, and role checks.
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-cyan-400 text-slate-950'
                  : 'border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === 'overview' ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['Students', String(data.users.length)],
                ['Lessons', String(data.lessons.length)],
                ['Papers', String(data.papers.length)],
                ['Announcements', String(data.announcements.length)],
              ].map(([label, value]) => (
                <div key={label} className="glass-panel rounded-[2rem] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <p className="font-display mt-4 text-3xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'announcements' ? (
            <AdminFormCard
              title="Announcements"
              description="Appears on the landing page and student dashboard. Supports text, YouTube link, and external link."
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void submitAnnouncement(new FormData(event.currentTarget))
                  event.currentTarget.reset()
                }}
                className="grid gap-4 md:grid-cols-2"
              >
                <Input name="title" label="Title" />
                <Select
                  name="audience"
                  label="Audience"
                  options={[
                    ['public', 'Public'],
                    ['students', 'Students'],
                    ['both', 'Both'],
                  ]}
                />
                <TextArea name="body" label="Text" className="md:col-span-2" />
                <Input name="youtube_url" label="YouTube Link" />
                <Input name="external_url" label="External Link" />
                <SubmitButton label="Save announcement" className="md:col-span-2" />
              </form>
            </AdminFormCard>
          ) : null}

          {activeTab === 'lessons' ? (
            <AdminFormCard
              title="Lessons"
              description="Store lesson progression by grade. Coverage percentage is computed dynamically from completed lessons."
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void submitLesson(new FormData(event.currentTarget))
                  event.currentTarget.reset()
                }}
                className="grid gap-4 md:grid-cols-2"
              >
                <Input name="lesson_name" label="Lesson Name" />
                <Input name="grade" label="Grade" type="number" />
                <Select
                  name="status"
                  label="Status"
                  options={[
                    ['completed', 'Completed'],
                    ['ongoing', 'Ongoing'],
                    ['not_started', 'Not Started'],
                  ]}
                />
                <Input name="order_index" label="Order Index" type="number" />
                <Input name="completion_date" label="Completion Date" type="date" />
                <SubmitButton label="Save lesson" className="md:col-span-2" />
              </form>
            </AdminFormCard>
          ) : null}

          {activeTab === 'papers' ? (
            <AdminFormCard
              title="Papers"
              description="Paste a Google Drive paper link or direct file URL here. It will automatically appear for students in the matching grade dashboard."
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void submitPaper(new FormData(event.currentTarget))
                  event.currentTarget.reset()
                }}
                className="grid gap-4 md:grid-cols-2"
              >
                <Input name="title" label="Paper Title" />
                <Input name="grade" label="Grade" type="number" />
                <Select
                  name="status"
                  label="Type"
                  options={[
                    ['completed', 'Completed'],
                    ['upcoming', 'Upcoming'],
                  ]}
                />
                <Input name="visible_from" label="Visible From" type="date" />
                <Input name="file_url" label="Google Drive or File URL" className="md:col-span-2" />
                <SubmitButton label="Save paper" className="md:col-span-2" />
              </form>
            </AdminFormCard>
          ) : null}

          {activeTab === 'classes' ? (
            <AdminFormCard
              title="Classes Management"
              description="Manage public and dashboard schedules with grade filters, class type, and cancellation states."
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void submitClass(new FormData(event.currentTarget))
                  event.currentTarget.reset()
                }}
                className="grid gap-4 md:grid-cols-2"
              >
                <Input name="class_name" label="Class Name" />
                <Input name="grade" label="Grade" type="number" />
                <Input name="class_date" label="Date & Time" type="datetime-local" />
                <Select
                  name="type"
                  label="Type"
                  options={[
                    ['group', 'Group'],
                    ['whole', 'Whole'],
                  ]}
                />
                <Select
                  name="status"
                  label="Status"
                  options={[
                    ['scheduled', 'Scheduled'],
                    ['cancelled', 'Cancelled'],
                  ]}
                />
                <Input name="time_label" label="Time Label" />
                <Input name="venue" label="Venue" className="md:col-span-2" />
                <SubmitButton label="Save class" className="md:col-span-2" />
              </form>
            </AdminFormCard>
          ) : null}

          {activeTab === 'users' ? (
            <div className="glass-panel rounded-[2rem] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white">Users</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Search by name, student ID, or grade. Click a student to add marks and teacher notes.
                  </p>
                </div>
                <label className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search students"
                    className="glass-input py-3 pl-11 pr-4"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-4">
                {filteredUsers.map((user) => (
                  <article key={user.user_id} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xl font-semibold text-white">{user.full_name ?? 'Unnamed student'}</p>
                        <p className="mt-2 text-sm text-slate-400">
                          {user.student_id ?? 'Student ID pending'} · Grade {user.grade ?? '-'}
                        </p>
                      </div>
                      <StatusPill label={user.role} tone={user.role === 'admin' ? 'success' : 'info'} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => void addMark(user.user_id)}
                        className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        Enter marks
                      </button>
                      <button
                        onClick={() => void addTeacherNote(user.user_id)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300"
                      >
                        Add teacher note
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Input({
  label,
  name,
  type = 'text',
  className,
}: {
  label: string
  name: string
  type?: string
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-3 block text-sm text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        required={type !== 'date' && name !== 'youtube_url' && name !== 'external_url' && name !== 'file_url'}
        className="glass-input px-4 py-3"
      />
    </label>
  )
}

function TextArea({ label, name, className }: { label: string; name: string; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-3 block text-sm text-slate-300">{label}</span>
      <textarea
        name={name}
        rows={4}
        required
        className="glass-textarea px-4 py-3"
      />
    </label>
  )
}

function Select({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: Array<[string, string]>
}) {
  return (
    <label>
      <span className="mb-3 block text-sm text-slate-300">{label}</span>
      <select name={name} className="glass-select px-4 py-3">
        {options.map(([value, title]) => (
          <option key={value} value={value}>
            {title}
          </option>
        ))}
      </select>
    </label>
  )
}

function SubmitButton({ label, className }: { label: string; className?: string }) {
  return (
    <div className={className}>
      <button type="submit" className="glass-button px-5 py-3 font-semibold text-slate-950">
        {label}
      </button>
    </div>
  )
}
