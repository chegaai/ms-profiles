import { config } from './app.config'
import tracer from '@expresso/tracing/dist/tracer'
tracer.init(config.tracing)
