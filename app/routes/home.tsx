import { useActionData } from '@remix-run/react'
import makeToken from 'utils/access_token.server'
import ContentBlock from '~/components/molecules/ContentBlock'
import { Header, Footer, RoomLogin, Room } from '~/components/organisms/RoomLogin'
import * as yup from 'yup'

export async function action ({ request }: { request: Request }) {
  const form = await request.formData()
  const entries = Object.fromEntries(form)

  const schema = yup.object({
    user: yup.string().min(4)
      .required('user is a required field'),
    room: yup.string().min(4)
      .required('room is a required field')
  })

  let data
  // try {
    data = await schema.validate(entries, { abortEarly: false })
  // } catch (errors) {
  //   if (errors instanceof yup.ValidationError) {
  //     const { inner: innerErrors } = errors
  //     const flashErrors = {} as any

  //     for (const error of innerErrors) {
  //       if (error.path && flashErrors[error.path] === undefined) {
  //         flashErrors[error.path] = error.message
  //       }
  //     }

  //     console.log(flashErrors)
  //     return { flashErrors }
  //   } else {
  //     return { flashErrors: true }
  //   }
  // }

  const resp = JSON.stringify(
    makeToken(data.user, data.room)
  )

  console.log('resp', resp)

  return new Response(JSON.stringify(resp), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export default function Index () {
  const token = useActionData()

  // todo: buscar info si remix usa flash errors
  // a la rails
  const RoomOrLogin = (
    token && !token.flashErrors
      ? (
        <Room
          roomname={'1q2w3e'}
          token={token}
          handleLogout={() => {}}
        />
        )
      : <RoomLogin />
  )

  return (
    <ContentBlock>
      <Header />
      {RoomOrLogin}
      <Footer />
    </ContentBlock>
  )
}
