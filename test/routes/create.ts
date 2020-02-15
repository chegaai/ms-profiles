import nock from 'nock'
import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { isProfile } from '../utils/is-profile'
import { States, states } from '../utils/db/states'
import { AxiosResponse } from 'axios'
import { createProfileData } from '../mocks/profile'
import { config, IAppConfig } from '../../src/app.config'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { Profile, PROFILE_COLLECTION } from '../../src/domain/profile/Profile'

const options: IAppConfig = {
  ...config,
  clients: {
    group: {
      url: 'http://ms-groups.mock',
      timeout: 3000
    }
  }
}

describe('POST /', () => {
  let api: any // Due to the fact that Axios has updated types and broke axiosist
  let database: SlothDatabase<States>

  before(async () => {
    database = await sloth.database.init(states)
    api = axiosist(await app.factory({ ...options, mongodb: database.config }, env.TEST))
  })

  afterEach(async () => {
    await database.clear()
  })

  after(async () => {
    await database.stop()
  })

  describe('when required parameters are missing', () => {
    let response: AxiosResponse

    before(async () => {
      response = await api.post('/', {})
    })

    it('returns a 422 status code', () => {
      expect(response.status).to.be.equal(422)
    })

    it('returns an `unprocessable_entity` error code', () => {
      expect(response.data.error?.code).to.be.equal('unprocessable_entity')
    })
  })

  describe('when id already exists', () => {
    let response: AxiosResponse

    before(async () => {
      await database.setState('validEmptyProfileExists')
      response = await api.post('/', { ...createProfileData })
    })

    it('returns a 409 status code', () => {
      expect(response.status).to.be.equal(409)
    })

    it('returns a `id_already_exists` error code', () => {
      expect(response.data.error?.code).to.be.equal('id_already_exists')
    })
  })

  describe('when profile does not exist', () => {
    let response: AxiosResponse
    let groupScope: nock.Scope
    let createdProfile: Profile | null

    before(async () => {
      groupScope = nock(options.clients.group.url)
        .get('/5de6b891ec3608788cdbab3f')
        .reply(200, { id: '5de6b891ec3608788cdbab3f' })

      response = await api.post('/', { ...createProfileData, groups: ['5de6b891ec3608788cdbab3f'] })

      createdProfile = await database.database.collection(PROFILE_COLLECTION).findOne({})
    })

    it('calls ms-groups to validate the given group IDs', () => {
      expect(groupScope.isDone()).to.be.true
    })

    it('returns 201', () => {
      expect(response.status).to.be.equal(201)
    })

    it('returns the created profile', () => {
      isProfile(response)
    })

    it('adds the gruops to the profile', () => {
      expect(createdProfile?.groups[0]).to.exist
      expect(createdProfile?.groups[0].equals('5de6b891ec3608788cdbab3f')).to.be.true
    })
  })
})
