import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import profileDomain from '../../../domain/profile/Profile'
import { ProfileService } from '../../../services/profiles/ProfileService'
import { ProfileNotFoundError } from '../../../services/profiles/errors/ProfileNotFoundError'

export function handleErrors (err: any, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof ProfileNotFoundError) {
    return next(boom.notFound(err.message, { code: 'profile-not-found' }))
  }
}

export function factory (service: ProfileService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const id = req.params.id

      const profile = await service.find(id)

      res.status(200)
        .json(profileDomain.profileToObject(profile))
    }),
    handleErrors
  ]
}

export default { factory }
