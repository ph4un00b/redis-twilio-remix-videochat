import { database } from '~/services/db.server'

const db = database()

export interface Members {
  name: string
  id: number
}

export async function readMembers () {
  const members: string[] | null =
    await db.get('room:midu:users')

  return members
}

export async function updateMembers (newMembers: string[]) {
  const resp =
    await db.set('room:midu:users', JSON.stringify(newMembers))

  if (resp === 'OK') {
    const p = newMembers.map((peep, i) => ({ name: peep, id: i }))
    console.log({ p })
    return p
  }

  return { update_error: true } // todo: handle REDIS ERR
}

export async function createMembers (newUser: string, members: string[] | null) {
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
    .set('room:midu:users', JSON.stringify(members))

  if (resp === 'OK') {
    return members.map((peep, i) => ({ name: peep, id: i }))
  }

  return { create_error: true }
}
