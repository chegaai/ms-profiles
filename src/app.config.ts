import env from 'sugar-env'
import { LogLevel} from '@opentelemetry/core'
import { IExpressoConfigOptions } from '@expresso/app'
import { IMongoParams } from '@nindoo/mongodb-data-layer'
import { IExpressoTracerConfig } from '@expresso/tracing/dist/types'
import { ClientConfig } from './data/clients/structures/ClientConfig'

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
  },
  tracing: IExpressoTracerConfig
} & IExpressoConfigOptions

const APP_NAME = 'ms-profiles'

export const config: IAppConfig = {
  name: APP_NAME,
  bodyParser: {
    json: {
      limit: '10mb'
    }
  },
  mongodb: {
    uri: env.get('DATABASE_MONGODB_URI', 'mongodb://localhost:27017'),
    dbName: env.get('DATABASE_MONGODB_DBNAME', 'chegaai')
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
  },
  tracing: {
    jaeger: {
      serviceName: APP_NAME,
      host: env.get('JAEGER_AGENT_HOST', '')
    },
    tracer: {
      logLevel: LogLevel.ERROR
    }
  }
}
