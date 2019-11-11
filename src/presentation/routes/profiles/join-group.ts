import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { profileToObject } from '../../../domain/profile/Profile'
import { ProfileService } from '../../../services/profiles/ProfileService'
import { ProfileNotFoundError } from '../../../services/profiles/errors/ProfileNotFoundError'
import { GroupNotFoundError } from '../../../services/groups/errors/GroupNotFoundError'

export function factory (service: ProfileService) {
  return [
    validate({
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id']
    }),
    rescue(async (req: Request, res: Response) => {
      const id = req.params.id
      const groupId = req.body.id

      const newProfile = await service.joinGroup(id, groupId)

      res.status(200)
        .json(profileToObject(newProfile))
    }),
    (err: Error, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof ProfileNotFoundError) {
        return next(boom.notFound(err.message, { code: 'profile-not-found' }))
      }

      if (err instanceof GroupNotFoundError) {
        return next(boom.notFound(err.message, { code: 'group-not-found' }))
      }

      next(err)
    }
  ]
}

export default { factory }
