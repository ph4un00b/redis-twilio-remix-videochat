import { createCookie, createFileSessionStorage } from '@remix-run/node'
import { createRedisSession, EXPIRATION_IN_SECONDS } from 'sessions/redis.server'

const expires = new Date()
const seconds =
  expires.getSeconds() + EXPIRATION_IN_SECONDS
expires.setSeconds(seconds)

const cookie = createCookie('__HOLA__', {
  secrets: ['tumamac1tab1enbon1ta'],
  sameSite: true,
  expires
})

const { getSession, commitSession, destroySession } =
(process.env.NODE_ENV === 'development')
  ? createFileSessionStorage({
    cookie,
    dir: './sessions/store'
  })
  : createRedisSession({ cookie })

export { getSession, commitSession, destroySession }
