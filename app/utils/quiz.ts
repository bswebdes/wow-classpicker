// Klassen-Quiz: Jede Antwort vergibt Punkte an Klassen, am Ende gewinnen die Top 3.
import { classRoles, getClassList, type ClassInfo, type GameMode, type Role } from './classInfo'

export interface QuizQuestion {
  id: string
  options: string[]
  // Punkte für eine Klasse bei gegebener Antwort und der höchstmögliche Wert der Frage
  score: (c: ClassInfo, answer: string, answers: Record<string, string>) => number
  max: (answer: string) => number
}

const themeMap: Record<string, string> = {
  might: 'warrior', holy: 'paladin', beasts: 'hunter', shadow: 'rogue', undead: 'deathknight',
  elements: 'shaman', arcane: 'mage', dark: 'warlock', martial: 'monk', nature: 'druid',
  fel: 'demonhunter', dragons: 'evoker'
}

const contentFit: Record<string, string[]> = {
  dungeons: ['demonhunter', 'monk', 'mage', 'hunter', 'rogue', 'evoker', 'paladin'],
  raids: ['warlock', 'mage', 'priest', 'paladin', 'evoker', 'shaman', 'druid'],
  pvp: ['rogue', 'mage', 'demonhunter', 'warrior', 'priest', 'druid', 'monk']
}

const complexityTarget: Record<string, number> = { simple: 1.5, medium: 3, complex: 4.5 }

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'role',
    options: ['tank', 'healer', 'dps', 'any'],
    score: (c, a) => a !== 'any' && classRoles(c).includes(a as Role) ? 3 : 0,
    max: a => a === 'any' ? 0 : 3
  },
  {
    id: 'range',
    options: ['melee', 'ranged', 'any'],
    score: (c, a, answers) => {
      if (a === 'any') return 0
      const role = answers.role
      return c.specs.some(s => s.range === a && (!role || role === 'any' || s.role === role)) ? 2 : 0
    },
    max: a => a === 'any' ? 0 : 2
  },
  {
    id: 'content',
    options: ['solo', 'dungeons', 'raids', 'pvp'],
    score: (c, a) => a === 'solo' ? Math.max(0, (c.solo - 2) * 1) : (contentFit[a]?.includes(c.id) ? 1.5 : 0),
    max: a => a === 'solo' ? 3 : 1.5
  },
  {
    id: 'complexity',
    options: ['simple', 'medium', 'complex'],
    score: (c, a) => Math.max(0, 2 - Math.abs(c.difficulty - complexityTarget[a]!) * 0.8),
    max: () => 2
  },
  {
    id: 'theme',
    options: Object.keys(themeMap),
    score: (c, a) => themeMap[a] === c.id ? 4 : 0,
    max: () => 4
  },
  {
    id: 'pets',
    options: ['yes', 'no', 'any'],
    score: (c, a) => {
      if (a === 'yes') return c.id === 'hunter' || c.id === 'warlock' ? 2 : c.id === 'deathknight' ? 1 : 0
      if (a === 'no') return c.id === 'hunter' || c.id === 'warlock' ? -1 : 0
      return 0
    },
    max: a => a === 'yes' ? 2 : 0
  },
  {
    id: 'armor',
    options: ['plate', 'mail', 'leather', 'cloth', 'any'],
    score: (c, a) => c.armor === a ? 2 : 0,
    max: a => a === 'any' ? 0 : 2
  }
]

// Fragen für einen Spielmodus: Fantasy-Optionen nur für Klassen, die es dort gibt
export const quizQuestionsFor = (mode: GameMode): QuizQuestion[] => {
  const ids = getClassList(mode).map(c => c.id)
  return quizQuestions.map(q => q.id === 'theme'
    ? { ...q, options: q.options.filter(o => ids.includes(themeMap[o]!)) }
    : q)
}

export const scoreQuiz = (answers: Record<string, string>, mode: GameMode = 'retail') => {
  const maxTotal = quizQuestions.reduce((sum, q) => sum + (answers[q.id] ? q.max(answers[q.id]!) : 0), 0) || 1
  return getClassList(mode)
    .map(c => {
      const score = quizQuestions.reduce((sum, q) => sum + (answers[q.id] ? q.score(c, answers[q.id]!, answers) : 0), 0)
      return { id: c.id, percent: Math.max(0, Math.min(100, Math.round((score / maxTotal) * 100))) }
    })
    .sort((a, b) => b.percent - a.percent)
}
