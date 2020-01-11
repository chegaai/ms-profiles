import rescue from 'express-rescue'
import { Request, Response } from 'express'
import { ProfileService } from '../../../services/profiles/ProfileService'

export function factory (service: ProfileService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const id = req.params.id

      await service.delete(id)

      res.status(204)
        .end()
    })
  ]
}

export default { factory }
