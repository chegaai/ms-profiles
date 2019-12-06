import { expect } from 'chai'
import { ObjectId } from 'mongodb'
import { validProfile } from '../mocks/profile'
import sinon, { SinonStubbedInstance } from 'sinon'
import { ProfileRepository } from '../../src/data/repositories/ProfileRepository'
import { find, leaveGroup, ProfileService } from '../../src/services/profiles/ProfileService'
import { ProfileNotFoundError } from '../../src/services/profiles/errors/ProfileNotFoundError'

describe('profile service', () => {
  let mockRepository: SinonStubbedInstance<ProfileRepository>
  let configuredFind: ProfileService['find']
  let configuredLeaveGroup: ProfileService['leaveGroup']

  before(() => {
    mockRepository = sinon.createStubInstance(ProfileRepository)
    configuredFind = find(mockRepository as any)
    configuredLeaveGroup = leaveGroup(mockRepository as any)
  })

  afterEach(() => {
    mockRepository.findById.reset()
    mockRepository.save.reset()
  })

  describe('find', () => {
    describe('when profile does not exist', () => {
      let result: any
      before(async () => {
        mockRepository.findById.resolves(null)
        result = await configuredFind('someInvalidId').catch(err => err)
      })

      it('throws a ProfileNotFoundError', () => {
        expect(result).to.be.instanceOf(ProfileNotFoundError)
      })
    })

    describe('when profile exists', () => {
      let result: any

      before(async () => {
        mockRepository.findById.resolves(validProfile)
        result = await configuredFind('5de314a59e334ae02bef3d40')
      })

      it('returns a valid profile', () => {
        expect(result).to.have.property('_id').which.is.instanceOf(ObjectId)
      })
    })
  })

  describe('leaveGroup', () => {
    describe('when profile exists', () => {
      before(async () => {
        mockRepository.findById.resolves(validProfile)
        mockRepository.save.resolves()
        await configuredLeaveGroup('5de314a59e334ae02bef3d40', '5de7eb23e93d5ce8d0a2749a')
      })

      it('updates profile', () => {
        expect(mockRepository.save.callCount).to.be.equal(1)
      })
    })

    describe('when profile does not exist', () => {
      let result: any

      before(async () => {
        mockRepository.findById.resolves(null)
        mockRepository.save.resolves()
        result = await configuredLeaveGroup('5de314a59e334ae02bef3d40', '5de7eb23e93d5ce8d0a2749a').catch(err => err)
      })

      it('throws a profileNotFound error', () => {
        expect(result).to.be.instanceOf(ProfileNotFoundError)
      })

      it('does not try to update the profile', () => {
        expect(mockRepository.save.callCount).to.be.equal(0)
      })
    })
  })
})
