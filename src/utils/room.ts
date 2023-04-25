import type { Range } from '@/utils/range'
import type { MazeNode2D } from '@/utils/maze2d'

export type Exit = 'entrance' | 'exit'
export const directions: Direction2D[] = ['north', 'east', 'south', 'west']
export type Direction2D = 'east' | 'north' | 'south' | 'west'

export class Room2D implements MazeNode2D, Record<Direction2D, Room2D | Exit | null> {
  x!: number
  y!: number
  east: Room2D | Exit | null = null
  north: Room2D | Exit | null = null
  south: Room2D | Exit | null = null
  west: Room2D | Exit | null = null
  constructor(node: MazeNode2D) {
    // Copy all properties of the Node
    Object.assign(this, node)
  }
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      exits: directions.filter((key) => this[key])
    }
  }
  relativePositionKey(other: Room2D): 'east' | 'north' | 'south' | 'west' {
    const result = (
      [
        [undefined, 'north', undefined],
        ['west', undefined, 'east'],
        [undefined, 'south', undefined]
      ] as const
    )[1 + other.y - this.y][1 + other.x - this.x]
    // No idea why this is necessary. Prettier is crashing on the <expression> ?? throw new Error(…) language construct.
    if (!result) {
      throw new Error('Relative position works only for direct neighbours!')
    }
    return result
  }
  withExit(dir: Direction2D, exit: Exit): this {
    this[dir] = exit
    return this
  }
  withNeighbour(neighbour: Room2D): this {
    this[this.relativePositionKey(neighbour)] = neighbour
    return this
  }
  /** Returns a bitmask of which exits are available. Can be used by renderer to map tiles. */
  get tileType(): Range<0, 15> {
    return directions.reduce(
      (tileType, cardinal, index) => (tileType |= (this[cardinal] ? 0x01 : 0) << index),
      0x0
    ) as unknown as Range<0, 15>
  }
}
