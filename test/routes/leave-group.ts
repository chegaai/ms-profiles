import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import { ObjectId } from 'mongodb'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { config } from '../../src/app.config'
import { States, states } from '../utils/db/states'
import { AxiosInstance, AxiosResponse } from 'axios'
import { profileNotFound } from '../utils/error-handling'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { Profile, PROFILE_COLLECTION } from '../../src/domain/profile/Profile'
import { handleErrors } from '../../src/presentation/routes/profiles/leave-group'

describe('DELETE /:id/groups/:group', () => {
  let api: AxiosInstance
  let database: SlothDatabase<States>

  before(async () => {
    database = await sloth.database.init(states)
    api = axiosist(await app.factory({ ...config, mongodb: database.config }, env.TEST))
  })

  after(async () => {
    await database.stop()
  })

  afterEach(async () => {
    await database.clear()
  })

  describe('error handling', () => {
    profileNotFound(handleErrors)
  })

  describe('when group is not followed', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState('validEmptyProfileExists')
      response = await api.delete('/5de314a59e334ae02bef3d40/groups/5de7eb23e93d5ce8d0a2749a')
    })

    it('returns a 204 status code', () => {
      expect(response.status).to.be.equal(204)
    })

    it('returns an emtpy body', () => {
      expect(response.data).to.be.empty
    })
  })

  describe('when group is followed', () => {
    let response: AxiosResponse
    let updatedProfile: Profile | null

    before(async () => {
      await database.setState('validProfileExistsWithGroup')
      response = await api.delete('/5de314a59e334ae02bef3d40/groups/5de7eb23e93d5ce8d0a2749a')
      updatedProfile = await database.database.collection(PROFILE_COLLECTION).findOne({ _id: new ObjectId('5de314a59e334ae02bef3d40') })
    })

    it('returns a 204 status code', () => {
      expect(response.status).to.be.equal(204)
    })

    it('returns an empty body', () => {
      expect(response.data).to.be.empty
    })

    it('removes group from profile', () => {
      expect(updatedProfile?.groups.length).to.be.equal(0)
    })
  })
})
