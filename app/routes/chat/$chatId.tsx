import { ActionFunction, LoaderFunction } from '@remix-run/node'
import { useParams } from '@remix-run/react'
export const loader: LoaderFunction = async ({
  params
}) => {
  console.log(params.chatId)
  return {}
}

export const action: ActionFunction = async ({
  params
}) => {
  console.log(params.chatId)
}

export default function PostRoute () {
  const params = useParams()
  console.log(params.chatId)
  return <p>chat id</p>
}
