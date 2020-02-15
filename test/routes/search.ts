import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { config } from '../../src/app.config'
import { AxiosResponse } from 'axios'
import { States, states, stateNames } from '../utils/db/states'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'

describe('GET /', () => {
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

  describe('when no results are found', () => {
    let response: AxiosResponse

    before(async () => {
      response = await api.get('/')
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.be.equal(200)
    })

    it('returns an empty array', () => {
      expect(response.data).to.be.an('array').which.is.empty
    })
  })

  describe('when results are paginated', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState(stateNames.twoValidEmptyProfilesExist)
      response = await api.get('/?size=1')
    })

    it('returns a 206 status code', () => {
      expect(response.status).to.be.equal(206)
    })

    it('returns an array with the first results', () => {
      expect(response.data).to.be.an('array').with.length(1)
    })

    it('returns an x-content-range header', () => {
      expect(response.headers).to.have.property('x-content-range')
    })

    it('returns correct content range and pages info', () => {
      expect(response.headers['x-content-range']).to.be.equal('results 0-1/2')
    })
  })

  describe('when results are not paginated', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState(stateNames.validEmptyProfileExists)
      response = await api.get('/')
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.be.equal(200)
    })

    it('returns an array with the results', () => {
      expect(response.data).to.be.an('array').with.length(1)
    })

    it('does not return an x-content-range header', () => {
      expect(response.headers).to.not.have.property('x-content-range')
    })
  })

  describe('when `count` parameter is true', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState(stateNames.twoValidEmptyProfilesExist)
      response = await api.get('/?count=true')
    })

    it('returns the results count', () => {
      expect(response.data).to.have.property('count')
    })

    it('returns the correct count', () => {
      expect(response.data.count).to.be.equal(2)
    })
  })

  describe('when `count` parameter is false', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState(stateNames.twoValidEmptyProfilesExist)
      response = await api.get('/?count=false')
    })

    it('returns the results array', () => {
      expect(response.data).to.be.an('array')
    })

    it('does not return the count', () => {
      expect(response.data).not.to.have.property('count')
    })
  })
})
