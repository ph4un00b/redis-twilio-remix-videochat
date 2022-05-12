import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect as useSync, useRef, useState } from 'react'
import * as Video from 'twilio-video'
import FormCard from '../atoms/FormCard'

export function Header ({errors}: {errors: any}) {
  return (
    <header className='text-center pt-16'>
      <pre>{JSON.stringify(errors, undefined, 2)}</pre>
    </header>
  )
}

type ChangeOpts = ChangeEvent<HTMLInputElement>

export function RoomLogin ({defaults}: {defaults:any}) {
  const [username, setUsername] = useState(defaults?.user)
  const [roomname, setRoomname] = useState('')
  const [token, setToken] = useState(undefined)

  function handleUsername (event: ChangeOpts) {
    setUsername(event.target.value)
  }

  function handleRoomName (event: ChangeOpts) {
    setRoomname(event.target.value)
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
    console.log('set token')
  }

  if (token) {
    return (
      <Room
        roomname={roomname}
        token={token}
        handleLogout={() => { setToken(undefined) }}
      />
    )
  }

  return (
    <FormCard onSubmitHandler={handleSubmit} gridRows='grid-rows-3'>

      <div className='col-span-6 col-start-2 w-full form-control'>
        <label className='label'>
          <span className='label-text'>user</span>
        </label>
        <input
          onChange={handleUsername}
          value={username}
          type='text'
          name='user'
          placeholder='Type here'
          className='input input-bordered input-success w-full max-w-xs'
        />
      </div>

      <div className='col-span-6 col-start-2 w-full form-control'>
        <label className='label'>
          <span className='label-text'>room</span>
        </label>
        <input
          onChange={handleRoomName}
          value={roomname}
          type='text'
          name='room'
          placeholder='Type here'
          className='input input-bordered input-success w-full max-w-xs'
        />
      </div>

      <div className='flex flex-row col-span-8 justify-center items-center pb-3'>
        <button
          type='submit'
          className='btn btn-primary'
        >
          JOIN
        </button>
      </div>

    </FormCard>
  )
}

export function Footer () {
  return (
    <footer className='text-center pt-20'>
      <p className='text-2xl'>foot</p>
    </footer>
  )
}

// interface Lobby {handleSubmit: FormEventHandler, handleRoomNameChange: ChangeEventHandler, handleUsernameChange: ChangeEventHandler, username: string, roomname: string}

// interface ParticipantOpts { participant: Video.Participant }

interface RoomOpts {roomname: string, token: string, handleLogout: FormEventHandler}

export function Room ({ roomname, token, handleLogout }: RoomOpts) {
  const [room, setRoom] = useState<Video.Room | null>(null)
  const [participants, setParticipants] = useState<Video.Participant[]>([])

  const remoteParticipants = <>{participants.map(participant => <ParticipantStreams key={participant.sid} participant={participant} />)}</>

  useSync(function () {
    function participantConnected (participant: Video.Participant) {
      console.log(participant)
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

  console.log('token', token)
  return (
    <div className='room'>
      <h2>Room: {roomname}</h2>
      <p>Online: {(room != null) ? room.participants.size + 1 : ''}</p>
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
    // usar en event handler?
  }, [videoTracks])

  useSync(() => {
    const [audiotrack]: Video.LocalAudioTrack[] = audioTracks
    if (audiotrack) {
      audiotrack.attach(audioRef.current!)
      return () => { audiotrack.detach() }
    }
    // usar en event handler?
  }, [audioTracks])

  return (
    <div className='participant'>
      <h3>nickname: {participant.identity}</h3>
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay muted />
    </div>
  )
}
