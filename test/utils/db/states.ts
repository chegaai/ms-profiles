import { ObjectId } from 'mongodb'
import { validProfile } from '../../mocks/profile'
import { PROFILE_COLLECTION } from '../../../src/domain/profile/Profile'
import { StateMap } from '@irontitan/sloth/dist/modules/database/state-map'

export const stateNames = {
  validEmptyProfileExists: 'validEmptyProfileExists',
  validProfileExistsWithGroup: 'validProfileExistsWithGroup',
  twoValidEmptyProfilesExist: 'twoValidEmptyProfilesExist'
}

export const states: StateMap = {
  [stateNames.validEmptyProfileExists]: [
    {
      collection: PROFILE_COLLECTION,
      data: validProfile
    }
  ],
  [stateNames.validProfileExistsWithGroup]: [
    {
      collection: PROFILE_COLLECTION,
      data: { ...validProfile, groups: [new ObjectId('5de7eb23e93d5ce8d0a2749a')] }
    }
  ],
  [stateNames.twoValidEmptyProfilesExist]: [
    {
      collection: PROFILE_COLLECTION,
      data: [validProfile, { ...validProfile, _id: new ObjectId() }]
    }
  ]
}

export type States = typeof states
