import { expect } from 'chai'
import { AxiosResponse } from 'axios'

export function isProfile (response: AxiosResponse) {
  expect(response.data).to.have.property('id')
  expect(response.data).to.have.property('name')
  expect(response.data).to.have.property('lastName')
  expect(response.data).to.have.property('email')
  expect(response.data).to.have.property('picture')
  expect(response.data).to.have.property('socialNetworks')
  expect(response.data).to.have.property('location')
  expect(response.data).to.have.property('language')
  expect(response.data).to.have.property('groups')
  expect(response.data).to.have.property('tags')
  expect(response.data).to.have.property('deletedAt')
  expect(response.data).to.have.property('updatedAt')
  expect(response.data).to.have.property('createdAt')
}
