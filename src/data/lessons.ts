import type { LessonTemplate } from '../types/models'

export const lessonTemplates: LessonTemplate[] = [
  { id: 'g6-01', grade: 6, lesson_name: 'Sets', order_index: 1 },
  { id: 'g6-02', grade: 6, lesson_name: 'Place Value', order_index: 2 },
  { id: 'g6-03', grade: 6, lesson_name: 'Addition and Subtraction', order_index: 3 },
  { id: 'g6-04', grade: 6, lesson_name: 'Multiplication', order_index: 4 },
  { id: 'g6-05', grade: 6, lesson_name: 'Division', order_index: 5 },
  { id: 'g6-06', grade: 6, lesson_name: 'Estimation and Rounding Off', order_index: 6 },
  { id: 'g6-07', grade: 6, lesson_name: 'Patterns', order_index: 7 },
  { id: 'g6-08', grade: 6, lesson_name: 'Directions', order_index: 8 },
  { id: 'g6-09', grade: 6, lesson_name: 'Fractions', order_index: 9 },
  { id: 'g6-10', grade: 6, lesson_name: 'Decimals', order_index: 10 },
  { id: 'g6-11', grade: 6, lesson_name: 'Percentage', order_index: 11 },
  { id: 'g6-12', grade: 6, lesson_name: 'Rectilinear Plane Figures', order_index: 12 },
  { id: 'g6-13', grade: 6, lesson_name: 'Perimeter', order_index: 13 },
  { id: 'g6-14', grade: 6, lesson_name: 'Money', order_index: 14 },
  { id: 'g6-15', grade: 6, lesson_name: 'Length', order_index: 15 },
  { id: 'g6-16', grade: 6, lesson_name: 'Liquid Measurements', order_index: 16 },
  { id: 'g6-17', grade: 6, lesson_name: 'Solids', order_index: 17 },
  { id: 'g6-18', grade: 6, lesson_name: 'Algebraic Symbols', order_index: 18 },
  { id: 'g6-19', grade: 6, lesson_name: 'Bar Graphs', order_index: 19 },
  { id: 'g6-20', grade: 6, lesson_name: 'Symmetry', order_index: 20 },
  { id: 'g6-21', grade: 6, lesson_name: 'Time', order_index: 21 },
  { id: 'g6-22', grade: 6, lesson_name: 'Data Collection', order_index: 22 },
  { id: 'g6-23', grade: 6, lesson_name: 'Data Representation in Tables', order_index: 23 },
  { id: 'g6-24', grade: 6, lesson_name: 'Indices', order_index: 24 },
  { id: 'g6-25', grade: 6, lesson_name: 'Area', order_index: 25 },
]

export function getLessonTemplatesByGrade(grade: number) {
  return lessonTemplates
    .filter((lesson) => lesson.grade === grade)
    .sort((first, second) => first.order_index - second.order_index)
}
