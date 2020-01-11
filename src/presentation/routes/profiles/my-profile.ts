import { IExpressoRequest } from '@expresso/app'
import { boom } from '@expresso/errors'
import { NextFunction, Request, Response } from 'express'
import rescue from 'express-rescue'
import { profileToObject } from '../../../domain/profile/Profile'
import { ProfileNotFoundError } from '../../../services/profiles/errors/ProfileNotFoundError'
import { ProfileService } from '../../../services/profiles/ProfileService'

export function handleErrors (err: any, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof ProfileNotFoundError) {
    return next(boom.notFound(err.message, { code: 'profile-not-found' }))
  }
}

export function factory (service: ProfileService) {
  return [
    rescue(async (req: IExpressoRequest, res: Response) => {
      const onBehalfOf = Array.isArray(req.onBehalfOf)
        ? req.onBehalfOf[0]
        : req.onBehalfOf
      if (!onBehalfOf) {
        return res.status(403)
          .json({
            status: 403,
            error: {
              code: 'not_authenticated',
              message: 'you must be authenticated to perform this action'
            }
          })
      }

      const profile = await service.find(onBehalfOf)

      return res.status(200)
        .json(profileToObject(profile))
    }),
    handleErrors
  ]
}

export default { factory }
