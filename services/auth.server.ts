// app/services/auth.server.ts
import { Authenticator } from 'remix-auth'
import { GitHubExtraParams, GitHubProfile } from 'remix-auth-github'
import { storage } from './sessions.server'

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const auth = new Authenticator(storage)

// export const auth = new Authenticator<{
//   profile: GitHubProfile
//   accessToken: string
//   extraParams: GitHubExtraParams
// }>(storage)
