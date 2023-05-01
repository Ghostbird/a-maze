import type { Player2D } from '@/utils/player'
import { directions, type Direction2D, Room2D } from '@/utils/room'

export type MovementType = 'step' | 'choice'
export type Movement2D = (player: Player2D, direction: Direction2D) => boolean
export const movement2d: Record<MovementType, Movement2D> = {
  step: stepMovement2d,
  choice: choiceMovement2d
}

export function stepMovement2d(player: Player2D, direction: Direction2D): boolean {
  return player.move(direction)
}

export function choiceMovement2d(player: Player2D, direction: Direction2D): boolean {
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
    // Always pause before the exit
    if (player.room[player.direction] === 'exit') {
      break;
    }
    if (
      directions.some(
        (dir) =>
          // If you see a room in this direction
          !!player.room[dir] &&
          // And it is not the direction of travel
          dir !== direction &&
          // Nor the previous room
          player.room.relativePositionKey(previousRoom) !== dir
      )
    ) {
      break
    }
  }
  return result
}
