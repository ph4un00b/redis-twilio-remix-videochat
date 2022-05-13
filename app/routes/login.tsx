import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import { getSession } from '~/services/sessions.server'

interface LoaderData {
  error: { message: string } | null
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/private'
  })

  const session = await getSession(
    request.headers.get('Cookie')
  )

  const error = session.get(authenticator.sessionErrorKey) as LoaderData['error']
  return json<LoaderData>({ error })
}

export const action: ActionFunction = async ({ request, context }) => {
  const resp = await authenticator.authenticate('user-pass', request, {
    successRedirect: '/private',
    failureRedirect: '/login',
    throwOnError: true,
    context
  })

  console.log(resp)
  return resp
}

export default function Login () {
  const { error } = useLoaderData<LoaderData>()

  return (
    <Form method='post'>
      {(error != null) && <div>{error.message}</div>}

      <input
        type='text'
        name='username'
        placeholder='username'
        required
      />

      <input
        type='password'
        name='password'
        placeholder='password'
        autoComplete='current-password'
      />
      <button>Sign In</button>
    </Form>
  )
}
