import type { Room2D, Direction2D } from '@/utils/room'

export class Player2D {
  private exit!: () => void
  exitReached: Promise<void> = new Promise((resolve) => (this.exit = resolve as () => void))
  constructor(
    // For now you can't change controls on an existing Player2D
    public room: Room2D,
    public direction: Direction2D = 'south'
  ) {}
  move(dir: Direction2D) {
    this.direction = dir
    if (this.room[dir] == null || this.room[dir] === 'entrance') {
      return false
    } else if (this.room[dir] === 'exit') {
      this.exit()
      // This is not really a move
      return false;
    } else {
      this.room = this.room[dir] as Room2D
    }
    return true
  }
}
