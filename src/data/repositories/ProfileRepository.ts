import { Profile, PROFILE_COLLECTION } from '../../domain/profile/Profile'
import { MongodbRepository } from '@nindoo/mongodb-data-layer'
import { Db } from 'mongodb'

export class ProfileRepository extends MongodbRepository<Profile> {
  constructor (connection: Db) {
    super(connection.collection(PROFILE_COLLECTION))
  }
}
