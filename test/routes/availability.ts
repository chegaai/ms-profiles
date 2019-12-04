import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { config } from '../../src/app.config'
import { States, states } from '../utils/db/states'
import { AxiosInstance, AxiosResponse } from 'axios'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'

describe('GET /availability', () => {
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

  describe('when required parameter is missing', () => {
    let response: AxiosResponse

    before(async () => {
      response = await api.get('/availability')
    })

    it('returns a 422 status code', () => {
      expect(response.status).to.equal(422)
    })

    it('retuns a `unprocessable_entity` error code', () => {
      expect(response.data.error.code).to.equal('unprocessable_entity')
    })
  })

  describe('when profile exists', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState('validEmptyProfileExists')
      response = await api.get('/availability?email=john.doe@company.com')
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.equal(200)
    })

    it('returns an object with `available` set to false', () => {
      expect(response.data).to.eql({ available: false })
    })
  })

  describe('when profile does not exist', () => {
    let response: AxiosResponse

    before(async () => {
      response = await api.get('/availability?email=john.doe@company.com')
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.be.equal(200)
    })

    it('returns an object with `available` set to true', () => {
      expect(response.data).to.eql({ available: true })
    })
  })
})
