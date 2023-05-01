import type { Room2D, Direction2D } from '@/utils/room'

export class Player2D {
  private exit!: () => void

  exitReached: Promise<void> = new Promise((resolve) => (this.exit = resolve as () => void))

  get x() {
    return this.room.x
  }

  get y() {
    return this.room.y
  }

  get room() {
    return this._room
  }
  constructor(
    // For now you can't change controls on an existing Player2D
    private _room: Room2D,
    public direction: Direction2D = 'south'
  ) {}
  move(dir: Direction2D) {
    this.direction = dir
    if (this._room[dir] == null || this._room[dir] === 'entrance') {
      return false
    } else if (this._room[dir] === 'exit') {
      this.exit()
      // This is not really a move
      return false
    } else {
      this._room = this._room[dir] as Room2D
    }
    return true
  }
}
