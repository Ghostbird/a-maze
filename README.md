# A Maze

[Try it!](https://maze.ghostbird.nl)

On every page load, a new maze is generated. The exit is always the south from the bottom-right corner. After generation the entrance is chosen such that the length of the path through the maze is maximised.

## Features

- SVG render mode
- PNG tile-set render mode
- Dynamic loading of tile-sets
- Player animation movement
- Responsive UI
- Keyboard controls
- On-screen controls
- Step based movement
- Decision based movement
- Configurable maze size

## New feature ideas 

- Audio renderer, like the Selenetic Age maze in Myst.
- Load external tile-sets

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
