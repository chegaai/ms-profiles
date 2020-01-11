import { IExpressoRequest } from '@expresso/app'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { NextFunction, Request, Response } from 'express'
import rescue from 'express-rescue'
import { InvalidUrlError } from '../../../domain/errors/InvalidUrlError'
import { Profile, profileToObject } from '../../../domain/profile/Profile'
import { ProfileNotFoundError } from '../../../services/profiles/errors/ProfileNotFoundError'
import { ProfileService } from '../../../services/profiles/ProfileService'

export function handleErrors (err: Error, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof ProfileNotFoundError) {
    return next(boom.notFound(err.message, { code: 'profile-not-found' }))
  }

  if (err instanceof InvalidUrlError) {
    return next(boom.badData(err.message, { code: 'invalid-social-network-link' }))
  }

  next(err)
}

export function factory (service: ProfileService) {
  return [
    validate({
      type: 'object',
      properties: {
        name: { type: 'string' },
        lastName: { type: 'string' },
        picture: { type: 'string' },
        socialNetworks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              link: { type: 'string' }
            },
            required: ['link', 'name']
          }
        },
        location: {
          type: 'object',
          properties: {
            country: { type: 'string' },
            state: { type: 'string' },
            city: { type: 'string' }
          },
          required: ['city', 'country', 'state']
        },
        language: { type: 'string' },
        tags: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      additionalProperties: false
    }),
    rescue(async (req: IExpressoRequest<Partial<Profile>, { id: string }>, res: Response) => {
      const id = req.params.id ?? req.onBehalfOf
      const changes = req.body

      const newProfile = await service.update(id, changes)

      res.status(200)
        .json(profileToObject(newProfile))
    }),
    handleErrors
  ]
}

export default { factory }
