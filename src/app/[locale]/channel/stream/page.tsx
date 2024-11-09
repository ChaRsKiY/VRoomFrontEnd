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

const CAPTURE_OPTIONS = {
  audio: true,
  video: true,
}

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
  const [facebookStreamKey, setFacebookStreamKey] = useState('')
  const [twitchStreamKey, setTwitchStreamKey] = useState('')

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [streamId, setStreamId] = useState('')
  const [broadcastId, setBroadcastId] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const ws = useRef<WebSocket | null>(null)

  const productionWsUrl = 'wss://www.ohmystream.xyz/websocket'
  const developmentWsUrl = 'ws://localhost:3001'

  useEffect(() => {
    if (!mediaStream) {
      enableStream()
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [mediaStream])

  useEffect(() => {
    const youtubeUrl = `${youtubeIngestionUrl}/${youtubeStreamName}`
    const streamUrlParams = `?twitchStreamKey=${twitchStreamKey}&youtubeUrl=${youtubeUrl}&facebookStreamKey=${facebookStreamKey}`

    ws.current = new WebSocket(
      (process.env.NODE_ENV === 'production' ? productionWsUrl : developmentWsUrl) + streamUrlParams
    )

    ws.current.onopen = () => console.log('WebSocket Open')

    return () => ws.current?.close()
  }, [twitchStreamKey, youtubeStreamName, youtubeIngestionUrl, facebookStreamKey])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive) {
      interval = setInterval(() => setSeconds((seconds) => seconds + 1), 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!)
    }
    return () => clearInterval(interval!)
  }, [isActive, seconds])

  const enableStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: true,
      })
      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.log(err)
    }
  }

  const startStream = () => {
    if (!twitchStreamKey && !youtubeStreamName && !facebookStreamKey) {
      alert('Please add at least one streaming destination')
      return
    }

    setIsActive(true)
    // Старт трансляції через YouTube API
    // Включити код для роботи з API тут
  }

  const stopStream = () => {
    setIsActive(false)
    ws.current?.close()
  }

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleCamera = () => setIsVideoOn(!isVideoOn)

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
