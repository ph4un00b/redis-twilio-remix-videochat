import { auth } from './auth.server'
import * as yup from 'yup'
import { GitHubStrategy } from 'remix-auth-github'

const schema = yup.object().shape({
  GITHUB_CLIENT_ID: yup.string().required(),
  GITHUB_CLIENT_SECRET: yup.string().required()
})

const env = schema.validateSync({
  GITHUB_CLIENT_ID: process
    .env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process
    .env.GITHUB_CLIENT_SECRET
})

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  async ({ accessToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    // return User.findOrCreate({ email: profile.emails[0].value });
    console.log({ profile })
    return { profile, accessToken, extraParams }
  }
)

auth.use(gitHubStrategy)
