import { ObjectId } from 'bson'
import { GroupService } from '../groups/GroupService'
import { ProfileNotFoundError } from './errors/ProfileNotFoundError'
import { Profile, profileDomain } from '../../domain/profile/Profile'
import { ProfileCreationParams } from './structures/ProfileCreationParams'
import { ProfileRepository } from '../../data/repositories/ProfileRepository'

export type ProfileService = {
  create: (data: ProfileCreationParams) => Promise<Profile>
  find: (id: string) => Promise<Profile>
}

function findGroup (groupService: GroupService) {
  return async (id: string) => {
    return groupService.find(id).then(group => group.id)
  }
}

export async function create (profileRepository: ProfileRepository, groupService: GroupService, { id, ...data }: ProfileCreationParams) {
  const groupIds = data.groups
    ? await Promise.all(data.groups.map(findGroup(groupService)))
    : []

  const _id = new ObjectId(id)

  const profile = profileDomain.createProfile({
    ...data,
    _id,
    socialNetworks: data.socialNetworks || [],
    tags: data.tags || [],
    groups: groupIds
  })

  await profileRepository.save(profile)

  return profile
}

export async function find (profileRepository: ProfileRepository, id: string): Promise<Profile> {
  const result = await profileRepository.findById(id)

  if (!result) throw new ProfileNotFoundError(id)

  return result
}

export function getProfileService (profileRepository: ProfileRepository, groupService: GroupService): ProfileService {
  return {
    create: (data) => create(profileRepository, groupService, data),
    find: (id: string) => find(profileRepository, id)
  }
}
