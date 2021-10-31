import { describe, it } from 'mocha'
import express from 'express'
import request from 'supertest'
import { BadRequest } from 'http-errors'
import { expect } from 'chai'
import * as error from '..'

describe('express-rdf-problem-details', () => {
  it('sets context link', async () => {
    // given
    const app = express()
    app
      .use((req, res, next) => next(404))
      .use(error.handler())

    // when
    const response = request(app).get('/foo')

    await response.expect('link', /^<https:\/\/www\.w3\.org\/ns\/hydra\/error>/)
  })

  it('allows customizing mappers', async () => {
    // given
    const app = express()
    app
      .use((req, res, next) => next(new BadRequest()))
      .use(error.handler({
        mappers: [new (class {
          get error() {
            return 'BadRequestError'
          }

          mapError() {
            return {
              title: 'something wrong',
              status: 400,
            }
          }
        })()],
      }))

    // when
    const { body } = await request(app).get('/foo')

    expect(body).to.have.property('title', 'something wrong')
  })

  it('allows changing context', async () => {
    // given
    const app = express()
    app
      .use((req, res, next) => next(404))
      .use(error.handler({
        context: 'https://example.com/error.jsonld',
      }))

    // when
    const response = request(app).get('/foo')

    await response.expect('link', /^<https:\/\/example\.com\/error\.jsonld>/)
  })
})
