'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Mic, MicOff, Video, VideoOff, Monitor, Settings, Users, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HubConnectionBuilder } from "@microsoft/signalr";

const connection = new HubConnectionBuilder()
    .withUrl("https://your-server.com/webrtc")
    .build();

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  // Add your TURN server here if needed
]

export default function WebRTCBroadcast() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [userFacing, setUserFacing] = useState(true)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamDescription, setStreamDescription] = useState('')
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [peerConnections, setPeerConnections] = useState<Record<string, RTCPeerConnection>>({})
  const [viewerCount, setViewerCount] = useState(0)
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [newChatMessage, setNewChatMessage] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const ws = useRef<WebSocket | null>(null)
  useEffect(() => {
    connection.on("ReceiveOffer", handleOffer);
    connection.on("ReceiveAnswer", handleAnswer);
    connection.on("ReceiveIceCandidate", handleNewICECandidate);
  
    return () => {
      connection.off("ReceiveOffer", handleOffer);
      connection.off("ReceiveAnswer", handleAnswer);
      connection.off("ReceiveIceCandidate", handleNewICECandidate);
    };
  }, []);
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds(seconds => seconds + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      setupWebSocket()
    }
    return () => {
      ws.current?.close()
    }
  }, [isActive])

  const setupWebSocket = () => {
    ws.current = new WebSocket('wss://localhost:5024')
    
    ws.current.onopen = () => console.log('WebSocket Open')
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch(data.type) {
        case 'viewer-connected':
          handleNewViewer(data.viewerId)
          break
        case 'viewer-disconnected':
          handleViewerDisconnect(data.viewerId)
          break
        case 'offer':
          handleOffer(data.offer, data.viewerId)
          break
        case 'answer':
          handleAnswer(data.answer, data.viewerId)
          break
        case 'ice-candidate':
          handleNewICECandidate(data.candidate, data.viewerId)
          break
        case 'chat-message':
          setChatMessages(prev => [...prev, data.message])
          break
      }
    }
  }

  const handleNewViewer = (viewerId: string) => {
    const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current?.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          viewerId: viewerId
        }))
      }
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, mediaStream)
      })
    }

    setPeerConnections(prev => ({ ...prev, [viewerId]: peerConnection }))
    setViewerCount(count => count + 1)

    peerConnection.createOffer()
      .then(offer => peerConnection.setLocalDescription(offer))
      .then(() => {
        ws.current?.send(JSON.stringify({
          type: 'offer',
          offer: peerConnection.localDescription,
          viewerId: viewerId
        }))
      })
  }

  const handleViewerDisconnect = (viewerId: string) => {
    const peerConnection = peerConnections[viewerId]
    if (peerConnection) {
      peerConnection.close()
      setPeerConnections(prev => {
        const newConnections = { ...prev }
        delete newConnections[viewerId]
        return newConnections
      })
      setViewerCount(count => count - 1)
    }
  }

  const handleOffer = (offer: RTCSessionDescriptionInit, viewerId: string) => {
    const peerConnection = peerConnections[viewerId]
    if (peerConnection) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => peerConnection.createAnswer())
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
          ws.current?.send(JSON.stringify({
            type: 'answer',
            answer: peerConnection.localDescription,
            viewerId: viewerId
          }))
        })
    }
  }

  const handleAnswer = (answer: RTCSessionDescriptionInit, viewerId: string) => {
    const peerConnection = peerConnections[viewerId]
    if (peerConnection) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    }
  }

  const handleNewICECandidate = (candidate: RTCIceCandidateInit, viewerId: string) => {
    const peerConnection = peerConnections[viewerId]
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }

  const startStream = async () => {
    setIsActive(true)
    try {
      await enableStream()
    } catch (error) {
      console.error('Error starting stream:', error)
      setIsActive(false)
    }
  }

  const stopStream = () => {
    setIsActive(false)
    mediaStream?.getTracks().forEach(track => track.stop())
    setMediaStream(null)
    Object.values(peerConnections).forEach(pc => pc.close())
    setPeerConnections({})
    setViewerCount(0)
    ws.current?.close()
  }

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
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      }
      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setUserFacing(!userFacing)

      // Update all peer connections with the new stream
      Object.values(peerConnections).forEach(pc => {
        const senders = pc.getSenders()
        senders.forEach(sender => {
          if (sender.track?.kind === 'video') {
            sender.replaceTrack(stream.getVideoTracks()[0])
          }
          if (sender.track?.kind === 'audio') {
            sender.replaceTrack(stream.getAudioTracks()[0])
          }
        })
      })
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

  const sendChatMessage = () => {
    if (newChatMessage.trim() && ws.current) {
      ws.current.send(JSON.stringify({ type: 'chat-message', message: newChatMessage }))
      setNewChatMessage('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Start a New WebRTC Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Stream Setup</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="setup" className="space-y-4">
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
            </TabsContent>
            <TabsContent value="preview">
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

              <div className="flex justify-center space-x-2 mt-4">
                <Button onClick={toggleCamera} variant="outline" size="icon">
                  {isVideoOn ? <Video size="24" /> : <VideoOff size="24" />}
                </Button>
                <Button onClick={toggleMute} variant="outline" size="icon">
                  {isMuted ? <MicOff size="24" /> : <Mic size="24" />}
                </Button>
                <Button onClick={toggleScreenShare} variant="outline" size="icon">
                  <Monitor size="24" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings size="24" />
                </Button>
              </div>

              {isActive && (
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm font-medium">
                    Stream time: {formatTime(seconds)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size="16" />
                    <span className="text-sm font-medium">{viewerCount} viewers</span>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="chat">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-100 rounded-md">
                    {message}
                  </div>
                ))}
              </ScrollArea>
              <div className="mt-4 flex space-x-2">
                <Input
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <Button onClick={sendChatMessage}>
                  <MessageSquare size="16" className="mr-2" />
                  Send
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={startStream} disabled={isActive}>Start Stream</Button>
          <Button onClick={stopStream} disabled={!isActive}>Stop Stream</Button>
        </CardFooter>
      </Card>
    </div>
  )
}