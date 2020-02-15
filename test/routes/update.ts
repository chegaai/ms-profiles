import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import { ObjectId } from 'mongodb'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { config } from '../../src/app.config'
import { isProfile } from '../utils/is-profile'
import { AxiosResponse } from 'axios'
import { profileNotFound } from '../utils/error-handling'
import { States, states, stateNames } from '../utils/db/states'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { handleErrors } from '../../src/presentation/routes/profiles/update'
import { Profile, PROFILE_COLLECTION } from '../../src/domain/profile/Profile'

describe('PUT /:id', () => {
  let api: any // Due to the fact that Axios has updated types and broke axiosist
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

  describe('when trying to update forbidden fields', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState(stateNames.validEmptyProfileExists)
      response = await api.put('/5de314a59e334ae02bef3d40', { id: '5de314a59e334ae02bef3d41' })
    })

    it('returns a 422 status code', () => {
      expect(response.status).to.be.equal(422)
    })

    it('returns an `unprocessable_entity` error code', () => {
      expect(response.data.error?.code).to.be.equal('unprocessable_entity')
    })
  })

  describe('when all sent fields are updatable', () => {
    let response: AxiosResponse
    let updatedProfile: Profile | null

    before(async () => {
      await database.setState(stateNames.validEmptyProfileExists)
      response = await api.put('/5de314a59e334ae02bef3d40', { name: 'Jane' })
      updatedProfile = await database.database.collection(PROFILE_COLLECTION).findOne({ _id: new ObjectId('5de314a59e334ae02bef3d40') })
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.be.equal(200)
    })

    it('returns the updated profile', () => {
      isProfile(response)
    })

    it('updates the profile in the database', () => {
      expect(updatedProfile?.name).to.be.equal('Jane')
    })
  })
})
