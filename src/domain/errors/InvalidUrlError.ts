import { DomainError } from './DomainError'

export class InvalidUrlError extends DomainError {
  constructor (url: string) {
    super(`"${url}" is not a valid URL`)
  }
}
