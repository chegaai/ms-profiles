import { Response } from 'express'
import rescue from 'express-rescue'
import { IExpressoRequest } from '@expresso/app'
import { ProfileService } from '../../../services/profiles/ProfileService'

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

      const groups = await service.getGroups(onBehalfOf)

      return res.status(200)
        .json(groups)
    })
  ]
}

export default { factory }
