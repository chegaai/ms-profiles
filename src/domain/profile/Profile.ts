import url from 'url'
import omit from 'lodash.omit'
import { ObjectId } from 'bson'
import clone from 'lodash.clonedeep'
import { Location } from './structures/Location'
import { Nullable } from '../../structures/Nullable'
import { SocialNetwork } from './structures/SocialNetwork'
import { InvalidUrlError } from '../errors/InvalidUrlError'
import { ProfileCreationData } from './structures/ProfileCreationData'

export type Profile = {
  _id: ObjectId
  name: string
  lastName: string
  email: string
  picture: string
  socialNetworks: SocialNetwork[]
  location: Location
  language: string
  groups: ObjectId[]
  tags: string[]
  deletedAt: Nullable<Date>
  updatedAt: Date
  createdAt: Date
}

export const PROFILE_COLLECTION = 'profiles'

export type ProfileDomain = {
  createProfile (data: ProfileCreationData): Profile
  profileToObject (profile: Profile): unknown
}

export function updateProfile (profile: Profile, changes: Partial<Profile>) {
  const newProfile = clone(profile)

  const payload = omit(changes, [
    '_id',
    'email',
    'groups',
    'deletedAt',
    'updatedAt',
    'createdAt'
  ])

  for (const tuple of Object.entries(payload)) {
    const [ key, value ] = tuple

    if (key === 'socialNetworks') {
      for (const sn of value as SocialNetwork[]) {
        try {
          url.parse(sn.link)
        } catch (err) {
          throw new InvalidUrlError(sn.link)
        }
      }
    }

    if (value) {
      (newProfile as any)[key] = value
    }
  }

  newProfile.updatedAt = new Date()

  return newProfile
}

export function createProfile (data: ProfileCreationData): Profile {
  return {
    ...data,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function profileToObject ({ _id, ...profile }: Profile) {
  return {
    id: _id.toHexString(),
    ...profile,
    groups: profile.groups.map(groupId => groupId.toHexString())
  }
}

export const profileDomain: ProfileDomain = {
  createProfile,
  profileToObject
}

export default profileDomain
