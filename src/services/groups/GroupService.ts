import { Group, GroupClient } from '../../data/clients/GroupClient'
import { GroupNotFoundError } from './errors/GroupNotFoundError'

type FindFn = (id: string) => Promise<Group>

export type GroupService = {
  find: FindFn
}

export function find (client: GroupClient): FindFn {
  return async (id: string) => {
    const group = await client.findById(id)

    if (!group) {
      throw new GroupNotFoundError(id)
    }

    return group
  }
}

export function getGroupService (groupClient: GroupClient): GroupService {
  return {
    find: find(groupClient)
  }
}
