// app/services/auth.server.ts
import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { GitHubExtraParams, GitHubProfile } from 'remix-auth-github'
import { storage } from './sessions.server'

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator(storage)

// export const auth = new Authenticator<{
//   profile: GitHubProfile
//   accessToken: string
//   extraParams: GitHubExtraParams
// }>(storage)

authenticator.use(
  new FormStrategy(async ({ form }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server
    const username = form.get('username') // or email... etc
    const password = form.get('password')

    // And if you have a password you should hash it
    const hashedPassword = hash(password)

    // And finally, you can find, or create, the user
    const user = findOrCreateUser(username, hashedPassword)

    // And return the user as the Authenticator expects it
    return user
  }),
  "user-pass"
)

// todo: hash or rely on redis encryption?
function hash (password: FormDataEntryValue | null) {
  // throw new Error("Function not implemented.");
  return password
}
function findOrCreateUser (username: any, hashedPassword: FormDataEntryValue | null) {
  // throw new Error("Function not implemented.");
  return 'phau'
}