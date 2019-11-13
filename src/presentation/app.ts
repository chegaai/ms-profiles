import routes from './routes'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { IAppConfig } from '../app.config'
import mongodb from '@nindoo/mongodb-data-layer'
import { getGroupClient } from '../data/clients/GroupClient'
import { getGroupService } from '../services/groups/GroupService'
import { getProfileService } from '../services/profiles/ProfileService'
import { ProfileRepository } from '../data/repositories/ProfileRepository'

export const app = expresso(async (app, config: IAppConfig, environment) => {
  const mongodbConnection = await mongodb.createConnection(config.mongodb)
  const profileRepository = new ProfileRepository(mongodbConnection)
  const groupClient = getGroupClient(config.clients.group)

  const groupService = getGroupService(groupClient)
  const profileService = getProfileService(profileRepository, groupService)

  app.get('/', routes.profiles.search.factory(profileService))
  app.post('/', routes.profiles.create.factory(profileService))
  app.get('/:id', routes.profiles.find.factory(profileService))
  app.put('/:id', routes.profiles.update.factory(profileService))
  app.post('/:id/groups', routes.profiles.joinGroup.factory(profileService))
  app.delete('/:id/groups/:group', routes.profiles.leaveGroup.factory(profileService))

  app.use(errors(environment))

  return app
})
