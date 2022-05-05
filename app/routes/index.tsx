import { Form } from '@remix-run/react'
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect as useSync, useRef, useState } from 'react'
import * as Video from 'twilio-video'

function VideoChat () {
  const [username, setUsername] = useState('')
  const [roomname, setRoomName] = useState('')
  const [token, setToken] = useState<string | undefined>(undefined)

  function handleUsernameChange (event: ChangeEvent<HTMLInputElement>) {
    console.log('handle-user-name')
    setUsername(event.target.value)
  }

  function handleRoomNameChange (event: ChangeEvent<HTMLInputElement>) {
    setRoomName(event.target.value)
  }

  async function handleSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await fetch('/access/token', {
      method: 'POST',
      body: JSON.stringify({
        identity: username,
        room: roomname
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async res => await res.json()).catch(console.error)

    setToken(data)
  }

  function handleLogout (event: any) {
    setToken(undefined)
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
// interface ParticipantOpts { participant: Video.Participant }

function SinglePaticipant (participant: any) {
  console.log('single-participant', participant)
  return <p key={participant.sid}>{participant.identity}</p>
}

interface RoomOpts {roomname: string, token: string, handleLogout: FormEventHandler}

function Room ({ roomname, token, handleLogout }: RoomOpts) {
  const [room, setRoom] = useState<Video.Room | null>(null)
  const [participants, setParticipants] = useState<Video.Participant[]>([])

  const remoteParticipants = <>{participants.map(participant => <ParticipantStreams key={participant.sid} participant={participant} />)}</>

  useSync(function () {
    function participantConnected (participant: Video.Participant) {
      setParticipants(function (prevParticipants) {
        return [...prevParticipants, participant]
      })
    }
    function participantDisconnected (participant: Video.Participant) {
      setParticipants(function (prevParticipants) {
        return prevParticipants.filter(function (p) {
          return p !== participant
        })
      })
    }

    Video.connect(token, {
      name: roomname
    }).then(function (room) {
      setRoom(room)
      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.participants.forEach(participantConnected)
    })

    return function () {
      setRoom(function (currentRoom) {
        if ((currentRoom != null) && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            trackPublication.track.removeAllListeners()
          })

          currentRoom.disconnect()
          return null
        } else {
          return currentRoom
        }
      })
    }
  }, [roomname, token])

  return (
    <div className='room'>
      <h2>Room: {roomname}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className='local-participant'>
        local?: {(room != null) ? <ParticipantStreams key={room.localParticipant.sid} participant={room.localParticipant} /> : ''}
      </div>
      <h3>Remote Participants</h3>
      <div className='remote-participants'>{remoteParticipants}</div>
    </div>
  )
}

function ParticipantStreams ({ participant }: {participant: Video.Participant}) {
  const [videoTracks, setVideoTracks] = useState<any[]>([])
  const [audioTracks, setAudioTracks] = useState<any[]>([])

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function trackpubsToTracks (trackMap: Map<string, Video.AudioTrackPublication> | Map<string, Video.VideoTrackPublication>) {
    return Array.from<Video.AudioTrackPublication | Video.VideoTrackPublication>(trackMap.values())
      .map(publication => publication.track)
      .filter(track => track !== null)
  }

  useSync(() => {
    function trackSubscribed (track: Video.LocalTrack) {
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => [...videoTracks, track])
      } else {
        setAudioTracks(audioTracks => [...audioTracks, track])
      }
    }

    function trackUnsubscribed (track: Video.LocalTrack) {
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => videoTracks.filter(v => v !== track))
      } else {
        setAudioTracks(audioTracks => audioTracks.filter(a => a !== track))
      }
    }

    setVideoTracks(trackpubsToTracks(participant.videoTracks))
    setAudioTracks(trackpubsToTracks(participant.audioTracks))

    participant.on('trackSubscribed', trackSubscribed)
    participant.on('trackUnsubscribed', trackUnsubscribed)

    return () => {
      setVideoTracks([])
      setAudioTracks([])
      participant.removeAllListeners()
    }
  }, [participant.identity])

  useSync(() => {
    const [videoTrack]: Video.LocalVideoTrack[] = videoTracks
    if (videoTrack) {
      videoTrack.attach(videoRef.current!)
      return () => { videoTrack.detach() }
    }
    // to event handler?
  }, [videoTracks])

  useSync(() => {
    const [audiotrack]: Video.LocalAudioTrack[] = audioTracks
    if (audiotrack) {
      audiotrack.attach(audioRef.current!)
      return () => { audiotrack.detach() }
    }
    // to event handler?
  }, [audioTracks])

  return (
    <div className='participant'>
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay muted />
    </div>
  )
}

export default function Index () {
  return (
    <VideoChat />
  )
}
