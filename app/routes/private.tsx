import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { GitHubProfile } from 'remix-auth-github'
import { authenticator } from '~/services/auth.server'

// interface LoaderData { profile: GitHubProfile }

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  })

  // return json<LoaderData>({ profile })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/login' })
}

export default function Screen () {
  const data = useLoaderData()
  return (
    <>
      <Form method='post'>
        <button>Log Out</button>
      </Form>

      <hr />

      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </>
  )
}
