import type { Player2D } from '@/utils/player'
import type { Direction2D, Room2D } from '@/utils/room'

const { abs, max, min } = Math

export const clamp = (minimum: number, value: number, maximum: number) =>
  max(minimum, min(value, maximum))
export const lerp = (from: number, to: number, fraction: number) =>
  from * (1 - clamp(0, fraction, 1)) + to * clamp(0, fraction, 1)

export class Player2DAnimation {
  private previousRoom: Room2D
  private lastMoveTime: number
  // I think this is kind of ugly, being driven by the animation loop polling, instead of pushed.
  // However I couldn't think of an alternative with a good decoupling of the components.
  currentRoom: Room2D
  x: number
  y: number
  direction: Direction2D

  constructor(private player: Player2D, private speed: number = 1 / 100) {
    this.previousRoom = this.currentRoom = player.room
    this.lastMoveTime = 0
    this.x = this.currentRoom.x
    this.y = this.currentRoom.y
    this.direction = this.player.direction
  }

  update(timeStamp: number) {
    // Detect whether player moved rooms
    if (this.player.room.x !== this.currentRoom.x || this.player.room.y !== this.currentRoom.y) {
      this.previousRoom = this.currentRoom
      this.currentRoom = this.player.room
      this.lastMoveTime = timeStamp
      this.x = this.currentRoom.x
      this.y = this.currentRoom.y
    }
    // Update direction
    this.direction = this.player.direction
    // Update X
    const xDistance = abs(this.previousRoom.x - this.currentRoom.x)
    if (xDistance !== 0) {
      this.x = lerp(
        this.previousRoom.x,
        this.currentRoom.x,
        ((timeStamp - this.lastMoveTime) * this.speed) / xDistance
      )
    }
    // Update Y
    const yDistance = abs(this.previousRoom.y - this.currentRoom.y)
    if (yDistance !== 0) {
      this.y = lerp(
        this.previousRoom.y,
        this.currentRoom.y,
        ((timeStamp - this.lastMoveTime) * this.speed) / yDistance
      )
    }
  }
}
