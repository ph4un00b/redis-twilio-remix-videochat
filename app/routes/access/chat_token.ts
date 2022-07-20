import { ActionFunction } from '@remix-run/server-runtime'
import { makeChatToken } from '~/services/access_token.server'

// export async function loader() {
//   return new Response(JSON.stringify(jwt), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

export const action: ActionFunction = async ({
  request
}) => {
  const { identity, room } = await request.json()
  switch (request.method) {
    case 'POST': {
      return new Response(JSON.stringify(makeChatToken(identity, room)), {
        status: 201, //created
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    case 'PUT': { }
    case 'PATCH': { }
    case 'DELETE': { }
  }
}

