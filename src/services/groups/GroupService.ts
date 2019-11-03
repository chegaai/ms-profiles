import { Group, GroupClient } from '../../data/clients/GroupClient'
import { GroupNotFoundError } from './errors/GroupNotFoundError'

export type GroupService = {
  find: (id: string) => Promise<Group>
}

export async function find (client: GroupClient, id: string) {
  const group = await client.findById(id)

  if (!group) {
    throw new GroupNotFoundError(id)
  }

  return group
}

export function getGroupService (groupClient: GroupClient): GroupService {
  return {
    find: (id: string) => find(groupClient, id)
  }
}
