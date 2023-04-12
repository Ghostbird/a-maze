import type { MazeNode } from '@/utils/maze'

export type Exit = 'entrance' | 'exit'
const directions: Direction[] = ['north', 'east', 'south', 'west']
export type Direction = 'east' | 'north' | 'south' | 'west'

export class Room implements MazeNode, Record<Direction, Room | Exit | null> {
  x!: number
  y!: number
  east: Room | Exit | null = null
  north: Room | Exit | null = null
  south: Room | Exit | null = null
  west: Room | Exit | null = null
  constructor(node: MazeNode) {
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
  relativePositionKey(other: Room): 'east' | 'north' | 'south' | 'west' {
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
  withExit(dir: Direction, exit: Exit): this {
    this[dir] = exit
    return this
  }
  withNeighbour(neighbour: Room): this {
    this[this.relativePositionKey(neighbour)] = neighbour
    return this
  }
  get tileType() {
    return ['north', 'east', 'south', 'west'].reduce(
      (tileType, cardinal, index) => (tileType |= cardinal ? 0x01 : 0 << index),
      0x0
    )
  }
}
