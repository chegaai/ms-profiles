export class EmailAlreadyExistsError extends Error {
  constructor (email: string) {
    super(`a profile with email \`${email}\` already exists`)
  }
}
