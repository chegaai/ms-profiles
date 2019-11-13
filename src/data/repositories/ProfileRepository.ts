import { Profile, PROFILE_COLLECTION } from '../../domain/profile/Profile'
import { MongodbRepository } from '@nindoo/mongodb-data-layer'
import { Db, ObjectId } from 'mongodb'

export type SearchTerms = {
  group?: string,
  name?: string,
  email?: string
}

export class ProfileRepository extends MongodbRepository<Profile> {
  constructor (connection: Db) {
    super(connection.collection(PROFILE_COLLECTION))
  }

  async search (terms: SearchTerms, page?: number, size?: number) {
    const query: Record<string, any> = {}

    const { group, name, email } = terms

    if (group && ObjectId.isValid(group)) query.groups = new ObjectId(group)

    if (name) {
      const regex = new RegExp(name, 'ig')
      query['$or'] = [ { name: regex }, { lasName: regex } ]
    }

    if (email) query.email = email

    return this.runPaginatedQuery(query, page, size)
  }
}
