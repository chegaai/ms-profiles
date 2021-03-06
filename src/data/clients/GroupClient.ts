import { ObjectId } from 'bson'
import axios, { AxiosInstance } from 'axios'

import { ClientConfig } from './structures/ClientConfig'
import { UnreachableServiceError } from './errors/UnreachableServiceError'

type SerializedGroup = {
  id: string
  founder: string
  organizers: string[]
}

export type Group = {
  id: ObjectId
  founder: string
  organizers: string[]
}

export type GroupClient = {
  findById (id: string): Promise<Group | null>
}

export async function findById (http: AxiosInstance, id: string): Promise<Group | null> {
  return http.get<SerializedGroup>(`/${id}`)
    .then(({ data }) => data)
    .then(({ id, ...group }) => ({ id: new ObjectId(id), ...group }))
    .catch(err => {
      if (!err.response) throw new UnreachableServiceError('ms-groups')
      if (err.response.status === 404) return null

      throw err
    })
}

export function getGroupClient (config: ClientConfig): GroupClient {
  const http = axios.create({
    baseURL: config.url,
    timeout: config.timeout
  })

  return {
    findById: async (id: string) => findById(http, id)
  }
}

export default { getGroupClient }
