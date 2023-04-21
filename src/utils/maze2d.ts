import { last, type Choice, choose, first } from '@/utils/choice'
import { orthogonal, farthestEdgeNode, generate, type Maze, edgeNodes } from '@/utils/maze'
import { Room2D, type Exit } from '@/utils/room'
const { floor } = Math

export interface Maze2D {
  rooms: Room2D[]
  start: Room2D
}

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

/** Generate a rectangular 2D maze. The entrance is placed to maximise travel distance through the maze.
 * You can customise the maze by passing different selection functions for the neighbour choice function and the exit choice function
 */
export const maze2d = (
  width: number,
  height: number,
  chooseNeighbour: Choice<Room2D> = choose<Room2D>,
  chooseExit = last,
  chooseContinuation = first
): Maze2D => {
  const nodes = nodesRectangle(width, height).map((node) => new Room2D(node))
  // Exit must be determined now
  const exit = chooseExit(nodes)!
  const maze = generate<Room2D>(
    nodes,
    orthogonal<MazeNode2D>(...MazeNode2D.dimensions),
    chooseNeighbour,
    () => exit,
    chooseContinuation
  )
  // Map neighbouring rooms
  // This could have been a for-loop, but a `.forEach` allows a destructuring pattern whereas a for-loop doesn't.
  Array.from(maze).forEach(([room, neighbours]) =>
    neighbours.forEach((neighbour) => room.withNeighbour(neighbour))
  )
  // Add entrance and exit
  const entrance = addFarthestExit(maze, exit.withExit('south', 'exit'), 'entrance')
  return {
    rooms: Array.from(maze.keys()),
    start: entrance
  }
}

/** Add an Exit at the farthest edge Room2D of a Maze<Room2D> relative to the start.
 * Note that the Exit can be an 'entrance'.
 * This depends on whether you lock the exit in place and look for a suitable entrance, or vice versa.
 */
const addFarthestExit = (maze: Maze<Room2D>, start: Room2D, exitType: Exit = 'exit') => {
  // Get the farthest edge node, including the valid exit directions.
  const exit = farthestEdgeNode(maze, start, edgeNodes(maze, start, ...MazeNode2D.dimensions))
  const exitEdge = choose(exit.edges)!
  // Craft a pseudo room that is a copy of the exit to take advantage of `relativePositionKey` later
  const outside = new Room2D({ ...exit.node })
  // Shift the pseudo room one step on the limit dimension so it lies outside the maze
  exitEdge.dimension.set(outside, exitEdge.dimension.get(outside) + exitEdge.sign)
  // Connect to the pseudo room from the chosen exit, this creates an entrance
  exit.node.withExit(exit.node.relativePositionKey(outside), exitType)
  return exit.node
}
