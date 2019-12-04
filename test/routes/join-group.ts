import nock from 'nock'
import env from 'sugar-env'
import { expect } from 'chai'
import axiosist from 'axiosist'
import { ObjectId } from 'mongodb'
import sloth from '@irontitan/sloth'
import app from '../../src/presentation/app'
import { States, states } from '../utils/db/states'
import { AxiosInstance, AxiosResponse } from 'axios'
import { config, IAppConfig } from '../../src/app.config'
import { SlothDatabase } from '@irontitan/sloth/dist/modules/database'
import { PROFILE_COLLECTION, Profile } from '../../src/domain/profile/Profile'
import { handleErrors } from '../../src/presentation/routes/profiles/join-group'
import { profileNotFound, serviceUnavailable, groupDoesNotExist } from '../utils/error-handling'

const options: IAppConfig = {
  ...config,
  clients: {
    group: {
      url: 'http://ms-gruop.mock',
      timeout: 3000
    }
  }
}

describe('POST /:id/groups', () => {
  let database: SlothDatabase<States>
  let api: AxiosInstance

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

  describe('error handling', () => {
    profileNotFound(handleErrors)
    serviceUnavailable(handleErrors, 'ms-group')
    groupDoesNotExist(handleErrors)
  })

  describe('when required params are missing', () => {
    let response: AxiosResponse

    before(async () => {
      response = await api.post('/5de30853412e7e9fe07076ae/groups', {})
    })

    it('returns a 422 status code', () => {
      expect(response.status).to.be.equal(422)
    })

    it('returns a `unprocessable_entity` error code', () => {
      expect(response.data.error.code).to.be.equal('unprocessable_entity')
    })
  })

  describe('when group is joined successfully', () => {
    let response: AxiosResponse
    let groupScope: nock.Scope
    let profile: Profile | null

    before(async () => {
      groupScope = nock(options.clients.group.url)
        .get('/5de30f7c4bded7cc7213e2a0')
        .reply(200, { id: '5de30f7c4bded7cc7213e2a0' })

      await database.setState('validEmptyProfileExists')

      response = await api.post('/5de314a59e334ae02bef3d40/groups', { id: '5de30f7c4bded7cc7213e2a0' })
      profile = await database.database.collection(PROFILE_COLLECTION).findOne<Profile>({ _id: new ObjectId('5de314a59e334ae02bef3d40') })
    })

    it('returns a 200 status code', () => {
      expect(response.status).to.be.equals(200)
    })

    it('calls ms-group to check if group exists', () => {
      expect(groupScope.isDone()).to.be.true
    })

    it('updates the profile in the database', () => {
      expect(profile?.groups.find(g => g.equals('5de30f7c4bded7cc7213e2a0'))).to.exist
    })
  })
})
