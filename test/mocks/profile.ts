import { ObjectId } from 'mongodb'
import { Profile } from '../../src/domain/profile/Profile'

export const validProfile: Profile = {
  _id: new ObjectId('5de314a59e334ae02bef3d40'),
  name: 'John',
  lastName: 'Doe',
  picture: '',
  socialNetworks: [],
  location: {
    country: 'BR',
    state: 'SP',
    city: 'São Paulo'
  },
  language: 'pt-BR',
  groups: [],
  tags: [],
  deletedAt: null,
  updatedAt: new Date(),
  createdAt: new Date()
}

export const createProfileData = {
  id: validProfile._id.toHexString(),
  language: validProfile.language,
  lastName: validProfile.lastName,
  location: validProfile.location,
  name: validProfile.name,
  picture: validProfile.picture,
  socialNetworks: [],
  groups: [],
  tags: []
}
