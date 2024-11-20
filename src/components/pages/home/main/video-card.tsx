"use client";

import React, { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { formatNumber, formatTimeAgo } from "@/utils/format";
import { IVideo } from "@/types/videoinfo.interface";
import { Button } from '@/components/ui/button';
import api from '@/services/axiosApi';
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlayCircle, MoreVertical, Plus, ListPlus, Share2, Clock, List, X, Lock, Globe, Users, Check } from 'lucide-react';

interface IVideoCardProps {
  el: IVideo;
}

interface Playlist {
  id: number;
  userId: number;
  title: string;
  access: boolean;
  date: string;
  videosId: number[];
}

export default function VideoCard({ el }: IVideoCardProps) {
  const [coverBase64, setCoverBase64] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)
  const [existingPlaylists, setExistingPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<IUser | null>(null)
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser()

  useEffect(() => {
    if (el.cover) {
      const coverArray = new Uint8Array(atob(el.cover).split('').map(char => char.charCodeAt(0)))
      const base64 = btoa(String.fromCharCode.apply(null, Array.from(coverArray)))
      setCoverBase64(base64)
    }
  }, [el.cover])

  useEffect(() => {
    if (isUserLoaded && clerkUser) {
      fetchUserData()
      fetchPlaylists()
    }
  }, [isUserLoaded, clerkUser])

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/ChannelSettings/getinfobychannelid/${clerkUser?.id}`)
      if (response.status === 200) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchPlaylists = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/api/PlayList/${clerkUser?.id}`)
      setExistingPlaylists(response.data)
    } catch (error) {
      console.error('Error fetching playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      await api.post(`/api/PlayList/add`, { videoId: el.id })
      console.log('Video added to playlist:', playlistId)
    } catch (error) {
      console.error('Error adding video to playlist:', error)
    }
  }

  const handleCreateNewPlaylist = async (name: string, privacy: string) => {
    try {
      const response = await api.post('/api/playlists', {
        userId: clerkUser?.id,
        name,
        privacy,
      })
      const newPlaylist = response.data
      setExistingPlaylists(prev => [...prev, newPlaylist])
      console.log('Created new playlist:', newPlaylist)
    } catch (error) {
      console.error('Error creating playlist:', error)
    }
  }

  return (
    <div className="space-y-2.5">
      <Link href={`/watch/${el.id}`} className="block">
        {coverBase64 && (
          <Image
            src={`data:image/jpeg;base64,${coverBase64}`}
            alt={el.tittle}
            width={1000}
            height={1000}
            className="rounded-xl aspect-[16/9]"
          />
        )}
      </Link>

      <div className="flex space-x-2.5">
        <Image
          src={el.channelProfilePhoto}
          alt={el.channelName}
          width={35}
          height={35}
          className="rounded-full w-9 h-9"
        />
        <div className="flex-1">
          <Link href={`/watch/${el.id}`} className="block">
            <div className="font-bold mb-0.5 line-clamp-2">{el.tittle}</div>
          </Link>
          <div className="text-neutral-500 text-[0.9rem]">{el.channelNikName}</div>
          <div className="text-neutral-500 text-[0.9rem] flex items-center">
            {formatNumber(el.viewCount)} views
            <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2" />
            {formatTimeAgo(new Date(el.uploadDate))}
          </div>
        </div>

        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsPlaylistModalOpen(true)}>
              <List className="mr-2 h-4 w-4" /> Save to playlist
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="mr-2 h-4 w-4" /> Save to Watch later
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ListPlus className="mr-2 h-4 w-4" /> Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isPlaylistModalOpen && (
        <PlaylistModal
          videoId={el.id}
          existingPlaylists={existingPlaylists}
          onClose={() => setIsPlaylistModalOpen(false)}
          onAddToPlaylist={handleAddToPlaylist}
          onCreateNewPlaylist={handleCreateNewPlaylist}
        />
      )}
    </div>
  )
}

interface PlaylistModalProps {
  videoId: number;
  existingPlaylists: Playlist[];
  onClose: () => void;
  onAddToPlaylist: (playlistId: number) => void;
  onCreateNewPlaylist: (name: string, privacy: string) => void;
}

function PlaylistModal({ videoId, existingPlaylists, onClose, onAddToPlaylist, onCreateNewPlaylist }: PlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState('')
  const [privacy, setPrivacy] = useState('private')
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([])

  const handleAddToPlaylist = () => {
    selectedPlaylists.forEach(playlistId => onAddToPlaylist(playlistId))
    onClose()
  }

  const handleCreateNewPlaylist = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateNewPlaylist(playlistName, privacy)
    setPlaylistName('')
    setPrivacy('private')
  }

  const togglePlaylistSelection = (playlistId: number) => {
    setSelectedPlaylists(prev =>
      prev.includes(playlistId) ? prev.filter(id => id !== playlistId) : [...prev, playlistId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Save to...</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto mb-4">
          {existingPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => togglePlaylistSelection(playlist.id)}
            >
              <div className="flex items-center">
                <span className="mr-2">{playlist.title}</span>
                {!playlist.access && <Lock className="w-4 h-4 text-gray-500" />}
                {playlist.access && <Globe className="w-4 h-4 text-gray-500" />}
              </div>
              {selectedPlaylists.includes(playlist.id) ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Plus className="w-5 h-5 text-gray-400" />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleAddToPlaylist}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mb-4"
        >
          Add to playlist
        </button>
        <form onSubmit={handleCreateNewPlaylist}>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter new playlist name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          />
          <div className="flex justify-between mb-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="private"
                checked={privacy === 'private'}
                onChange={(e) => setPrivacy(e.target.value)}
                className="mr-2"
              />
              <Lock className="w-4 h-4 mr-1" /> Private
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="public"
                checked={privacy === 'public'}
                onChange={(e) => setPrivacy(e.target.value)}
                className="mr-2"
              />
              <Globe className="w-4 h-4 mr-1" /> Public
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
          >
            Create new playlist
          </button>
        </form>
      </div>
    </div>
  )
}