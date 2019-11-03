export class UnreachableServiceError extends Error {
  constructor (service: string) {
    super(`service \`${service}\` is unreachable at the moment`)
  }
}
