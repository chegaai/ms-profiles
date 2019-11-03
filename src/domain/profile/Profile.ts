import { ObjectId } from 'bson'
import { Location } from './structures/Location'
import { Nullable } from '../../structures/Nullable'
import { SocialNetwork } from './structures/SocialNetwork'
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

function createProfile (data: ProfileCreationData): Profile {
  return {
    ...data,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function profileToObject ({ _id, ...profile }: Profile) {
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
