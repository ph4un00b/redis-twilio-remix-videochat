import AccessToken from 'twilio/lib/jwt/AccessToken'
import * as yup from 'yup'
// import { InferType } from 'yup'

export default function makeToken (user: string, room: string) {
  const VideoGrant = AccessToken.VideoGrant

  const schema = yup.object().shape({
    TWILIO_ACCOUNT_SID: yup.string().required(),
    TWILIO_API_KEY: yup.string().required(),
    TWILIO_API_SECRET: yup.string().required()
  })

  // Used when generating any kind of tokens
  // To set up environmental variables, see http://twil.io/secure
  const env = schema.validateSync({
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY: process.env.TWILIO_API_KEY,
    TWILIO_API_SECRET: process.env.TWILIO_API_SECRET
  })

  // type Twilio = InferType<typeof schema>;
  const identity = user

  // Create Video Grant
  const videoGrant = new VideoGrant({
    room
  })

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    env.TWILIO_ACCOUNT_SID,
    env.TWILIO_API_KEY,
    env.TWILIO_API_SECRET,
    { identity: identity }
  )
  token.addGrant(videoGrant)
  return token.toJwt()
}
