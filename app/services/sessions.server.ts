import { createCookie, createFileSessionStorage } from '@remix-run/node'
import { createRedisStorage, LAST_ONE_DAY } from 'sessions/redis.server'
import * as yup from 'yup'

const schema = yup.object().shape({
  COOKIE_SECRET: yup
    .string()
    .min(32)
    .required()
})

const env = schema.validateSync({
  COOKIE_SECRET: process
    .env.COOKIE_SECRET
})

const expires = new Date()
const seconds =
  expires.getSeconds() + LAST_ONE_DAY
expires.setSeconds(seconds)

const cookie = createCookie('__HOLA__', {
  secrets: [env.COOKIE_SECRET],
  sameSite: 'lax',
  expires,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
})

export const storage = (process.env.NODE_ENV === 'development')
  ? createFileSessionStorage({
    cookie,
    dir: './sessions/store'
  })
  : createRedisStorage({ cookie })

export const { getSession, commitSession, destroySession } = storage
