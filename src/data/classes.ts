import type { ClassStatus, ClassTemplate, ManagedClass } from '../types/models'

const SRI_LANKA_OFFSET = '+05:30'

export const classTemplates: ClassTemplate[] = [
  {
    id: 'g10-theory',
    class_name: 'Grade 10 Theory Class',
    grade: 10,
    type: 'whole',
    weekday: 2,
    weekday_label: 'Tuesday',
    start_time: '17:30',
    end_time: '20:30',
    time_label: '5:30 PM - 8:30 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g8-whole',
    class_name: 'Grade 8 Whole Class',
    grade: 8,
    type: 'whole',
    weekday: 2,
    weekday_label: 'Tuesday',
    start_time: '14:30',
    end_time: '17:15',
    time_label: '2:30 PM - 5:15 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g9-whole',
    class_name: 'Grade 9 Whole Class',
    grade: 9,
    type: 'whole',
    weekday: 3,
    weekday_label: 'Wednesday',
    start_time: '14:30',
    end_time: '17:15',
    time_label: '2:30 PM - 5:15 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g9-group',
    class_name: 'Grade 9 Group Class',
    grade: 9,
    type: 'group',
    weekday: 3,
    weekday_label: 'Wednesday',
    start_time: '17:30',
    end_time: '20:30',
    time_label: '5:30 PM - 8:30 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g7-whole',
    class_name: 'Grade 7 Whole Class',
    grade: 7,
    type: 'whole',
    weekday: 4,
    weekday_label: 'Thursday',
    start_time: '14:30',
    end_time: '17:15',
    time_label: '2:30 PM - 5:15 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g11-group',
    class_name: 'Grade 11 Group Class',
    grade: 11,
    type: 'group',
    weekday: 4,
    weekday_label: 'Thursday',
    start_time: '17:30',
    end_time: '21:00',
    time_label: '5:30 PM - 9:00 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g6-whole',
    class_name: 'Grade 6 Whole Class',
    grade: 6,
    type: 'whole',
    weekday: 5,
    weekday_label: 'Friday',
    start_time: '14:30',
    end_time: '17:15',
    time_label: '2:30 PM - 5:15 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g8-group',
    class_name: 'Grade 8 Group Class',
    grade: 8,
    type: 'group',
    weekday: 5,
    weekday_label: 'Friday',
    start_time: '17:30',
    end_time: '19:30',
    time_label: '5:30 PM - 7:30 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g11-whole',
    class_name: 'Grade 11 Whole Class',
    grade: 11,
    type: 'whole',
    weekday: 6,
    weekday_label: 'Saturday',
    start_time: '07:30',
    end_time: '12:00',
    time_label: '7:30 AM - 12:00 PM',
    venue: 'MC Campus',
  },
  {
    id: 'g10-whole',
    class_name: 'Grade 10 Whole Class',
    grade: 10,
    type: 'whole',
    weekday: 6,
    weekday_label: 'Saturday',
    start_time: '13:00',
    end_time: '17:00',
    time_label: '1:00 PM - 5:00 PM',
    venue: 'MC Campus',
  },
]

export function getClassTemplateById(templateId: string) {
  return classTemplates.find((template) => template.id === templateId) ?? null
}

export function getMonthValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function getMonthRange(monthValue: string) {
  const [year, month] = monthValue.split('-').map(Number)
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  return {
    start,
    end,
    start_iso: `${monthValue}-01T00:00:00${SRI_LANKA_OFFSET}`,
    end_iso: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-01T00:00:00${SRI_LANKA_OFFSET}`,
  }
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function toClassDateIso(year: number, monthIndex: number, day: number, time: string) {
  const [hours, minutes] = time.split(':')
  const month = String(monthIndex + 1).padStart(2, '0')
  const date = String(day).padStart(2, '0')
  return `${year}-${month}-${date}T${hours}:${minutes}:00${SRI_LANKA_OFFSET}`
}

export function buildMonthlyClasses({
  template,
  monthValue,
  status = 'ongoing',
  venue,
}: {
  template: ClassTemplate
  monthValue: string
  status?: ClassStatus
  venue?: string | null
}): Array<Omit<ManagedClass, 'id'>> {
  const [year, month] = monthValue.split('-').map(Number)
  const monthIndex = month - 1
  const daysInMonth = getDaysInMonth(year, monthIndex)
  const generated: Array<Omit<ManagedClass, 'id'>> = []

  for (let day = 1; day <= daysInMonth; day += 1) {
    const currentDate = new Date(year, monthIndex, day)
    if (currentDate.getDay() !== template.weekday) continue

    generated.push({
      class_name: template.class_name,
      class_date: toClassDateIso(year, monthIndex, day, template.start_time),
      grade: template.grade,
      type: template.type,
      status,
      venue: venue?.trim() || template.venue,
      time_label: template.time_label,
      end_time: template.end_time,
    })
  }

  return generated
}
