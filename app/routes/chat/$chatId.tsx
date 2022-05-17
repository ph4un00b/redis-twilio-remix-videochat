import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useParams } from '@remix-run/react'
import { commitSession, getSession } from '~/services/sessions.server'
import { Key } from 'react'
import * as Members from '~/modules/chat/models/members.server'
import * as Messages from '~/modules/chat/models/messages.server'
import { Message } from '~/modules/chat/models/messages.server'
import { auth } from '~/services/auth.server'

export const loader: LoaderFunction = async ({
  params, request
}) => {
  const github = await auth.isAuthenticated(request, {
    failureRedirect: '/login'
  })
  // const session = await getSession(request.headers.get('Cookie'))
  // const myStoredData = session.get('myStoredData')
  // console.log('my', myStoredData)
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

  const chatUsers = await Members.read()
  const people = chatUsers?.map((peep, i) => ({ name: peep, id: i })) ?? []
  const messages = await Messages.read() ?? []

  return { people, messages, username: github.profile.displayName }
}

export const action: ActionFunction = async ({
  params, request
}) => {
  const github = await auth.isAuthenticated(request, {
    failureRedirect: '/login'
  })

  const formData = await request.formData()
  const { trigger, ...values } = Object.fromEntries(formData)

  console.log({ trigger, values })

  if (trigger === 'join' && !values.username) return { join_error: true }
  if (trigger === 'join') {
    const chatUsers = await Members.read()
    const people =
     await Members.create(values.username as string, chatUsers)
    return { people }
  }

  if (trigger === 'kick' && !values.peep) return { kick_error: true }
  if (trigger === 'kick') {
    let chatUsers = await Members.read()
    chatUsers = chatUsers?.filter(p => p !== values.peep) ?? []
    const people = await Members.update(chatUsers)
    return { people }
  }

  // todo: leaving room logic with session
  if (trigger === 'leave') {
    let chatUsers = await Members.read()
    chatUsers = chatUsers?.filter(p => p !== 'phau') ?? []
    const people = await Members.update(chatUsers)
    return { people }
  }

  if (trigger === 'send') {
    const msg = {
      username: github.profile.displayName,
      message: values.message as string,
      created_at: Date.now()
    }

    const messages =
      await Messages.create(msg, await Messages.read())

    return { messages }
  }
}

export default function PostRoute () {
  const params = useParams()
  const server = useLoaderData()

  const serverPeople =
   JSON.stringify(server.people.map((p: { name: string }) => p.name), undefined, 2)

  const serverMessages = server.messages.map((p: Message) => (
    <pre key={p.created_at}>{JSON.stringify(p, undefined)}</pre>
  ))

  return (
    <div className='container'>
      <h2>username: {server.username}</h2>
      <hr />
      <div>chat members: <br />

        {serverPeople}
      </div>

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

      {/* <div className='join-chat'>
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
      </div><br /> */}

      <div className='chat-info' /><br />
      <div className='chat'>

        <div>messages: <br />

          {serverMessages}
        </div>

        <Form method='post'>
          <textarea
            name='message'
            id='message'
            cols={90}
            rows={5}
            placeholder='Enter your message...'
          /><br /><br />

          <input
            type='submit'
            className='btn btn-accent'
            name='trigger'
            value='send'
          />

        </Form>

        <Form method='post'>
          <input
            type='submit'
            className='btn btn-primary'
            aria-label='leave'
            name='trigger'
            value='leave'
          />
        </Form>
      </div>
    </div>
  )
}
