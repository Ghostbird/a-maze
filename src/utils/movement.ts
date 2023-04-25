import type { Player2D } from '@/utils/player'
import { directions, type Direction2D, Room2D } from '@/utils/room'
import { toRaw } from 'vue'

export type MovementType2D = 'step' | 'choice'
export type Movement2D = (player: Player2D, direction: Direction2D) => boolean
export const movement: Record<MovementType2D, Movement2D> = {
  step: stepMovement,
  choice: choiceMovement
}

export function stepMovement(player: Player2D, direction: Direction2D): boolean {
  return player.move(direction)
}

export function choiceMovement(player: Player2D, direction: Direction2D): boolean {
  let result = false
  let previousRoom: Room2D
  while (true) {
    previousRoom = player.room
    if (player.move(direction)) {
      // Return true if we moved at least once
      result = true
    } else {
      break
    }
    // Or it is the opposite direction
    if (
      directions.some(
        (dir) =>
        // If you see a room in this direction
        !!player.room[dir] &&
        // And it is not the direction of travel
        (dir !== direction
          // Nor the previous room
          && player.room.relativePositionKey(previousRoom) !== dir)
      )
    ) {
      break
    }
  }
  return result
}
