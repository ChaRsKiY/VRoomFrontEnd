import { useState } from 'react'
import { X, Lock, Globe, Users } from 'lucide-react'
import internal from 'stream';
interface PlayListInterfaceProps {
    userId: number;
  }
export default function PlayListInterface({ userId }: PlayListInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [privacy, setPrivacy] = useState('private')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({ playlistName, privacy, description })
    // Reset form and close modal
    setPlaylistName('')
    setPrivacy('private')
    setDescription('')
    setIsOpen(false)
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Create new playlist
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Create a new playlist</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="playlistName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="playlistName"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Privacy
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="private"
                      checked={privacy === 'private'}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="mr-2"
                    />
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Private</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="unlisted"
                      checked={privacy === 'unlisted'}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="mr-2"
                    />
                    <Users className="w-4 h-4 mr-2" />
                    <span>Unlisted</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="public"
                      checked={privacy === 'public'}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="mr-2"
                    />
                    <Globe className="w-4 h-4 mr-2" />
                    <span>Public</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}