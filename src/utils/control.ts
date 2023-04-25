import type { Direction2D } from '@/utils/room'
import { Observable, filter, fromEvent, map } from 'rxjs'

export type Control2D = Observable<Direction2D>
export type KeyMap2D = Record<string, Direction2D | undefined>

export const arrowKeyMap: KeyMap2D = {
  ArrowUp: 'north',
  ArrowLeft: 'west',
  ArrowDown: 'south',
  ArrowRight: 'east'
}

export const wasdKeyMap: KeyMap2D = {
  W: 'north',
  A: 'west',
  S: 'south',
  D: 'east'
}

export const defaultKeyMap = { ...arrowKeyMap, ...wasdKeyMap }

export const defaultKeyboardControls = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
  map((keyPress) => [keyPress, defaultKeyMap[keyPress.key]] as const),
  // Skip all non-mapped results
  filter(([, direction]) => !!direction),
  map(([keyPress, direction]) => {
    keyPress.preventDefault()
    // The filter effectively removed `undefined` from the type union, but this is the first place where we can enforce it.
    return direction as Direction2D
  })
)
