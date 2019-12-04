import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { ProfileService } from '../../../services/profiles/ProfileService'
import { ProfileNotFoundError } from '../../../services/profiles/errors/ProfileNotFoundError'

export function handleErrors (err: Error, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof ProfileNotFoundError) {
    return next(boom.notFound(err.message, { code: 'profile-not-found' }))
  }

  next(err)
}

export function factory (service: ProfileService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const id = req.params.id
      const groupId = req.params.group

      await service.leaveGroup(id, groupId)

      res.status(204)
        .end()
    }),
    handleErrors
  ]
}

export default { factory }
