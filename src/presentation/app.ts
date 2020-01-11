/* eslint-disable @typescript-eslint/no-misused-promises */
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import mongodb from '@nindoo/mongodb-data-layer'
import { IAppConfig } from '../app.config'
import { BlobStorageClient } from '../data/clients/BlobStorageClient'
import { getGroupClient } from '../data/clients/GroupClient'
import { ProfileRepository } from '../data/repositories/ProfileRepository'
import { getGroupService } from '../services/groups/GroupService'
import { getProfileService } from '../services/profiles/ProfileService'
import routes from './routes'

export const app = expresso(async (app, config: IAppConfig, environment) => {
  const mongodbConnection = await mongodb.createConnection(config.mongodb)
  const profileRepository = new ProfileRepository(mongodbConnection)
  const groupClient = getGroupClient(config.clients.group)

  const blobStorage = new BlobStorageClient(config.azure.storage)
  const groupService = getGroupService(groupClient)
  const profileService = getProfileService(profileRepository, groupService, blobStorage)

  app.get('/', routes.profiles.search.factory(profileService))
  app.post('/', routes.profiles.create.factory(profileService))
  app.get('/me', routes.profiles.myProfile.factory(profileService))
  app.get('/:id', routes.profiles.find.factory(profileService))
  app.put('/me', routes.profiles.update.factory(profileService))
  app.put('/:id', routes.profiles.update.factory(profileService))
  app.delete('/:id', routes.profiles.remove.factory(profileService))
  app.post('/:id/groups', routes.profiles.joinGroup.factory(profileService))
  app.delete('/:id/groups/:group', routes.profiles.leaveGroup.factory(profileService))

  app.get('/me/groups', routes.profiles.myGroups.factory(profileService))

  app.use(errors(environment))

  return app
})

export default { factory: app }
