const { floor, random } = Math
/** Choice function that returns undefined when the input is an empty set */
export type Choice<T> = (options: T[]) => T | undefined
export const first = <T>(array: T[]): T | undefined => array[0]
export const last = <T>(array: T[]): T | undefined => array[array.length - 1]
/** Randomly choose a single value from an array */
export const choose = <T>(options: T[]): T | undefined => options[floor(random() * options.length)]
