import sloth from '@irontitan/sloth'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { AxiosResponse } from 'axios'
import axiosist from 'axiosist'
import { expect } from 'chai'
import env from 'sugar-env'
import { config } from '../../src/app.config'
import app from '../../src/presentation/app'
import { handleErrors } from '../../src/presentation/routes/profiles/find'
import { validProfile } from '../mocks/profile'
import { States, states } from '../utils/db/states'
import { profileNotFound } from '../utils/error-handling'
import { isProfile } from '../utils/is-profile'

describe('GET /me', () => {
  let api: any // Due to the fact that Axios has updated types and broke axiosist
  let database: SlothDatabase<States>

  before(async () => {
    database = await sloth.database.init(states)
    api = axiosist(await app.factory({ ...config, mongodb: database.config }, env.TEST))
  })

  afterEach(async () => {
    await database.clear()
  })

  after(async () => {
    await database.stop()
  })

  describe('error handling', () => {
    profileNotFound(handleErrors)
  })

  describe('when profile exists', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState('validEmptyProfileExists')
      response = await api.get('/me', { headers: { 'x-on-behalf-of': validProfile._id.toHexString() } })
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.be.equal(200)
    })

    it('returns the profile', () => {
      isProfile(response)
    })
  })
})
