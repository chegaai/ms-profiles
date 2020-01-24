import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import profileDomain from '../../../domain/profile/Profile'
import { ProfileService } from '../../../services/profiles/ProfileService'
import { IdAlreadyExistsError } from '../../../services/profiles/errors/IdAlreadyExistsError'
import { ProfileCreationParams } from '../../../services/profiles/structures/ProfileCreationParams'

export function handleErrors (err: Error, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof IdAlreadyExistsError) {
    return next(boom.conflict(err.message, { code: 'id_already_exists' }))
  }

  next(err)
}

export function factory (service: ProfileService) {
  return [
    validate({
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        lastName: { type: 'string' },
        socialNetworks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              link: { type: 'string' }
            },
            required: [ 'link', 'name' ]
          }
        },
        location: {
          type: 'object',
          properties: {
            country: { type: 'string' },
            state: { type: 'string' },
            city: { type: 'string' }
          },
          required: [ 'city', 'country', 'state' ]
        },
        language: { type: 'string' },
        groups: {
          type: 'array',
          items: { type: 'string' }
        },
        tags: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: [
        'id',
        'language',
        'lastName',
        'location',
        'name'
      ]
    }),
    rescue(async (req: Request, res: Response) => {
      const payload: ProfileCreationParams = req.body

      const profile = await service.create(payload)

      res.status(201)
        .json(profileDomain.profileToObject(profile))
    }),
    handleErrors
  ]
}

export default { factory }
