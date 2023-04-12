const { abs, floor, random } = Math
export interface MazeNode {
  x: number
  y: number
}
export type Maze<T> = Map<T, T[]>
export type Adjacency = <T>(...dimensions: ((x: T) => number)[]) => (a: T, b: T) => boolean
export type Choice<T> = (options: T[]) => T
// Schwartzian transform shuffle. Not as efficient as Fischer-Yates, but more functional and simple to understand.
export const shuffled = <T>(array: T[]): T[] =>
  array
    // Assign random numbers to each element
    .map((value) => ({ value, sort: random() }))
    // Sort by random numbers
    .sort((a, b) => a.sort - b.sort)
    // Remove random numbers after sorting
    .map((x) => x.value)
export const orthogonal: Adjacency =
  (...dimensions) =>
  (a, b) =>
    dimensions.reduce((diff, dimension) => (diff += abs(dimension(a) - dimension(b))), 0) === 1
export const nodesRectangle = (width: number, height: number): MazeNode[] =>
  new Array(width * height).fill({}).map((_, ix) => ({ x: ix % height, y: floor(ix / width) }))
export const choice = <T>(options: T[]) => options[floor(random() * options.length)]
export const generate = <T>(
  nodes: T[],
  adjacent: (a: T, b: T) => boolean,
  chooseNeighbour: Choice<T> = choice<T>,
  chooseStartingPoint: Choice<T> = (x) => x[0]
): Maze<T> => {
  // Choose a node where we will start
  const stack = [chooseStartingPoint(nodes)]
  // Map every node to a set of neighbours
  const maze = new Map(nodes.map((node) => [node, [] as T[]]))
  let node: T | undefined
  // We're not done if there are nodes on the stack.
  while ((node = stack[0])) {
    // Choose a random neighbour if any.
    const neighbour = chooseNeighbour(
      nodes.filter((other) => !maze.get(other)!.length && adjacent(node!, other))
    )
    // If no neighbours are found, this part is skipped and the next value loop iteration pops a node from stack
    if (neighbour) {
      maze.get(node)!.push(neighbour)
      maze.get(neighbour)!.push(node)
      // Push neighbour so it is the next node processed.
      stack.unshift(neighbour)
    } else {
      stack.shift()
    }
  }
  return maze
}
