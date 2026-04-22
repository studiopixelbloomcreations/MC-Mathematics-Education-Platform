import { format } from 'date-fns'
import { ExternalLink, LogOut, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar'
import { OnboardingCard } from '../components/dashboard/OnboardingCard'
import { ParentLockCard } from '../components/dashboard/ParentLockCard'
import { ProfileSettingsCard } from '../components/dashboard/ProfileSettingsCard'
import { EmptyState } from '../components/shared/EmptyState'
import { StatusPill } from '../components/shared/StatusPill'
import { useCurrentTime } from '../hooks/useCurrentTime'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  calculateTheoryCoverage,
  formatClassStatusLabel,
  formatEnrollmentLabel,
  getCurrentPaper,
  getPaperLinks,
  getComputedClassStatus,
  getClassStatusTone,
  getCurrentTheoryLesson,
  getLatestMark,
  sortClassesByDate,
  toYoutubeEmbed,
} from '../lib/utils'
import { useAuth } from '../providers/auth-context'
import type { Announcement, UserProfile } from '../types/models'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function UserDashboardPage() {
  const { firebaseUser, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const { data, setData } = useDashboardData(firebaseUser?.uid)
  const now = useCurrentTime()

  const sortedClasses = useMemo(() => sortClassesByDate(data.classes), [data.classes])
  const coverage = calculateTheoryCoverage(data.lessons)
  const latestMark = getLatestMark(data.marks)
  const currentLesson = getCurrentTheoryLesson(data.lessons)
  const currentPaper = getCurrentPaper(data.papers)
  const currentPaperLinks = getPaperLinks(currentPaper?.file_url ?? null)

  function handleProfileUpdated(profile: UserProfile) {
    setData((current) => ({ ...current, profile }))
  }

  const sections: Record<string, React.ReactNode> = {
    overview: (
      <div className="space-y-6">
        <OnboardingCard profile={data.profile} onComplete={handleProfileUpdated} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Latest Test Score', latestMark ? `${latestMark}%` : 'No data'],
            ['Theory Coverage', `${coverage}%`],
            ['Current Theory Lesson', currentLesson?.lesson_name ?? 'Pending'],
            ['Upcoming Paper', currentPaper?.title ?? 'Not enrolled yet'],
          ].map(([label, value]) => (
            <div key={label} className="glass-panel rounded-[2rem] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
              <p className="font-display mt-4 text-2xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">Performance trend</p>
                <h3 className="font-display mt-3 text-2xl font-semibold text-white">Marks analytics</h3>
              </div>
              <div className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-200">
                {data.marks.length >= 2 ? 'Graph ready' : 'Need 2 entries'}
              </div>
            </div>
            {data.marks.length >= 2 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.marks}>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
                    <XAxis dataKey="exam_name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: '#07111f',
                        border: '1px solid rgba(103, 232, 249, 0.18)',
                        borderRadius: 16,
                        color: '#e2e8f0',
                      }}
                    />
                    <Line type="monotone" dataKey="mark" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                title="Statistics unlock soon"
                description="At least two mark entries are needed before we draw the performance graph."
              />
            )}
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">Teacher feedback</p>
                <h3 className="font-display text-2xl font-semibold text-white">Special Note</h3>
              </div>
            </div>
            <p className="mt-6 text-sm leading-8 text-slate-300">
              {data.profile.special_note ?? 'Teacher notes will appear here once added from the admin panel.'}
            </p>
          </div>
        </div>

        {currentPaper ? (
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">Current paper access</p>
                <h3 className="font-display mt-3 text-2xl font-semibold text-white">{currentPaper.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {currentPaper.visible_from
                    ? `Visible from ${format(new Date(currentPaper.visible_from), 'PPP')}`
                    : 'Available now for your grade.'}
                </p>
              </div>
              <StatusPill label={currentPaper.status} tone={currentPaper.status === 'completed' ? 'success' : 'info'} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {currentPaperLinks ? (
                <>
                  <a
                    href={currentPaperLinks.preview}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button inline-flex items-center gap-2 px-5 py-3 font-semibold text-slate-950"
                  >
                    Preview Paper
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={currentPaperLinks.download}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button-secondary inline-flex items-center gap-2 px-5 py-3 text-white"
                  >
                    Download Paper
                    <ExternalLink size={16} />
                  </a>
                </>
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
                  The paper link has not been added yet by the admin.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    ),
    statistics: (
      <div className="space-y-6">
        <div className="glass-panel rounded-[2rem] p-6">
          <h3 className="font-display text-2xl font-semibold text-white">Statistics</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Auto-generated from the Supabase `marks` table for this student.
          </p>
          {data.marks.length >= 2 ? (
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.marks}>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
                  <XAxis dataKey="exam_name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: '#07111f',
                      border: '1px solid rgba(103, 232, 249, 0.18)',
                      borderRadius: 16,
                    }}
                  />
                  <Line type="monotone" dataKey="mark" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="More marks needed"
                description="Enter at least two marks from the admin panel to activate the chart."
              />
            </div>
          )}
        </div>
      </div>
    ),
    classes: (
      <div className="grid gap-5">
        {sortedClasses.length ? (
          sortedClasses.map((item) => (
            <div key={item.id} className="glass-panel rounded-[2rem] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Grade {item.grade}</p>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-white">{item.class_name}</h3>
                </div>
                <StatusPill
                  label={formatClassStatusLabel(getComputedClassStatus(item, now))}
                  tone={getClassStatusTone(getComputedClassStatus(item, now))}
                />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <InfoTile label="Date" value={format(new Date(item.class_date), 'PPP')} />
                <InfoTile label="Time" value={item.time_label ?? 'TBA'} />
                <InfoTile label="Venue" value={item.venue ?? 'MC Campus'} />
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No classes yet"
            description="When the admin generates your monthly class schedule, it will appear here automatically."
          />
        )}
      </div>
    ),
    announcements: (
      <div className="grid gap-5">
        {data.announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    ),
    'class-stats': (
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h3 className="font-display text-2xl font-semibold text-white">Lesson progression</h3>
          <div className="mt-6 space-y-4">
            {data.lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-white">{lesson.lesson_name}</p>
                  <StatusPill
                    label={lesson.status.replace('_', ' ')}
                    tone={lesson.status === 'completed' ? 'success' : lesson.status === 'ongoing' ? 'info' : 'muted'}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {lesson.completion_date ? `Completed on ${format(new Date(lesson.completion_date), 'PPP')}` : 'Pending completion date'}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h3 className="font-display text-2xl font-semibold text-white">Paper progression</h3>
          <div className="mt-6 space-y-4">
            {data.papers.map((paper) => (
              <div key={paper.id} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-white">{paper.title}</p>
                  <StatusPill label={paper.status} tone={paper.status === 'completed' ? 'success' : 'info'} />
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {paper.visible_from ? `Visible from ${format(new Date(paper.visible_from), 'PPP')}` : 'Date not assigned'}
                </p>
                {getPaperLinks(paper.file_url) ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={getPaperLinks(paper.file_url)?.preview}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/10"
                    >
                      Preview
                      <ExternalLink size={15} />
                    </a>
                    <a
                      href={getPaperLinks(paper.file_url)?.download}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      Download
                      <ExternalLink size={15} />
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    settings: <ProfileSettingsCard profile={data.profile} onUpdated={handleProfileUpdated} />,
    'parent-lock': <ParentLockCard profile={data.profile} onUpdated={handleProfileUpdated} />,
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/landingpage" className="text-sm text-cyan-300 hover:text-cyan-200">
              Back to landing page
            </Link>
            <h1 className="font-display mt-3 text-4xl font-semibold text-white">Student Dashboard</h1>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {data.profile.full_name ?? firebaseUser?.displayName ?? 'Student'} · {data.profile.student_id ?? 'Student ID pending'} ·{' '}
              {formatEnrollmentLabel(data.profile.enrollment_type)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusPill label={`Grade ${data.profile.grade ?? '-'}`} tone="info" />
            <button
              onClick={() => void logout()}
              className="glass-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-300"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <DashboardSidebar active={activeSection} onChange={setActiveSection} />
          <section key={activeSection}>
            {sections[activeSection]}
          </section>
        </div>
      </div>
    </div>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-sm text-slate-200">{value}</p>
    </div>
  )
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const embedUrl = toYoutubeEmbed(announcement.youtube_url)

  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
            {format(new Date(announcement.created_at), 'PPP')}
          </p>
          <h3 className="font-display mt-3 text-2xl font-semibold text-white">{announcement.title}</h3>
        </div>
        <StatusPill label={announcement.audience} tone="info" />
      </div>
      <p className="mt-4 text-sm leading-8 text-slate-300">{announcement.body}</p>

      {embedUrl ? (
        <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/8">
          <iframe
            src={embedUrl}
            title={announcement.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="mt-6 rounded-[1.6rem] border border-dashed border-white/8 bg-white/[0.02] p-6 text-sm text-slate-400">
          No YouTube embed attached for this announcement.
        </div>
      )}

      {announcement.external_url ? (
        <a
          href={announcement.external_url}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/10"
        >
          Open external link
          <ExternalLink size={16} />
        </a>
      ) : null}
    </div>
  )
}
