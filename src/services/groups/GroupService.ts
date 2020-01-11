import { ObjectId } from 'mongodb'
import { GroupNotFoundError } from './errors/GroupNotFoundError'
import { Group, GroupClient } from '../../data/clients/GroupClient'

export type GroupService = {
  find: (id: string) => Promise<Group>,
  indepotentlyFind: (id: string) => Promise<Group | null>
}

export function find (client: GroupClient): GroupService['find'] {
  return async (id: string) => {
    const group = await client.findById(id)

    if (!group) {
      throw new GroupNotFoundError(id)
    }

    return group
  }
}

export function indepotentlyFind (client: GroupClient): GroupService['indepotentlyFind'] {
  return async (id: string | ObjectId) => {
    const searchId = typeof id === 'string'
      ? id
      : id.toHexString()

    return client.findById(searchId)
  }
}

export function getGroupService (groupClient: GroupClient): GroupService {
  return {
    find: find(groupClient),
    indepotentlyFind: indepotentlyFind(groupClient)
  }
}
