import { expect } from 'chai'
import { ObjectId } from 'mongodb'
import axios, { AxiosInstance } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { findById } from '../../../src/data/clients/GroupClient'
import { UnreachableServiceError } from '../../../src/data/clients/errors/UnreachableServiceError'

describe('ms-group client', () => {
  let mock: AxiosMockAdapter
  let http: AxiosInstance

  before(() => {
    http = axios.create()
    mock = new AxiosMockAdapter(http)
  })

  after(() => {
    mock.restore()
  })

  afterEach(() => {
    mock.reset()
  })

  describe('findById', () => {
    describe('when ms-group is unavailable', () => {
      let result: any

      before(async () => {
        mock.onGet('/someGroup').timeoutOnce()
        result = await findById(http, 'someGroup').catch(err => err)
      })

      it('should reject an UnreachableServiceError', async () => {
        expect(result).to.be.instanceOf(UnreachableServiceError)
      })
    })

    describe('when group does not exist', () => {
      let result: any

      before(async () => {
        mock.onGet('/someGroup').replyOnce(404)
        result = await findById(http, 'someGroup').catch(err => err)
      })

      it('should return null', async () => {
        expect(result).to.equal(null)
      })
    })

    describe('when group exists', () => {
      let result: any

      before(async () => {
        mock.onGet('/someGroup').replyOnce(200, { id: '5de2f867d24c967e98bf0e0d' })
        result = await findById(http, 'someGroup').catch(err => err)
      })

      it('should return the group', () => {
        expect(result).to.be.eql({ id: new ObjectId('5de2f867d24c967e98bf0e0d') })
      })
    })
  })
})
