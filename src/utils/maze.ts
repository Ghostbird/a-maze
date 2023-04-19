import { choose, first, type Choice } from '@/utils/choice'

const { abs, min, max } = Math

/** A maze is a mapping of nodes to the nodes it connects to */
export type Maze<T> = Map<T, T[]>
export type Dimension<T> = {
  get: (point: T) => number
  set: (point: T, value: number) => void
}
/** Given a list of dimension extraction functions, returns an adjacency function for Ts in that many dimensions. */
export type Adjacency = <T>(...dimensions: Dimension<T>[]) => (a: T, b: T) => boolean
/** Returns a function that will return the adjacency function that returns true only when two nodes are orthogonally adjacent for a given number of dimensions */
export const orthogonal: Adjacency =
  (...dimensions) =>
  (a, b) =>
    dimensions.reduce(
      (diff, dimension) => (diff += abs(dimension.get(a) - dimension.get(b))),
      0
    ) === 1
/** Depth-first search maze generation */
export const generate = <T>(
  nodes: T[],
  adjacent: (a: T, b: T) => boolean,
  // Default is the random choice function
  chooseNeighbour: Choice<T> = choose<T>,
  /** Choose starting node for maze generation. Default is the first node */
  chooseStartingPoint: Choice<T> = first<T>,
  /** Next node selection function to change search method.
   * Nodes are in an array with the most recent processed node at the start.
   * The default is to choose the first node, which is equivalent to depth-first search. */
  chooseContinuation: Choice<T> = first<T>
): Maze<T> => {
  // Choose a node where we will start
  let unfinishedNodes = [chooseStartingPoint(nodes)!]
  // Initialise map of node + zero connected neighbours
  const maze = new Map(nodes.map((node) => [node, [] as T[]]))
  let node: T | undefined
  // We're not done if there are nodes on the stack.
  while ((node = chooseContinuation(unfinishedNodes))) {
    // Choose a random neighbour if any.
    const neighbour = chooseNeighbour(
      nodes.filter((other) => !maze.get(other)!.length && adjacent(node!, other))
    )
    if (neighbour) {
      // Connect the two nodes
      maze.get(node)!.push(neighbour)
      maze.get(neighbour)!.push(node)
      // Add neighbour to list of unfinished nodes
      unfinishedNodes.unshift(neighbour)
    } else {
      // If no neighbours are found, this node is finished
      unfinishedNodes = unfinishedNodes.filter((n) => n !== node)
    }
  }
  return maze
}

/** Map all maze nodes to their distance from a given starting node */
export const distanceMap = <T>(maze: Maze<T>, start: T): Map<T, number> => {
  const stack = [start]
  const mutableMaze = new Map(
    Array.from(maze.entries()).map(([node, neighbours]) => [node, [...neighbours]])
  )
  const distances = new Map(Array.from(maze.entries()).map(([node]) => [node, 0]))
  let node: T | undefined
  // We're not done if there are nodes on the stack.
  while ((node = stack[0])) {
    // Pick a neighbour
    const neighbour = mutableMaze.get(node)?.pop()
    if (neighbour) {
      // Remove path that we followed here.
      mutableMaze.set(
        neighbour,
        mutableMaze.get(neighbour)!.filter((n) => n !== node)
      )
      // Set neighbour distance
      distances.set(neighbour, distances.get(node)! + 1)
      // Continue processing from the neighbour node.
      stack.unshift(neighbour)
    } else {
      // If no neighbours are found, backtrack
      stack.shift()
    }
  }
  return distances
}

/** Return the maze node farthest from a given starting point.
 *
 * If multiple nodes have the same distance, the first one found is returned
 */
export const farthestNode = <T>(maze: Maze<T>, start: T): T =>
  Array.from(distanceMap(maze, start).entries()).reduce((farthest, current) =>
    current[1] > farthest[1] ? current : farthest
  )[0]

/** Returns the node that lies on the edge of the maze, farthest from a given starting point
 * Also return the dimensions in which it lies on the edge, and in which direction.
 */
export const farthestEdgeNode = <T>(maze: Maze<T>, start: T, ...dimensions: Dimension<T>[]) => {
  // First calculate the minimum and maximum value for every dimension of the maze.
  const limits = dimensions.map((dimension) => ({
    dimension: dimension,
    min: Array.from(maze.keys())
      .map((node) => dimension.get(node))
      .reduce((a, b) => min(a, b)),
    max: Array.from(maze.keys())
      .map((node) => dimension.get(node))
      .reduce((a, b) => max(a, b))
  }))
  // Filter all nodes so we only keep edge nodes, but for each, note in which dimension and in what direction the edge lies.
  const edgeNodes = Array.from(maze.keys())
    .map((node) => ({
      node: node,
      limits: limits
        .map((limit) => {
          const dimVal = limit.dimension.get(node)
          return {
            dimension: limit.dimension,
            /** Sign is -1 (at minimum for dimension), 0 (not at limit for dimension), or +1 (at maximum for dimension) */
            sign: dimVal === limit.min ? -1 : dimVal === limit.max ? +1 : 0
          }
        })
        .filter((limit) => limit.sign !== 0)
    }))
    .filter(({ limits }) => limits.length)

  // Calculate path lengths in maze
  const distances = distanceMap(maze, start)
  // Get the edge node with the highest distance from start
  return edgeNodes.reduce((max, curr) =>
    distances.get(curr.node)! > distances.get(max.node)! ? curr : max
  )
}
