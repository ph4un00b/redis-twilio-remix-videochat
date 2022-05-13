import { LoaderFunction } from '@remix-run/node'
import { auth } from 'services/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  return await auth.authenticate('github', request, {
    successRedirect: '/private',
    failureRedirect: '/login'
  })
}
