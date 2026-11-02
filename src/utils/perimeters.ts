/**
 * Formats a perimeter label as "code - name", or just the name when the perimeter has no code.
 *
 * @param source_value - The perimeter code (can be null or undefined)
 * @param name - The perimeter name
 * @returns The label to display
 */
export const perimeterDisplay = (source_value: string | null | undefined, name: string | null | undefined): string =>
  [source_value, name].filter(Boolean).join(' - ')
