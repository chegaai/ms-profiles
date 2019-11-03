import rescue from 'express-rescue'
import { Request, Response } from 'express'
import { validate } from '@expresso/validator'
import { ProfileService } from '../../../services/profiles/ProfileService'
import { ProfileCreationParams } from '../../../services/profiles/structures/ProfileCreationParams'
import profileDomain from '../../../domain/profile/Profile'

export function factory (service: ProfileService) {
  return [
    validate({
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        picture: { type: 'string' },
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
        'email',
        'language',
        'lastName',
        'location',
        'name',
        'picture'
      ]
    }),
    rescue(async (req: Request, res: Response) => {
      const payload: ProfileCreationParams = req.body

      const profile = await service.create(payload)

      res.status(201)
        .json(profileDomain.profileToObject(profile))
    })
  ]
}

export default { factory }
