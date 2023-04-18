import { orthogonal, choose, farthestEdgeNode, generate, type Maze } from '@/utils/maze'
import { Room2D } from '@/utils/room'
const { floor } = Math

export class MazeNode2D {
  x: number = 0
  y: number = 0
  static dimensions = [
    {
      get: (node: MazeNode2D) => node.x,
      set: (node: MazeNode2D, value: number) => (node.x = value)
    },
    {
      get: (node: MazeNode2D) => node.y,
      set: (node: MazeNode2D, value: number) => (node.y = value)
    }
  ]
}

/** Generate maze nodes in a rectangle shape. */
const nodesRectangle = (width: number, height: number): MazeNode2D[] =>
  new Array(width * height).fill({}).map((_, ix) => ({ x: ix % height, y: floor(ix / width) }))

/** Generate a random 2D maze. The entrance is place to maximise travel distance through the maze. */
export const maze2d = (
  width: number,
  height: number,
  exit = (rooms: Room2D[]) => rooms[rooms.length - 1]
) => {
  const nodes = nodesRectangle(width, height).map((node) => new Room2D(node))
  const maze = generate(nodes, orthogonal<MazeNode2D>(...MazeNode2D.dimensions), choose, exit)
  const rooms = Array.from(maze).map(([room, neighbours]) =>
  neighbours.reduce((room: Room2D, neighbour) => room.withNeighbour(neighbour), room)
  )
  // Add entrance and exit
  return Array.from(addFarthestEntrance(maze, exit(rooms).withExit('south', 'exit')).keys())
}

/** Add an entrance at the farthest edge node of relative to the exit */
const addFarthestEntrance = (maze: Maze<Room2D>, exit: Room2D) => {
  const start = farthestEdgeNode(maze, exit, ...MazeNode2D.dimensions)
  const startLimit = choose(start.limits)!
  const entrance = new Room2D({ ...start.node })
  startLimit.dimension.set(entrance, startLimit.dimension.get(entrance) + startLimit.sign)
  start.node.withExit(start.node.relativePositionKey(entrance), 'entrance')
  return maze
}
