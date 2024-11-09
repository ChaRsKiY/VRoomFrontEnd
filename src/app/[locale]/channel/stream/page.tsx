'use client'  

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react'
import { useTimer } from 'react-timer-hook'
import { format } from 'date-fns'
import Cookies from 'universal-cookie'
import { gapi } from 'gapi-script'

const CAPTURE_OPTIONS = {
  audio: true,
  video: true,
}
const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube'

const clientId = '22'
const apiKey = 'AIzaSyDvXp8Wi0-Y6BPC55SDA953CFIid2g6TtY'

export default function Broadcast() {
  const [isVideoOn, setIsVideoOn] = useState(true)
const [isMuted, setIsMuted] = useState(false)
const [seconds, setSeconds] = useState(0)
const [isActive, setIsActive] = useState(false)
const [userFacing, setUserFacing] = useState(true)
const [streamTitle, setStreamTitle] = useState('')
const [streamDescription, setStreamDescription] = useState('')
const [privacy, setPrivacy] = useState('public')
const [youtubeIngestionUrl, setYoutubeIngestionUrl] = useState('')
const [youtubeStreamName, setYoutubeStreamName] = useState('')
const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
const [streamId, setStreamId] = useState('')
const videoRef = useRef<HTMLVideoElement>(null)
const ws = useRef<WebSocket | null>(null)
const productionWsUrl = 'wss://your-production-url.com'
const developmentWsUrl = 'ws://localhost:3000'
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [broadcastId, setBroadcastId] = useState('')

// Ініціалізація Google API та автентифікація
useEffect(() => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: apiKey,
      clientId: clientId,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      scope: YOUTUBE_SCOPE,
    }).then(() => {
      const authInstance = gapi.auth2.getAuthInstance()
      setIsAuthenticated(authInstance.isSignedIn.get())
      authInstance.isSignedIn.listen(setIsAuthenticated)
    })
  })
}, [])

// Функції для автентифікації
const authenticate = () => {
  gapi.auth2.getAuthInstance().signIn()
}

const signOut = () => {
  gapi.auth2.getAuthInstance().signOut()
}

// Функція створення трансляції
const createBroadcast = async () => {
  try {
    const broadcastResponse = await gapi.client.youtube.liveBroadcasts.insert({
      part: 'snippet,status',
      resource: {
        snippet: {
          title: streamTitle || 'My Live Stream',
          description: streamDescription || 'Live streaming via API',
          scheduledStartTime: new Date().toISOString(),
        },
        status: {
          privacyStatus: privacy,
        },
      },
    })

    const newBroadcastId = broadcastResponse.result.id
    setBroadcastId(newBroadcastId)

    const streamResponse = await gapi.client.youtube.liveStreams.insert({
      part: 'snippet,cdn',
      resource: {
        snippet: {
          title: `${streamTitle} Stream Key`,
        },
        cdn: {
          format: '1080p',
          ingestionType: 'rtmp',
        },
      },
    })

    const streamId = streamResponse.result.id
    setStreamId(streamId)
    setYoutubeIngestionUrl(streamResponse.result.cdn.ingestionInfo.ingestionAddress)
    setYoutubeStreamName(streamResponse.result.cdn.ingestionInfo.streamName)

    await gapi.client.youtube.liveBroadcasts.bind({
      part: 'id,contentDetails',
      id: newBroadcastId,
      streamId: streamId,
    })

    console.log('Broadcast created and bound to stream:', newBroadcastId)
  } catch (error) {
    console.error('Error creating broadcast:', error)
  }
}

// Підключення до WebSocket та RTMP сервера
useEffect(() => {
  const youtubeUrl = `${youtubeIngestionUrl}/${youtubeStreamName}`
  const streamUrlParams = `?youtubeUrl=${youtubeUrl}`
  
  ws.current = new WebSocket(
    (process.env.NODE_ENV === 'production' ? productionWsUrl : developmentWsUrl) + streamUrlParams
  )

  ws.current.onopen = () => console.log('WebSocket Open')
  
  return () => ws.current?.close()
}, [youtubeStreamName, youtubeIngestionUrl])

// Старт потоку
const startStream = async () => {
  if (!youtubeStreamName) {
    alert('Please add at least one streaming destination')
    return
  }
  setIsActive(true)
  try {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await authenticate()
    }
    await createBroadcast()
  } catch (error) {
    console.error('Error starting stream:', error)
    setIsActive(false)
  }
}

// Зупинка потоку
const stopStream = () => {
  setIsActive(false)
  ws.current?.close()
}

// Увімкнення медіа потоку
const enableStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: isVideoOn,
      audio: !isMuted,
    })
    setMediaStream(stream)
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  } catch (err) {
    console.log(err)
  }
}

  const toggleMute = () => {
    setIsMuted(!isMuted)
    updateAudioStream(!isMuted)
  }

  const toggleCamera = () => {
    setIsVideoOn(!isVideoOn)
    updateVideoStream(!isVideoOn)
  }

  const updateAudioStream = (isMuted: boolean) => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted
      })
    }
  }

  const updateVideoStream = (isVideoOn: boolean) => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOn
      })
    }
  }

  const toggleScreenShare = async () => {
    try {
      let stream
      if (!userFacing) {
        stream = await navigator.mediaDevices.getDisplayMedia(CAPTURE_OPTIONS)
      } else {
        stream = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
      }
      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setUserFacing(!userFacing)
    } catch (err) {
      console.log(err)
    }
  }

  const handleCanPlay = () => {
    videoRef.current?.play()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return format(new Date(0, 0, 0, 0, minutes, remainingSeconds), 'mm:ss')
  }


  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Start a New Stream</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Stream Title</Label>
            <Input 
              id="title" 
              value={streamTitle} 
              onChange={(e) => setStreamTitle(e.target.value)} 
              placeholder="Enter your stream title" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Stream Description</Label>
            <Textarea 
              id="description" 
              value={streamDescription} 
              onChange={(e) => setStreamDescription(e.target.value)} 
              placeholder="Describe your stream" 
              rows={4} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Privacy</Label>
            <RadioGroup value={privacy} onValueChange={setPrivacy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" selectedValue={privacy} onValueChange={setPrivacy}>
                  <Label htmlFor="public">Public</Label>
                </RadioGroupItem>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlisted" id="unlisted" selectedValue={privacy} onValueChange={setPrivacy}>
                  <Label htmlFor="unlisted">Unlisted</Label>
                </RadioGroupItem>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" selectedValue={privacy} onValueChange={setPrivacy}>
                  <Label htmlFor="private">Private</Label>
                </RadioGroupItem>
              </div>
            </RadioGroup>
          </div>

          <div className="aspect-video bg-muted">
            <video
              ref={videoRef}
              onCanPlay={handleCanPlay}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex justify-center space-x-2">
            <Button onClick={toggleCamera} variant="outline" size="icon">
              {isVideoOn ? <Video size="24" /> : <VideoOff size="24" />}
            </Button>
            <Button onClick={toggleMute} variant="outline" size="icon">
              {isMuted ? <MicOff size="24" /> : <Mic size="24" />}
            </Button>
            <Button onClick={toggleScreenShare} variant="outline" size="icon">
              <Monitor size="24" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={startStream} disabled={isActive}>Start Stream</Button>
          <Button onClick={stopStream} disabled={!isActive}>Stop Stream</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
