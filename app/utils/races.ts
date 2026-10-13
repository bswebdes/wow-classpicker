// Völker je Spielmodus (Retail und Forever haben eigene Kombinationen)
import type { GameMode } from './classInfo'
import { foreverRaces } from './foreverInfo'
import { retailRaces } from './retailRaces'

export const getRaces = (mode: GameMode = 'retail') => mode === 'forever' ? foreverRaces : retailRaces

export const racesForClass = (classId: string, mode: GameMode = 'retail') =>
  getRaces(mode).filter(r => r.classes.includes(classId))

export const comboCount = (mode: GameMode = 'retail') =>
  getRaces(mode).reduce((sum, r) => sum + r.classes.length, 0)
