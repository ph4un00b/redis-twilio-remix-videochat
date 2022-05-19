import * as yup from 'yup'
import { Authenticator } from 'remix-auth'
import { GitHubExtraParams, GitHubProfile, GitHubStrategy } from 'remix-auth-github'
import { storage } from './sessions.server'

const schema = yup.object().shape({
  GITHUB_CLIENT_ID: yup.string().required(),
  GITHUB_CLIENT_SECRET: yup.string().required(),
  // BASE_URL: yup.string().url().required()
  BASE_URL: yup.string().required()
})

const env = schema.validateSync({
  GITHUB_CLIENT_ID: process
    .env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process
    .env.GITHUB_CLIENT_SECRET,
  BASE_URL: process
    .env.BASE_URL
})

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: `${env.BASE_URL}/auth/github/callback`
  },
  async ({ accessToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    // return User.findOrCreate({ email: profile.emails[0].value });
    console.log({ profile })
    return { profile, accessToken, extraParams }
  }
)

// export const authenticator = new Authenticator(storage)
export const auth = new Authenticator<{
  profile: GitHubProfile
  accessToken: string
  extraParams: GitHubExtraParams
}>(storage)

auth.use(gitHubStrategy)
