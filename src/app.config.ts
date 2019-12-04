import env from 'sugar-env'
import { ClientConfig } from './data/clients/structures/ClientConfig'
import { IExpressoConfigOptions } from '@expresso/app'
import { IMongoParams } from '@nindoo/mongodb-data-layer'

export type IAppConfig = {
  mongodb: IMongoParams
  clients: {
    group: ClientConfig
  }
  azure: {
    storage: {
      accountName: string
      accountAccessKey: string
      containerName: string
      timeOut: number
    }
  }
} & IExpressoConfigOptions

export const config: IAppConfig = {
  name: 'ms-profiles',
  mongodb: {
    uri: env.get('MONGODB_URI', 'mongodb://localhost:27017'),
    dbName: env.get('MONGODB_DBNAME', 'chegaai')
  },
  clients: {
    group: {
      url: env.get('CLIENTS_GROUP_URL', ''),
      timeout: env.get.int('CLIENTS_GROUP_TIMEOUT', 3000)
    }
  },
  azure: {
    storage: {
      accountName: env.get('AZURE_STORAGE_ACCOUNT_NAME', 'chegaai'),
      accountAccessKey: env.get('AZURE_STORAGE_ACCOUNT_ACCESS_KEY', ''),
      containerName: env.get('AZURE_STORAGE_CONTAINER_NAME', 'profiles'),
      timeOut: env.get('AZURE_STORAGE_TIMEOUT', 60000)
    }
  }
}
