export type SocialNetwork = { name: string, link: string }

export type Location = {
  country: string
  state: string
  city: string
}

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
