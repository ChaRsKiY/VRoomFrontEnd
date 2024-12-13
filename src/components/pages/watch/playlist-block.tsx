"use client";

import React, { useState, useRef, useEffect } from 'react'
import { X, Lock, Globe, Users, List, Check, Plus } from 'lucide-react'

interface PlayListInterfaceProps {
  userId: number
}

export default function PlaylistManagerWithDropdown({ userId }: PlayListInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [privacy, setPrivacy] = useState('private')
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const existingPlaylists = [
    { id: '1', name: 'Favorites', privacy: 'private' },
    { id: '2', name: 'Music Videos', privacy: 'public' },
    { id: '3', name: 'Watch Later', privacy: 'private' },
    { id: '4', name: 'Coding Tutorials', privacy: 'unlisted' },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsAddingNew(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Adding to playlists:', selectedPlaylists)
    setSelectedPlaylists([])
    setIsOpen(false)
  }

  const handleCreateNewPlaylist = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating new playlist:', { playlistName, privacy })
    setPlaylistName('')
    setPrivacy('private')
    setIsAddingNew(false)
  }

  const togglePlaylistSelection = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation()
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    )
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={toggleDropdown}
        >
          <List className="mr-2 h-5 w-5" />
          Save to playlist
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {existingPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                role="menuitem"
                onClick={(e) => togglePlaylistSelection(e, playlist.id)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{playlist.name}</span>
                  {playlist.privacy === 'private' && <Lock className="w-4 h-4 text-gray-500" />}
                  {playlist.privacy === 'unlisted' && <Users className="w-4 h-4 text-gray-500" />}
                  {playlist.privacy === 'public' && <Globe className="w-4 h-4 text-gray-500" />}
                </div>
                {selectedPlaylists.includes(playlist.id) ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400" />
                )}
              </div>
            ))}
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={handleAddToPlaylist}
            >
              Add to playlist
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation()
                setIsAddingNew(true)
                setIsOpen(false)
              }}
            >
              <Plus className="inline-block w-5 h-5 mr-2" />
              Create new playlist
            </button>
          </div>
        </div>
      )}

      {isAddingNew && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
          <div ref={modalRef} className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
            <div className="flex justify-between items-center pb-3">
              <h2 className="text-xl font-bold">Create a new playlist</h2>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-black close-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateNewPlaylist}>
              <div className="mb-4">
                <label htmlFor="playlistName" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="playlistName"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Privacy</label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="private"
                      checked={privacy === 'private'}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Private</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="unlisted"
                      checked={privacy === 'unlisted'}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Unlisted</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="public"
                      checked={privacy === 'public'}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Public</span>
                  </label>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsAddingNew(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}