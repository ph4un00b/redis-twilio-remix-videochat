import { ActionFunction, LoaderFunction } from '@remix-run/node'
import { useParams } from '@remix-run/react'
import { Redis } from '@upstash/redis'
import * as yup from 'yup'

export const loader: LoaderFunction = async ({
  params
}) => {
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

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
  })

  console.log(params.chatId)
  let chatUsers: string[] | null =
    await redis.get('room:midu:users')

  // init chat
  if (chatUsers === null) {
    chatUsers = []
  }

  // add user once
  if (chatUsers.findIndex((v) => v === 'phau') < 0) {
    chatUsers.push('phau')
  }

  await redis.set('room:midu:users', JSON.stringify(chatUsers))

  console.log('chat-users', chatUsers)
  return {}
}

export const action: ActionFunction = async ({
  params
}) => {
  console.log(params.chatId)
}

export default function PostRoute () {
  const params = useParams()
  console.log(params.chatId)
  return <p>chat id</p>
}
