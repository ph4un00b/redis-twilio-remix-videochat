import ContentBlock from '~/components/molecules/ContentBlock'
import { Header, Footer, RoomLogin } from '~/components/organisms/RoomLogin'
import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { keyValuesFrom, validateRoom } from '~/validations/room-login.server'
import { auth } from '~/services/auth.server'
import { GitHubProfile } from 'remix-auth-github'

interface LoaderData { user: string, room: string }

export const loader: LoaderFunction = async ({ request }) => {
  const github = await auth.isAuthenticated(request, {
    failureRedirect: '/login'
  })

  return json<LoaderData>({ user: github.profile.displayName, room: 'midurey' })
}

export async function action ({ request }: { request: Request }) {
  const entries = await keyValuesFrom(request)
  const [, errors] = await validateRoom(entries)
  if (errors) return errors
  return redirect('/chat/midu')
}

export default function Index () {
  const data = useLoaderData<LoaderData>()
  // todo: look for remix flash errors ala ruby on rails
  const errors = useActionData()

  return (
    <ContentBlock>
      <Header errors={errors?.messages} />
      <RoomLogin defaults={data ?? errors?.values} />
      <Footer />
    </ContentBlock>
  )
}
