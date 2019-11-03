export class GroupNotFoundError extends Error {
  constructor (id: string) {
    super(`Group \`${id}\` could not be found`)
  }
}
