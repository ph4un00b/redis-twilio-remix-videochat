import { Form } from '@remix-run/react'
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useState } from 'react'

function VideoChat () {
  const [username, setUsername] = useState('')
  const [roomname, setRoomName] = useState('')
  const [token, setToken] = useState(null)

  function handleUsernameChange (event: ChangeEvent<HTMLInputElement>) {
    console.log('handle-user-name')
    setUsername(event.target.value)
  }

  function handleRoomNameChange (event: ChangeEvent<HTMLInputElement>) {
    setRoomName(event.target.value)
  }

  async function handleSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await fetch('/video/token', {
      method: 'POST',
      body: JSON.stringify({
        identity: username,
        room: roomname
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async res => await res.json()).catch(console.error)

    setToken(data.token)
  }

  function handleLogout (event: any) {
    setToken(null)
  }

  if (token) {
    return (
      <>

        <div className='hero min-h-screen bg-base-200'>
          <div className='hero-content flex-col lg:flex-row-reverse'>
            <Room roomname={roomname} token={token} handleLogout={handleLogout} />
          </div>
        </div>

        <div>
          <div className='mockup-code'>
            <pre data-prefix='$'><code>load video</code></pre>
            <pre data-prefix='>' className='text-warning'><code>installing...</code></pre>
            <pre data-prefix='>' className='text-success'><code>Done!</code></pre>
            <section className='w-[20rem] h-[20rem] mx-auto' id='user-video' />
          </div>
        </div>
      </>
    )
  }

  return (
    <>

      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <FormLobby
            username={username}
            roomname={roomname}
            handleSubmit={handleSubmit}
            handleRoomNameChange={handleRoomNameChange}
            handleUsernameChange={handleUsernameChange}
          />
        </div>
      </div>

      <div>
        <div className='mockup-code'>
          <pre data-prefix='$'><code>load video</code></pre>
          <pre data-prefix='>' className='text-warning'><code>installing...</code></pre>
          <pre data-prefix='>' className='text-success'><code>Done!</code></pre>
          <section className='w-[20rem] h-[20rem] mx-auto' id='user-video' />
        </div>
      </div>
    </>
  )
}

interface Lobby {handleSubmit: FormEventHandler, handleRoomNameChange: ChangeEventHandler, handleUsernameChange: ChangeEventHandler, username: string, roomname: string}

function FormLobby ({ handleSubmit, handleRoomNameChange, handleUsernameChange, username, roomname }: Lobby) {
  return (
    <Form onSubmit={handleSubmit} tabIndex={0} id='form' method='post' className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
      <div className='card-body'>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>user</span>
          </label>
          <input onChange={handleUsernameChange} value={username} type='text' name='user' placeholder='Type here' className='input input-bordered input-success w-full max-w-xs' />
        </div>

        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>room</span>
          </label>
          <input onChange={handleRoomNameChange} value={roomname} type='text' name='room' placeholder='Type here' className='input input-bordered input-success w-full max-w-xs' />
        </div>

        <div className='form-control mt-6'>
          <button type='submit' className='btn btn-primary'>JOIN</button>
        </div>
      </div>
    </Form>
  )
}
interface ParticipantOpts { participant: any }

function SinglePaticipant ({ participant }: ParticipantOpts) {
  return <p key={participant.sid}>{participant.identity}</p>
}

interface RoomOpts {roomname: string, token: string, handleLogout: FormEventHandler}

function Room ({ roomname, token, handleLogout }: RoomOpts) {
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])

  const remoteParticipants = <>{participants.map(SinglePaticipant)}</>

  return (
    <div className='room'>
      <h2>Room: {roomname}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className='local-participant'>
        {room ? <SinglePaticipant participant={room.localParticipant} /> : ''}
      </div>
      <h3>Remote Participants</h3>
      <div className='remote-participants'>{remoteParticipants}</div>
    </div>
  )
}

export default function Index () {
  return (
    <VideoChat />
  )
}
