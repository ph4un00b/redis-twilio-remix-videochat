import ContentBlock from '~/components/molecules/ContentBlock'
import { Header, Footer, RoomLogin } from '~/components/organisms/RoomLogin'
import { redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { keyValuesFrom, validateRoom } from '~/validations/room-login.server'

export async function action ({ request }: { request: Request }) {
  const entries = await keyValuesFrom(request)
  const [, errors] = await validateRoom(entries)
  if (errors) return errors
  return redirect('/chat/midu')
}

export default function Index () {
  // todo: look for remix flash errors ala ruby on rails
  const errors = useActionData()

  return (
    <ContentBlock>
      <Header errors={errors?.messages} />
      <RoomLogin defaults={errors?.values} />
      <Footer />
    </ContentBlock>
  )
}
