import rescue from 'express-rescue'
import { Request, Response } from 'express'
import { validate } from '@expresso/validator'
import { profileToObject } from '../../../domain/profile/Profile'
import { ProfileService } from '../../../services/profiles/ProfileService'

export function factory (service: ProfileService) {
  return [
    validate.query({
      type: 'object',
      properties: {
        group: { type: 'string' },
        name: { type: 'string' },
        page: { type: 'string', pattern: '^[0-9]+$', default: 0 },
        size: { type: 'string', pattern: '^[0-9]+$', default: 10 },
        count: { type: 'boolean' }
      },
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const { group, name, page, size, count: getCount = false } = req.query

      if (getCount) {
        const count = await service.getCount({ group, name })

        res.status(200)
          .json({ count })

        return
      }

      const pageInt = page ? parseInt(page, 10) : undefined
      const sizeInt = size ? parseInt(size, 10) : undefined

      const terms = { group, name }

      const searchResult = await service.search(terms, pageInt, sizeInt)

      const { count, results, range, total } = searchResult

      const status = total > count ? 206 : 200

      if (status === 206) {
        res.append('x-content-range', `results ${range.from}-${range.to}/${total}`)
      }

      res.status(status)
        .json(results.map(profileToObject))
    })
  ]
}

export default { factory }
