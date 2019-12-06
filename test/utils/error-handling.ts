import sinon from 'sinon'
import { expect } from 'chai'
import { boom } from '@expresso/errors'
import { ErrorRequestHandler } from 'express'
import { GroupNotFoundError } from '../../src/services/groups/errors/GroupNotFoundError'
import { ProfileNotFoundError } from '../../src/services/profiles/errors/ProfileNotFoundError'
import { UnreachableServiceError } from '../../src/data/clients/errors/UnreachableServiceError'
import { EmailAlreadyExistsError } from '../../src/services/profiles/errors/EmailAlreadyExistsError'

const nope = null as any

export type TestForErrorParams = {
  handleErrors: ErrorRequestHandler
  statusCode: number
  errorCode: string
  errorInstance: Error
  expectBoomError?: boolean
}

export const testForError = (params: TestForErrorParams) => {
  const {
    handleErrors,
    statusCode,
    errorCode,
    errorInstance,
    expectBoomError = true
  } = params

  let result: any

  before(() => {
    const next = sinon.spy()
    handleErrors(errorInstance, nope, nope, next)
    result = next.args[ 0 ][ 0 ]
  })

  it('returns a boom error', () => {
    expect(result).to.be.instanceOf(boom)
  })

  it(`returns a ${statusCode} status code`, () => {
    expect(result.output.statusCode).to.be.equal(statusCode)
  })

  if (expectBoomError) {
    it(`returns a \`${errorCode}\` error code`, () => {
      expect(result.data.code).to.be.equal(errorCode)
    })
  }
}

export const profileNotFound = (handleErrors: ErrorRequestHandler) => describe('when profile does not exist', () => {
  testForError({
    handleErrors,
    errorCode: 'profile-not-found',
    errorInstance: new ProfileNotFoundError(''),
    statusCode: 404
  })
})

export const serviceUnavailable = (handleErrors: ErrorRequestHandler, service: string) => describe(`when ${service} is unavailable`, () => {
  testForError({
    handleErrors,
    errorCode: 'unavailable-service',
    statusCode: 503,
    errorInstance: new UnreachableServiceError(service)
  })
})

export const groupDoesNotExist = (handleErrors: ErrorRequestHandler) => describe('when group does not exist', () => {
  testForError({
    handleErrors,
    errorCode: 'group-not-found',
    statusCode: 404,
    errorInstance: new GroupNotFoundError('')
  })
})

export const emailAlreadyExists = (handleErrors: ErrorRequestHandler) => describe('when a profile with given email already exists', () => {
  testForError({
    handleErrors,
    errorCode: 'email-already-exists',
    statusCode: 409,
    errorInstance: new EmailAlreadyExistsError('')
  })
})
