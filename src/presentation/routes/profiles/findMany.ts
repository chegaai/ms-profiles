import rescue from 'express-rescue'
import { Response } from 'express'
import { validate } from '@expresso/validator'
import { profileToObject } from '../../../domain/profile/Profile'
import { ProfileService } from '../../../services/profiles/ProfileService'
import { IExpressoRequest } from '@expresso/app'

export function factory (service: ProfileService) {
  return [
    validate.query({
      type: 'object',
      properties: {
        users: { type: 'array', items: { type: 'string' } },
        page: { type: 'string', pattern: '^[0-9]+$', default: 0 },
        size: { type: 'string', pattern: '^[0-9]+$', default: 10 }
      },
      additionalProperties: false,
      required: ['users']
    }),
    rescue(async (req: IExpressoRequest<unknown, {}, { users: string[], page: string, size: string }>, res: Response) => {
      const { users, page, size } = req.query

      const searchResult = await service.findManyById(users, parseInt(page, 10), parseInt(size, 10))

      const { count, results, range, total } = searchResult

      const status = total > count ? 206 : 200

      if (status === 206) {
        res.append('x-content-range', `${range.from}-${range.to}/${total}`)
      }

      res.status(status)
        .json(results.map(profileToObject))
    })
  ]
}

export default { factory }
