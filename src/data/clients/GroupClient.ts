import axios from 'axios'
import { ObjectId } from 'bson'
import { AxiosInstance } from 'axios'
import { ClientConfig } from './structures/ClientConfig'
import { UnreachableServiceError } from './errors/UnreachableServiceError'

type SerializedGroup = {
  id: string
}

export type Group = {
  id: ObjectId
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
      if (err.response.code == 404) return null

      throw err
    })
}

export function getGroupClient (config: ClientConfig): GroupClient {
  const http = axios.create({
    baseURL: config.url,
    timeout: config.timeout
  })

  return {
    findById: (id: string) => findById(http, id)
  }
}

export default { getGroupClient }
