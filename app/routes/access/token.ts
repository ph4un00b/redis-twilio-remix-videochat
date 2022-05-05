import { ActionFunction } from '@remix-run/server-runtime'
import makeToken from 'utils/access_token.server'

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
      /* handle "POST" */
      return new Response(JSON.stringify(makeToken(identity, room)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    case 'PUT': {
      /* handle "PUT" */
    }
    case 'PATCH': {
      /* handle "PATCH" */
    }
    case 'DELETE': {
      /* handle "DELETE" */
    }
  }
}
