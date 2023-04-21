import type { Room2D, Direction } from '@/utils/room'

export class Player2D {
  private win!: () => void
  private lose!: () => void
  gameEnd: Promise<void> = new Promise((resolve, reject) => {
    this.win = resolve as () => void
    this.lose = reject
  })
  constructor(public room: Room2D, public direction: Direction = 'south') {}
  move(dir: Direction) {
    this.direction = dir
    if (this.room[dir] == null || this.room[dir] === 'entrance') {
      return false
    } else if (this.room[dir] === 'exit') {
      this.win()
    } else {
      this.room = this.room[dir] as Room2D
    }
    return true
  }
}
