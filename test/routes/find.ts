import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { config } from '../../src/app.config'
import { isProfile } from '../utils/is-profile'
import { States, states } from '../utils/db/states'
import { AxiosResponse } from 'axios'
import { profileNotFound } from '../utils/error-handling'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { handleErrors } from '../../src/presentation/routes/profiles/find'

describe('GET /:id-or-slug', () => {
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
      response = await api.get('/5de314a59e334ae02bef3d40')
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.be.equal(200)
    })

    it('returns the profile', () => {
      isProfile(response)
    })
  })
})
