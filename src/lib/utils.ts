import { clsx } from 'clsx'
import type { EnrollmentType, Lesson, ManagedClass, Paper } from '../types/models'

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values)
}

export function formatEnrollmentLabel(type: EnrollmentType | null | undefined) {
  if (type === 'theory') return 'Theory only'
  if (type === 'paper') return 'Paper only'
  if (type === 'both') return 'Theory + Paper'
  return 'Pending setup'
}

export function calculateTheoryCoverage(lessons: Lesson[]) {
  if (!lessons.length) return 0
  const completed = lessons.filter((lesson) => lesson.status === 'completed').length
  return Math.round((completed / lessons.length) * 100)
}

export function getCurrentTheoryLesson(lessons: Lesson[]) {
  return (
    lessons.find((lesson) => lesson.status === 'ongoing') ??
    lessons.find((lesson) => lesson.status === 'not_started') ??
    lessons.at(-1) ??
    null
  )
}

export function getCurrentPaper(papers: Paper[]) {
  return papers.find((paper) => paper.status === 'upcoming') ?? papers.at(-1) ?? null
}

export function getLatestMark(marks: Array<{ mark: number }>) {
  return marks.length ? marks[marks.length - 1]!.mark : null
}

export function toYoutubeEmbed(url: string | null) {
  if (!url) return null
  const matched = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/i,
  )
  return matched ? `https://www.youtube.com/embed/${matched[1]}` : null
}

export function getPaperLinks(url: string | null) {
  if (!url) return null

  const trimmed = url.trim()
  if (!trimmed) return null

  const driveMatch =
    trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i) ??
    trimmed.match(/[?&]id=([^&]+)/i) ??
    trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/i)

  if (driveMatch?.[1]) {
    const fileId = driveMatch[1]
    return {
      original: trimmed,
      preview: `https://drive.google.com/file/d/${fileId}/preview`,
      download: `https://drive.google.com/uc?export=download&id=${fileId}`,
    }
  }

  return {
    original: trimmed,
    preview: trimmed,
    download: trimmed,
  }
}

export function sortClassesByDate(classes: ManagedClass[]) {
  return [...classes].sort(
    (first, second) =>
      new Date(first.class_date).getTime() - new Date(second.class_date).getTime(),
  )
}

export function prefixForEnrollment(type: EnrollmentType) {
  if (type === 'theory') return 'TCN'
  if (type === 'paper') return 'PCN'
  return 'TPCN'
}
