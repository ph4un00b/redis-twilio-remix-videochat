import { Redis } from '@upstash/redis'
import * as yup from 'yup'

export function database () {
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

  const db = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
  })

  return db
}
