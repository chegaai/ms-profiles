import './tracing.ts'
import { config } from './app.config'
import server from './presentation/server'

server.start(config)
  .catch(err => {
    console.error('----- Fatal error -----')
    console.error(err)
    process.exit(1)
  })
