import { ObjectId } from 'bson'
import { GroupService } from '../groups/GroupService'
import { ProfileNotFoundError } from './errors/ProfileNotFoundError'
import { IdAlreadyExistsError } from './errors/IdAlreadyExistsError'
import { BlobStorageClient } from '../../data/clients/BlobStorageClient'
import { ProfileCreationParams } from './structures/ProfileCreationParams'
import { ProfileRepository, SearchTerms } from '../../data/repositories/ProfileRepository'
import { Profile, profileDomain, updateProfile, addGroup, removeGroup, deleteProfile } from '../../domain/profile/Profile'

type CreateFn = (data: ProfileCreationParams) => Promise<Profile>
type FindFn = (id: string) => Promise<Profile>
type UpdateFn = (id: string, changes: Partial<Profile>) => Promise<Profile>
type FindManyByIdFn = ProfileRepository['findManyById']
type JoinGrupFn = (id: string, groupId: string) => Promise<Profile>
type LeaveGroupFn = (id: string, groupId: string) => Promise<Profile>
type SearchFn = ProfileRepository['search']
type GetCountFn = (term: SearchTerms) => Promise<number>
type DeleteFn = (id: string) => Promise<void>

export type ProfileService = {
  find: FindFn
  create: CreateFn
  update: UpdateFn
  search: SearchFn
  delete: DeleteFn
  getCount: GetCountFn
  joinGroup: JoinGrupFn
  leaveGroup: LeaveGroupFn
  findManyById: FindManyByIdFn
}

function findGroup (groupService: GroupService) {
  return async (id: string) => {
    return groupService.find(id).then(group => group.id)
  }
}

async function uploadBase64 (blobStorageClient: BlobStorageClient, base64: string): Promise<string> {
  const url = await blobStorageClient.uploadBase64(base64, 'image/*')
  if (!url) {
    throw Error() // TODO: throw better error handler
  }
  return url
}

export function create (repository: ProfileRepository, groupService: GroupService, blobStorageClient: BlobStorageClient): CreateFn {
  return async ({ id, ...data }) => {
    const groupIds = data.groups
      ? await Promise.all(data.groups.map(findGroup(groupService)))
      : []

    if (await repository.existsById(id)) {
      throw new IdAlreadyExistsError(id)
    }

    const _id = new ObjectId(id)

    const profile = profileDomain.createProfile({
      ...data,
      _id,
      socialNetworks: data.socialNetworks || [],
      tags: data.tags || [],
      groups: groupIds
    })

    if (profile.picture) profile.picture = await uploadBase64(blobStorageClient, profile.picture)

    await repository.save(profile)

    return profile
  }
}

export function update (repository: ProfileRepository, blobStorageClient: BlobStorageClient): UpdateFn {
  return async (id, changes) => {
    const profile = await find(repository)(id)

    if (changes.picture) changes.picture = await uploadBase64(blobStorageClient, changes.picture)

    const updatedProfile = updateProfile(profile, changes)

    await repository.save(updatedProfile)

    return updatedProfile
  }
}

export function find (repository: ProfileRepository): FindFn {
  return async (id) => {
    const profile = await repository.findById(id)

    if (!profile) throw new ProfileNotFoundError(id)

    return profile
  }
}

export function remove (repository: ProfileRepository): DeleteFn {
  return async (id) => {
    const profile = await repository.findById(id)
    if (!profile) return
    const newProfile = deleteProfile(profile)
    await repository.save(newProfile)
  }
}

export function joinGroup (repository: ProfileRepository, groupService: GroupService): JoinGrupFn {
  return async (id, groupId) => {
    const profile = await find(repository)(id)

    await groupService.find(groupId)

    const newProfile = addGroup(profile, new ObjectId(groupId))

    await repository.save(newProfile)

    return newProfile
  }
}

export function leaveGroup (repository: ProfileRepository): LeaveGroupFn {
  return async (id: string, groupId: string) => {
    const profile = await find(repository)(id)

    const newProfile = removeGroup(profile, groupId)

    await repository.save(newProfile)

    return newProfile
  }
}

export function getProfileService (repository: ProfileRepository, groupService: GroupService, blobStorageClient: BlobStorageClient): ProfileService {
  return {
    create: create(repository, groupService, blobStorageClient),
    joinGroup: joinGroup(repository, groupService),
    update: update(repository, blobStorageClient),
    search: repository.search.bind(repository),
    leaveGroup: leaveGroup(repository),
    find: find(repository),
    findManyById: repository.findManyById.bind(repository),
    getCount: repository.getCountByFilters.bind(repository),
    delete: remove(repository)
  }
}
