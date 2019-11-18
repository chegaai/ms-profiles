import { Location } from '../../../domain/profile/structures/Location'
import { SocialNetwork } from '../../../domain/profile/structures/SocialNetwork'

export type ProfileCreationParams = {
  id: string
  name: string
  lastName: string
  email: string
  picture?: string
  socialNetworks?: SocialNetwork[]
  location: Location
  language: string
  groups?: string[]
  tags?: string[]
}
