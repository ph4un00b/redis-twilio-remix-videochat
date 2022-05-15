import { database } from '~/services/db.server'

const MIDU_ROOM_MESSAGES = 'room:midu:messages'
const db = database()

export interface Message {
  username: string
  message: string
  created_at: number
}

export async function create (newMsg: Message, messages: Message[] | null) {
  console.log('new', newMsg)
  //  should run  olny the first time
  if (messages === null) {
    messages = []
  }

  // add new message
  messages.push(newMsg)

  const resp = await db
    .set(MIDU_ROOM_MESSAGES, JSON.stringify(messages))

  if (resp === 'OK') return messages
  return null
}

export async function read () {
  const messages: Message[] | null =
    await db.get(MIDU_ROOM_MESSAGES)

  return messages
}
