import ContentBlock from '~/components/molecules/ContentBlock'
import { Header, Footer, RoomLogin, Room } from '~/components/organisms/RoomLogin'
import * as yup from 'yup'
import { redirect } from '@remix-run/node'

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
  try {
    data = await schema.validate(entries, { abortEarly: false })
  } catch (errors) {
    if (errors instanceof yup.ValidationError) {
      const { inner: innerErrors } = errors
      const flashErrors = {} as any

      for (const error of innerErrors) {
        if (error.path && flashErrors[error.path] === undefined) {
          flashErrors[error.path] = error.message
        }
      }

      console.log(flashErrors)
      return { flashErrors }
    }

    return { flashErrors: true }
  }

  return redirect('/chat')
}

export default function Index () {
  // todo: buscar info si remix usa flash errors
  // a la rails

  return (
    <ContentBlock>
      <Header />
      <RoomLogin />
      <Footer />
    </ContentBlock>
  )
}
