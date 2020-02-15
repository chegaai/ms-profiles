import { ObjectId } from 'bson'
import { config } from '../../app.config'
import { GroupService } from '../groups/GroupService'
import { Group } from '../../data/clients/GroupClient'
import { ProfileNotFoundError } from './errors/ProfileNotFoundError'
import { IdAlreadyExistsError } from './errors/IdAlreadyExistsError'
import { BlobStorageClient } from '../../data/clients/BlobStorageClient'
import { ProfileCreationParams } from './structures/ProfileCreationParams'
import { ProfileRepository, SearchTerms } from '../../data/repositories/ProfileRepository'
import { Profile, profileDomain, updateProfile, addGroup, removeGroup, deleteProfile } from '../../domain/profile/Profile'

export type ProfileService = {
  search: ProfileRepository['search']
  delete: (id: string) => Promise<void>
  find: (id: string) => Promise<Profile>
  getGroups: (id: string) => Promise<Group[]>
  findManyById: ProfileRepository['findManyById']
  getCount: (term: SearchTerms) => Promise<number>
  create: (data: ProfileCreationParams) => Promise<Profile>
  joinGroup: (id: string, groupId: string) => Promise<Profile>
  leaveGroup: (id: string, groupId: string) => Promise<Profile>
  update: (id: string, changes: Partial<Profile>) => Promise<Profile>
}

function search (repository: ProfileRepository, groupService: GroupService): ProfileService['search'] {
  return async (terms, page, size) => {
    if (!terms.group) return repository.search(terms, page, size)

    const { id, founder, organizers } = await groupService.find(terms.group)
    const newTerms: SearchTerms = { ...terms, ids: [founder, ...organizers], group: id.toHexString() }

    return repository.search(newTerms, page, size)
  }
}

function findGroup (groupService: GroupService) {
  return async (id: string) => {
    return groupService.find(id).then(group => group.id)
  }
}

async function uploadBase64 (blobStorageClient: BlobStorageClient, base64: string): Promise<string> {
  const url = await blobStorageClient.uploadBase64(base64, 'image/jpeg')
  if (!url) {
    throw Error() // TODO: throw better error handler
  }
  return url
}

export function create (repository: ProfileRepository, groupService: GroupService): ProfileService['create'] {
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

    profile.picture = config.profileDefaultImage

    await repository.save(profile)

    return profile
  }
}

export function update (repository: ProfileRepository, blobStorageClient: BlobStorageClient): ProfileService['update'] {
  return async (id, changes) => {
    const profile = await find(repository)(id)

    if (changes.picture) changes.picture = await uploadBase64(blobStorageClient, changes.picture)

    const updatedProfile = updateProfile(profile, changes)

    await repository.save(updatedProfile)

    return updatedProfile
  }
}

export function find (repository: ProfileRepository): ProfileService['find'] {
  return async (id) => {
    const profile = await repository.findById(id)

    if (!profile) throw new ProfileNotFoundError(id)

    return profile
  }
}

export function remove (repository: ProfileRepository): ProfileService['delete'] {
  return async (id) => {
    const profile = await repository.findById(id)
    if (!profile) return
    const newProfile = deleteProfile(profile)
    await repository.save(newProfile)
  }
}

export function joinGroup (repository: ProfileRepository, groupService: GroupService): ProfileService['joinGroup'] {
  return async (id, groupId) => {
    const profile = await find(repository)(id)

    await groupService.find(groupId)

    const newProfile = addGroup(profile, new ObjectId(groupId))

    await repository.save(newProfile)

    return newProfile
  }
}

export function leaveGroup (repository: ProfileRepository): ProfileService['leaveGroup'] {
  return async (id: string, groupId: string) => {
    const profile = await find(repository)(id)

    const newProfile = removeGroup(profile, groupId)

    await repository.save(newProfile)

    return newProfile
  }
}

export function getGroups (repository: ProfileRepository, groupService: GroupService): ProfileService['getGroups'] {
  return async (profileId: string) => {
    const profile = await find(repository)(profileId)

    const groupIds = profile.groups.map(groupId => groupId.toHexString())

    const groups = await Promise.all(groupIds.map(async groupId => groupService.find(groupId)))
      .then(results => results.filter(result => result !== null))

    return groups
  }
}

export function getProfileService (repository: ProfileRepository, groupService: GroupService, blobStorageClient: BlobStorageClient): ProfileService {
  return {
    find: find(repository),
    delete: remove(repository),
    leaveGroup: leaveGroup(repository),
    search: search(repository, groupService),
    update: update(repository, blobStorageClient),
    joinGroup: joinGroup(repository, groupService),
    getGroups: getGroups(repository, groupService),
    findManyById: repository.findManyById.bind(repository),
    getCount: repository.getCountByFilters.bind(repository),
    create: create(repository, groupService)
  }
}
