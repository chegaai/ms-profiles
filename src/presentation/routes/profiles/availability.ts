import rescue from 'express-rescue'
import { Request, Response } from 'express'
import { validate } from '@expresso/validator'
import { ProfileService } from '../../../services/profiles/ProfileService'

export function factory (service: ProfileService) {
  return [
    validate.query({
      type: 'object',
      properties: {
        email: { type: 'string' }
      },
      required: ['email']
    }),
    rescue(async (req: Request, res: Response) => {
      const { email } = req.params

      const exists = await service.exists(email)

      res.status(200)
        .json({ available: !exists })
    })
  ]
}

export default { factory }
