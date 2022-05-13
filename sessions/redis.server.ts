// sessions/upstash.server.ts

import { Cookie, createSessionStorage } from '@remix-run/node'
import { Redis } from '@upstash/redis'
import * as crypto from 'crypto'
import * as yup from 'yup'

export const EXPIRATION_IN_SECONDS = 60

const schema = yup.object().shape({
  UPSTASH_REDIS_REST_URL: yup
    .string()
    .url()
    .required(),
  UPSTASH_REDIS_REST_TOKEN: yup
    .string()
    .required()
})

const env = schema.validateSync({
  UPSTASH_REDIS_REST_URL: process
    .env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process
    .env.UPSTASH_REDIS_REST_TOKEN
})

// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
export function createRedisStorage ({ cookie }: { cookie: Cookie}) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
  })

  return createSessionStorage({
    cookie,
    async createData (data, expires) {
      // Create a random id - taken from the core `createFileSessionStorage` Remix function.
      const randomBytes = crypto.randomBytes(8)
      const id = Buffer.from(randomBytes).toString('hex')
      // Call Upstash Redis HTTP API. Set expiration according to the cookie `expired property.
      await redis.setex(id, EXPIRATION_IN_SECONDS, JSON.stringify(data))

      console.log('session#create')
      return id
    },
    async readData (id) {
      console.log('session#read', id)
      return await redis.get(id)
    },
    async updateData (id, data, expires) {
      await redis.setex(id, EXPIRATION_IN_SECONDS, JSON.stringify(data))
      console.log('session#update')
    },
    async deleteData (id) {
      await redis.del(id)

      console.log('session#delete')
    }
  })
}
