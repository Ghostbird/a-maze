import { last, type Choice, choose, first } from '@/utils/choice'
import {
  orthogonal,
  farthestEdgeNode,
  generate,
  type Maze,
} from '@/utils/maze'
import { Room2D, type Exit } from '@/utils/room'
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

/** Generate a rectangular 2D maze. The entrance is placed to maximise travel distance through the maze.
 * You can customise the maze by passing different selection functions for the neighbour choice function and the exit choice function
 */
export const maze2d = (
  width: number,
  height: number,
  chooseNeighbour: Choice<Room2D> = choose<Room2D>,
  chooseExit = last,
  chooseContinuation = first
) => {
  const nodes = nodesRectangle(width, height).map((node) => new Room2D(node))
  const maze = generate<Room2D>(
    nodes,
    orthogonal<MazeNode2D>(...MazeNode2D.dimensions),
    chooseNeighbour,
    chooseExit,
    chooseContinuation
  )
  const rooms = Array.from(maze).map(([room, neighbours]) =>
    neighbours.reduce((room: Room2D, neighbour) => room.withNeighbour(neighbour), room)
  )
  // Add entrance and exit
  return Array.from(addFarthestExit(maze, chooseExit(rooms)!.withExit('south', 'entrance'), 'entrance').keys())
}

/** Add an Exit at the farthest edge Room2D of a Maze<Room2D> relative to the start.
 * Note that the Exit can be an 'entrance.
 * This depends on whether you lock the exit in place and look for a suitable entrance, or vice versa.
*/
const addFarthestExit = (maze: Maze<Room2D>, start: Room2D, exitType: Exit = 'exit') => {
  // Get the farthest edge node, including the valid exit directions. 
  const exit = farthestEdgeNode(maze, start, ...MazeNode2D.dimensions)
  const exitLimit = choose(exit.limits)!
  // Craft a pseudo room that is a copy of the exit to take advantage of `relativePositionKey` later
  const entrance = new Room2D({ ...exit.node })
  // Shift the pseudo room one step on the limit dimension so it lies outside the maze
  exitLimit.dimension.set(entrance, exitLimit.dimension.get(entrance) + exitLimit.sign)
  // Connect to the pseudo room from the chosen exit, this creates an entrance
  exit.node.withExit(exit.node.relativePositionKey(entrance), exitType)
  return maze
}
