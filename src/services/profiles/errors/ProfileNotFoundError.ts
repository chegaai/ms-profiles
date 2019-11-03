export class ProfileNotFoundError extends Error {
  constructor (id: string) {
    super(`profile \`${id}\` could not be found`)
  }
}
