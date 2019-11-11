import { ObjectId } from 'bson'
import { GroupService } from '../groups/GroupService'
import { ProfileNotFoundError } from './errors/ProfileNotFoundError'
import { Profile, profileDomain, updateProfile } from '../../domain/profile/Profile'
import { ProfileRepository } from '../../data/repositories/ProfileRepository'
import { ProfileCreationParams } from './structures/ProfileCreationParams'

type CreateFn = (data: ProfileCreationParams) => Promise<Profile>
type FindFn = (id: string) => Promise<Profile>
type UpdateFn = (id: string, changes: Partial<Profile>) => Promise<Profile>

export type ProfileService = {
  create: CreateFn
  find: FindFn
  update: UpdateFn
}

function findGroup (groupService: GroupService) {
  return async (id: string) => {
    return groupService.find(id).then(group => group.id)
  }
}

export function create (repository: ProfileRepository, groupService: GroupService): CreateFn {
  return async ({ id, ...data }) => {
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

    await repository.save(profile)

    return profile
  }
}

export function find (repository: ProfileRepository): FindFn {
  return async (id) => {
    const result = await repository.findById(id)

    if (!result) throw new ProfileNotFoundError(id)

    return result
  }
}

export function update (repository: ProfileRepository): UpdateFn {
  return async (id, changes) => {
    const profile = await find(repository)(id)

    const updatedProfile = updateProfile(profile, changes)

    await repository.save(updatedProfile)

    return updatedProfile
  }
}

export function getProfileService (repository: ProfileRepository, groupService: GroupService): ProfileService {
  return {
    create: create(repository, groupService),
    find: find(repository),
    update: update(repository)
  }
}
