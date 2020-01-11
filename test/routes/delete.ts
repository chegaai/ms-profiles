import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { config } from '../../src/app.config'
import { States, states } from '../utils/db/states'
import { AxiosInstance, AxiosResponse } from 'axios'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'

describe('DELETE /:id-or-slug', () => {
  let api: AxiosInstance
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

  describe('when profile exists', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState('validProfileExistsWithGroup')
      response = await api.delete('/5de314a59e334ae02bef3d40')
    })

    it('returns a 204 status code', () => {
      expect(response.status).to.be.equal(204)
    })
  })
})
