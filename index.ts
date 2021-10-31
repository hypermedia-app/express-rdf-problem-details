import type * as express from 'express'
import { HttpProblemResponse } from 'express-http-problem-details'
import { DefaultMappingStrategy, IErrorMapper, MapperRegistry } from 'http-problem-details-mapper'
import setLink from 'set-link'

interface Factory {
  (arg?: { mappers?: IErrorMapper[]; context?: string }): express.ErrorRequestHandler
}

export const handler: Factory = ({ mappers = [], context = 'https://www.w3.org/ns/hydra/error' } = {}) => {
  const registry = mappers.reduce((r, mapper) => r.registerMapper(mapper, true), new MapperRegistry())

  const problemDetailsHandler = HttpProblemResponse({ strategy: new DefaultMappingStrategy(registry) })

  return (err, req, res, next) => {
    setLink.attach(res)

    res.setLink(context, 'http://www.w3.org/ns/json-ld#context')
    problemDetailsHandler(err, req, res, next)
  }
}
