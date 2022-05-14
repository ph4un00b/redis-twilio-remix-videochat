import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useParams } from '@remix-run/react'
import { Redis } from '@upstash/redis'
import { commitSession, getSession } from '~/services/sessions.server'
import * as yup from 'yup'
import { Key } from 'react'

export const loader: LoaderFunction = async ({
  params, request
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

  const session = await getSession(request.headers.get('Cookie'))
  const myStoredData = session.get('myStoredData')
  console.log('my', myStoredData)
  // If no session found (was never created or was expired) create a new session.
  // if (!myStoredData) {
  //   session.set('myStoredData', 'Some data jamon!')

  //   const headers = {
  //     'Set-Cookie': await commitSession(session)
  //   }

  //   return json(
  //     { message: 'Created new session' },
  //     { headers }
  //   )
  // }

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

    const resp = await redis.set('room:midu:users', JSON.stringify(chatUsers))
    const people = chatUsers.map((peep, i) => ({ name: peep, id: i }))

    if (resp === 'OK') return { people }
    return { error: true } // todo: handle REDIS ERR
  }

  const people = chatUsers.map((peep, i) => ({ name: peep, id: i }))
  return { people }
}

export const action: ActionFunction = async ({
  params, request
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
  const formData = await request.formData()
  const { trigger, ...values } = Object.fromEntries(formData)

  console.log({ trigger, values })

  if (trigger === 'join' && !values.username) return { join_error: true }
  if (trigger === 'join') {
    let chatUsers: string[] | null =
      await redis.get('room:midu:users')

    // init chat
    if (chatUsers === null) {
      chatUsers = []
    }

    // add user once
    if (chatUsers.findIndex((v) => v === values.username) < 0) {
      chatUsers.push(values.username as string)
    }

    const resp = await redis.set('room:midu:users', JSON.stringify(chatUsers))
    const people = chatUsers.map((peep, i) => ({ name: peep, id: i }))

    if (resp === 'OK') return { people }
    return { redis_error: true } // todo: handle REDIS ERR
  }

  if (trigger === 'kick' && !values.peep) return { kick_error: true }
  if (trigger === 'kick') {
    let chatUsers: string[] | null =
      await redis.get('room:midu:users')

    chatUsers = chatUsers?.filter(p => p !== values.peep) ?? []
    const resp = await redis.set('room:midu:users', JSON.stringify(chatUsers))
    const people = chatUsers.map((peep, i) => ({ name: peep, id: i }))

    if (resp === 'OK') return { people }
    return { redis_error: true } // todo: handle REDIS ERR
  }
}

export default function PostRoute () {
  const params = useParams()
  console.log(params.chatId)

  const server = useLoaderData()
  console.log('action', useActionData())
  // const action = useActionData()

  return (
    <div className='container'>
      <div>chat members: <br />{JSON.stringify(server.people.map((p: { name: string }) => p.name), undefined, 2)}</div>
      <ul>
        {server?.people?.length > 0 && server.people.map((peep: { id: Key, name: string }) => (
          <li key={peep.id}>

            {peep.name}

            <Form method='post' replace>
              <input type='hidden' name='peep' value={peep.name} />
              <button
                aria-label='kick'
                name='trigger'
                type='submit'
                value='kick'
                className='btn btn-square'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

            </Form>
          </li>
        ))}
      </ul>
      <div className='join-chat'>
        <Form method='post' replace>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' name='username' />
          <input
            className='btn btn-secondary'
            aria-label='join'
            name='trigger'
            type='submit'
            value='join'
          />
        </Form>
      </div><br />

      <div className='chat-info' /><br />
      <div className='chat'>
        <div className='messages' />
        <textarea name='message' id='message' cols={90} rows={5} placeholder='Enter your message...' defaultValue='' /><br /><br />
        <input type='button' className='btn btn-accent' id='send-message' data-username defaultValue='Send Message' />
        <input type='button' className='btn btn-primary' id='leave-chat' data-username defaultValue='Leave Chat' />
      </div>
    </div>
  )
}
