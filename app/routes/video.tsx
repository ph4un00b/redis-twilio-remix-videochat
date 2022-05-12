import ContentBlock from '~/components/molecules/ContentBlock'
import { Header, Footer, RoomLogin } from '~/components/organisms/RoomLogin'
import * as yup from 'yup'
import { redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'

export async function action ({ request }: { request: Request }) {
  const form = await request.formData()
  const entries = Object.fromEntries(form)

  const schema = yup.object({
    user: yup.string().min(4)
      .required('user is a required field'),
    room: yup.string().min(4)
      .required('room is a required field')
  })

  try {
   await schema.validate(entries, { abortEarly: false })
  } catch (errors) {
    if (errors instanceof yup.ValidationError) {
      const { inner: innerErrors, value: values } = errors
      const messages = {} as any

      for (const error of innerErrors) {
        if (error.path && messages[error.path] === undefined) {
          messages[error.path] = error.message
        }
      }

      console.log(messages)
      return { messages, values }
    }

    return { flashErrors: true }
  }

  return redirect('/chat')
}

export default function Index () {
  // todo: look for remix flash errors ala ruby on rails
  const data = useActionData()

  return (
    <ContentBlock>
      <Header errors={data?.messages} />
      <RoomLogin defaults={data?.values}/>
      <Footer />
    </ContentBlock>
  )
}
