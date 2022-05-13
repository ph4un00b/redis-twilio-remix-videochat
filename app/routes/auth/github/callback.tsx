import { LoaderFunction } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.authenticate('github', request, {
    successRedirect: '/private',
    failureRedirect: '/login'
  })
}
