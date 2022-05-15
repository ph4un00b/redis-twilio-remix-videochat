import { database } from '~/services/db.server'

const MIDU_ROOM = 'room:midu:users'

const db = database()

export interface Members {
  name: string
  id: number
}

export async function read () {
  const members: string[] | null =
    await db.get(MIDU_ROOM)

  return members
}

export async function update (newMembers: string[]) {
  const resp =
    await db.set(MIDU_ROOM, JSON.stringify(newMembers))

  if (resp === 'OK') {
    const p = newMembers.map((peep, i) => ({ name: peep, id: i }))
    console.log({ p })
    return p
  }

  return { update_error: true } // todo: handle REDIS ERR
}

export async function create (newUser: string, members: string[] | null) {
  console.log('new', newUser)
  //  should run  olny the first time
  if (members === null) {
    members = []
  }

  // prevent the same user
  if (members.findIndex((v) => v === newUser) !== -1) {
    return members.map((peep, i) => ({ name: peep, id: i }))
  }

  // add new user
  members.push(newUser)

  const resp = await db
    .set(MIDU_ROOM, JSON.stringify(members))

  if (resp === 'OK') {
    return members.map((peep, i) => ({ name: peep, id: i }))
  }

  return { create_error: true }
}
