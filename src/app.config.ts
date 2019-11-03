import env from 'sugar-env'
import { ClientConfig } from './data/clients/structures/ClientConfig'
import { IExpressoConfigOptions } from '@expresso/app'
import { IMongoParams } from '@nindoo/mongodb-data-layer'

export interface IAppConfig extends IExpressoConfigOptions {
  mongodb: IMongoParams,
  clients: {
    group: ClientConfig
  }
}

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
  }
}
