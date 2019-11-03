import { app } from './app'
import server from '@expresso/server'
import { IAppConfig } from '../app.config'

export function start (config: IAppConfig) {
  return server.start(app, config)
}

export default {
  start
}
