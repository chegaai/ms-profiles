export class IdAlreadyExistsError extends Error {
  constructor (id: string) {
    super(`a profile with id \`${id}\` already exists`)
  }
}
