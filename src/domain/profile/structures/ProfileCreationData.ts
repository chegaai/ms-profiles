import { ObjectId } from 'bson'
import { Location } from './Location'
import { SocialNetwork } from './SocialNetwork'

export type ProfileCreationData = {
  _id: ObjectId
  name: string
  lastName: string
  picture?: string
  socialNetworks: SocialNetwork[]
  location: Location
  language: string
  groups: ObjectId[]
  tags: string[]
}
