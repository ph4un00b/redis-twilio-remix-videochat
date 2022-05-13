import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { auth } from '~/services/auth.server'
import { getSession } from '~/services/sessions.server'

interface LoaderData {
  error: { message: string } | null
}

export const loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, {
    successRedirect: '/video'
  })

  const session = await getSession(
    request.headers.get('Cookie')
  )

  const error = session.get(auth.sessionErrorKey) as LoaderData['error']
  return json<LoaderData>({ error })
}

export const action: ActionFunction = async ({ request, context }) => {
  const resp = await auth.authenticate('github', request, {
    successRedirect: '/video',
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
    <Form method='post' className='grid place-items-center'>
      {(error != null) && <div>{error.message}</div>}
      <button>Login with GitHub</button>
    </Form>
  )
}
