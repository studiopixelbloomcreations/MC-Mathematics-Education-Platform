import { format } from 'date-fns'
import { RotateCcw, Search, ShieldCheck } from 'lucide-react'
import { useMemo, useState, type ChangeEventHandler } from 'react'
import toast from 'react-hot-toast'
import { AdminFormCard } from '../components/admin/AdminFormCard'
import { StatusPill } from '../components/shared/StatusPill'
import { classTemplates, getMonthValue } from '../data/classes'
import { useAdminData } from '../hooks/useAdminData'
import {
  createAnnouncement,
  createLesson,
  createMark,
  createPaper,
  generateMonthlyClasses,
  resetDashboardTestingData,
  saveUserProfile,
  updateClassStatus,
} from '../lib/supabaseApi'
import type { ClassStatus, LessonStatus, PaperStatus } from '../types/models'

const tabs = ['overview', 'lessons', 'papers', 'announcements', 'users', 'classes'] as const
const classStatusOptions: ClassStatus[] = ['ongoing', 'completed', 'cancelled']

export function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('overview')
  const [query, setQuery] = useState('')
  const [scheduleMonth, setScheduleMonth] = useState(getMonthValue())
  const [isResetting, setIsResetting] = useState(false)
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false)
  const { data } = useAdminData()

  const filteredUsers = useMemo(() => {
    return data.users.filter((user) =>
      [user.full_name, user.student_id, String(user.grade ?? '')]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [data.users, query])

  const monthClasses = useMemo(() => {
    return data.classes
      .filter((item) => item.class_date.startsWith(scheduleMonth))
      .sort((first, second) => new Date(first.class_date).getTime() - new Date(second.class_date).getTime())
  }, [data.classes, scheduleMonth])

  async function submitAnnouncement(formData: FormData) {
    try {
      const payload = {
        title: String(formData.get('title') ?? ''),
        body: String(formData.get('body') ?? ''),
        youtube_url: String(formData.get('youtube_url') ?? '') || null,
        external_url: String(formData.get('external_url') ?? '') || null,
        audience: String(formData.get('audience') ?? 'both') as 'public' | 'students' | 'both',
      }
      await createAnnouncement(payload)
      toast.success('Announcement saved')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Announcement could not be saved'))
    }
  }

  async function submitLesson(formData: FormData) {
    try {
      await createLesson({
        grade: Number(formData.get('grade')),
        lesson_name: String(formData.get('lesson_name') ?? ''),
        status: String(formData.get('status') ?? 'not_started') as LessonStatus,
        completion_date: String(formData.get('completion_date') ?? '') || null,
        order_index: Number(formData.get('order_index') ?? 1),
      })
      toast.success('Lesson saved')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lesson could not be saved'))
    }
  }

  async function submitPaper(formData: FormData) {
    try {
      await createPaper({
        grade: Number(formData.get('grade')),
        title: String(formData.get('title') ?? ''),
        file_url: String(formData.get('file_url') ?? '') || null,
        status: String(formData.get('status') ?? 'upcoming') as PaperStatus,
        visible_from: String(formData.get('visible_from') ?? '') || null,
      })
      toast.success('Paper saved')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Paper could not be saved'))
    }
  }

  async function submitMonthlyClasses(formData: FormData) {
    const templateId = String(formData.get('template_id') ?? '')
    const monthValue = String(formData.get('month_value') ?? '')
    const venue = String(formData.get('venue') ?? '') || null
    const status = String(formData.get('status') ?? 'ongoing') as ClassStatus

    const template = classTemplates.find((item) => item.id === templateId)
    if (!template) {
      toast.error('Selected class template was not found')
      return
    }

    try {
      setIsGeneratingSchedule(true)
      const generated = await generateMonthlyClasses({
        templateId,
        monthValue,
        venue,
        status,
      })

      setScheduleMonth(monthValue)
      toast.success(`${generated.length} ${template.class_name} dates generated for ${monthValue}`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Full month schedule could not be generated'))
    } finally {
      setIsGeneratingSchedule(false)
    }
  }

  async function handleResetDashboardData() {
    const confirmed = window.confirm(
      'This temporary testing button will delete marks, lessons, papers, announcements, classes, and clear student notes/parent locks. Continue?',
    )
    if (!confirmed) return

    try {
      setIsResetting(true)
      await resetDashboardTestingData()
      toast.success('Dashboard testing data reset')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Dashboard data reset failed'))
    } finally {
      setIsResetting(false)
    }
  }

  async function handleClassStatusChange(classId: string, status: ClassStatus) {
    try {
      await updateClassStatus(classId, status)
      toast.success(`Class marked as ${status}`)
    } catch (error) {
      toast.error(getErrorMessage(error, `Class status could not be changed to ${status}`))
    }
  }

  async function addMark(userId: string) {
    const examName = window.prompt('Exam name')
    const mark = window.prompt('Mark')
    if (!examName || !mark) return
    try {
      await createMark({ user_id: userId, exam_name: examName, mark: Number(mark) })
      toast.success('Mark added')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Mark could not be added'))
    }
  }

  async function addTeacherNote(userId: string) {
    const specialNote = window.prompt('Special note from teacher')
    if (!specialNote) return
    try {
      await saveUserProfile(userId, { special_note: specialNote })
      toast.success('Teacher note updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Teacher note could not be updated'))
    }
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
                Grade-based management for lessons, papers, announcements, classes, and student performance. The class scheduler now reads from the fixed codebase timetable and generates the full month automatically.
              </p>
            </div>
            <div className="max-w-md rounded-[1.6rem] border border-cyan-400/14 bg-cyan-400/[0.04] p-4 text-sm leading-7 text-slate-300">
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
            <>
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

              <AdminFormCard
                title="Temporary Testing Reset"
                description="This is only for testing. It wipes shared dashboard tables and clears student dashboard notes so you can start again quickly."
              >
                <button
                  type="button"
                  onClick={() => void handleResetDashboardData()}
                  disabled={isResetting}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RotateCcw size={16} />
                  {isResetting ? 'Resetting dashboard data...' : 'Reset all users dashboard data'}
                </button>
              </AdminFormCard>
            </>
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
                <Input name="youtube_url" label="YouTube Link" required={false} />
                <Input name="external_url" label="External Link" required={false} />
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
                <Input name="completion_date" label="Completion Date" type="date" required={false} />
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
                <Input name="visible_from" label="Visible From" type="date" required={false} />
                <Input name="file_url" label="Google Drive or File URL" className="md:col-span-2" required={false} />
                <SubmitButton label="Save paper" className="md:col-span-2" />
              </form>
            </AdminFormCard>
          ) : null}

          {activeTab === 'classes' ? (
            <>
              <AdminFormCard
                title="Monthly Class Generator"
                description="Select one of the fixed class templates from the codebase, choose the month, and the system will calculate every matching weekday date automatically."
              >
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    void submitMonthlyClasses(new FormData(event.currentTarget))
                  }}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <Select
                    name="template_id"
                    label="Class Template"
                    options={classTemplates.map((template) => [
                      template.id,
                      `Grade ${template.grade} - ${template.class_name} - ${template.weekday_label} - ${template.time_label}`,
                    ])}
                  />
                  <Input
                    name="month_value"
                    label="Month"
                    type="month"
                    value={scheduleMonth}
                    onChange={(event) => setScheduleMonth(event.target.value)}
                  />
                  <Select
                    name="status"
                    label="Default Status"
                    options={[
                      ['ongoing', 'Ongoing'],
                      ['completed', 'Completed'],
                      ['cancelled', 'Cancelled'],
                    ]}
                  />
                  <Input name="venue" label="Venue Override" required={false} placeholder="Leave empty to use template venue" />
                  <SubmitButton
                    label={isGeneratingSchedule ? 'Generating full month schedule...' : 'Generate full month schedule'}
                    className="md:col-span-2"
                    disabled={isGeneratingSchedule}
                  />
                </form>
              </AdminFormCard>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <AdminFormCard
                  title="Codebase Timetable"
                  description="These are the fixed weekly classes currently stored in the new `classes` source file."
                >
                  <div className="grid gap-3">
                    {classTemplates.map((template) => (
                      <article key={template.id} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-white">{template.class_name}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              Grade {template.grade} · {template.weekday_label} · {template.time_label}
                            </p>
                          </div>
                          <StatusPill label={template.type} tone="info" />
                        </div>
                      </article>
                    ))}
                  </div>
                </AdminFormCard>

                <AdminFormCard
                  title="Generated Monthly Classes"
                  description="Every date for the selected month is listed here. Change a single date to `completed`, `ongoing`, or `cancelled`, and students will see that status automatically on their dashboard."
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-400">Showing dates for {scheduleMonth}</p>
                    <Input
                      label="Filter Month"
                      name="filter_month"
                      type="month"
                      value={scheduleMonth}
                      onChange={(event) => setScheduleMonth(event.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    {monthClasses.length ? (
                      monthClasses.map((item) => (
                        <article key={item.id} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-white">{item.class_name}</p>
                              <p className="mt-1 text-sm text-slate-400">
                                {format(new Date(item.class_date), 'EEEE, PPP')} · {item.time_label ?? 'TBA'} · Grade {item.grade}
                              </p>
                            </div>
                            <div className="min-w-40">
                              <Select
                                label="Status"
                                name={`status-${item.id}`}
                                value={item.status}
                                onChange={(event) => void handleClassStatusChange(item.id, event.target.value as ClassStatus)}
                                options={classStatusOptions.map((status) => [status, toTitleCase(status)])}
                              />
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-slate-400">
                        No classes have been generated for this month yet.
                      </div>
                    )}
                  </div>
                </AdminFormCard>
              </div>
            </>
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
  required = true,
  defaultValue,
  value,
  placeholder,
  onChange,
}: {
  label: string
  name: string
  type?: string
  className?: string
  required?: boolean
  defaultValue?: string
  value?: string
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <label className={className}>
      <span className="mb-3 block text-sm text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
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
  value,
  onChange,
}: {
  label: string
  name: string
  options: Array<[string, string]>
  value?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
}) {
  return (
    <label>
      <span className="mb-3 block text-sm text-slate-300">{label}</span>
      <select name={name} className="glass-select px-4 py-3" value={value} onChange={onChange}>
        {options.map(([optionValue, title]) => (
          <option key={optionValue} value={optionValue}>
            {title}
          </option>
        ))}
      </select>
    </label>
  )
}

function SubmitButton({
  label,
  className,
  disabled = false,
}: {
  label: string
  className?: string
  disabled?: boolean
}) {
  return (
    <div className={className}>
      <button
        type="submit"
        disabled={disabled}
        className="glass-button px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {label}
      </button>
    </div>
  )
}

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
