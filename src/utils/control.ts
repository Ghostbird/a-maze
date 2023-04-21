import type { Player2D } from '@/utils/player'
import type { Direction } from '@/utils/room'
import { Observable, filter, fromEvent, identity, map, tap } from 'rxjs'

export type Control2D = Observable<Direction>
export type KeyMap2D = Record<string, Direction | undefined>

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
    return direction
  })
)

export const movement = (
  player: Player2D,
  movement: Observable<Direction> = defaultKeyboardControls
) =>
  movement.pipe(
    map((direction) => player.move(direction)),
    filter(identity)
  )
