import { Db, ObjectId } from 'mongodb'
import { Profile, PROFILE_COLLECTION } from '../../domain/profile/Profile'
import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'

export type SearchTerms = {
  group?: string
  name?: string
  ids?: string[]
}

function buildQuery (terms: SearchTerms) {
  const query: Record<string, any> = {}
  const { group, name } = terms

  if (group) query.groups = new ObjectId(group)

  if (name) {
    const regex = new RegExp(name, 'ig')
    query.$or = [ { name: regex }, { lasName: regex } ]
  }

  if (!terms.ids) return query

  return {
    $or: [ { ...query }, { _id: { $in: terms.ids.map(id => new ObjectId(id)) } } ]
  }
}

export class ProfileRepository extends MongodbRepository<Profile> {
  constructor (connection: Db) {
    super(connection.collection(PROFILE_COLLECTION))
  }

  async findManyById (userIds: Array<string | ObjectId>, page?: number, size?: number): Promise<PaginatedQueryResult<Profile>> {
    const userObjs = userIds.map((id: string | ObjectId) => new ObjectId(id))
    return this.runPaginatedQuery({ _id: { $in: userObjs }, deletedAt: null }, page, size)
  }

  async getCountByFilters (terms: SearchTerms) {
    const query = buildQuery(terms)
    return this.collection.countDocuments(query)
  }

  async search (terms: SearchTerms, page?: number, size?: number): Promise<PaginatedQueryResult<Profile>> {
    const query = buildQuery(terms)
    return this.runPaginatedQuery(query, page, size)
  }
}
