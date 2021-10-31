# express-rdf-problem-details

This package wraps [express-http-problem-details](https://github.com/PDMLab/express-http-problem-details) so that RDF/Linked Data express applications will return Problem documents ([RFC7807](https://tools.ietf.org/html/rfc7807)) as valid JSON-LD.

This is done simply by adding a `Link` header pointing to a JSON-LD `@context`. By default, it's the [context provided by Hydra Community Group](http://www.hydra-cg.com/spec/latest/core/#example-31-rfc-7807-compatible-error-description)

## Usage

```typescript
import express from 'express'
import * as error from 'express-rdf-problem-details'
import { NotFoundMapper } from './error-mappers'

const app = express()

// All params optional
express.use(error.handler({
  // change the @context URL
  context: 'http://example.com/error.jsonld',
  // additional mappers to customize error documents
  mappers: [new NotFoundMapper()] 
}))
```

Implementing mappers is explained in [PDMLab/express-http-problem-details](https://github.com/PDMLab/express-http-problem-details#example)
