"use client";

import React, {useState, useEffect} from 'react'
import Image from "next/image";
import Link from "next/link";
import {formatNumber, formatTimeAgo} from "@/utils/format";
import {IVideo} from "@/types/videoinfo.interface";
import {Button} from '@/components/ui/button';
import PlayListInterface from "@/components/pages/watch/playlist-block"
import api from '@/services/axiosApi';
import {useUser} from '@clerk/nextjs';
import {IUser} from '@/types/user.interface';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    PlayCircle,
    MoreVertical,
    Plus,
    ListPlus,
    Share2,
    Clock,
    List,
    X,
    Lock,
    Globe,
    Users,
    Check
} from 'lucide-react';
import {IChannel} from '@/types/channelinfo.interface';
import {formatDuration} from "@/utils/dateformat";

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

export default function VideoCard({el}: IVideoCardProps) {
    const [coverBase64, setCoverBase64] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [existingPlaylists, setExistingPlaylists] = useState<Playlist[]>([]);
    const [userChannel, setUserChannel] = useState<IChannel | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetching clerk user info
    const {user: clerkUser, isLoaded: isUserLoaded} = useUser();

    // Base64 conversion for video cover image
    useEffect(() => {
        if (el.cover) {
            const coverArray = new Uint8Array(atob(el.cover).split('').map(char => char.charCodeAt(0)));
            const chunkSize = 65536;
            let result = '';
            for (let i = 0; i < coverArray.length; i += chunkSize) {
                const chunk = coverArray.subarray(i, i + chunkSize);
                result += String.fromCharCode(...Array.from(chunk));
            }
            const base64 = btoa(result);
            setCoverBase64(base64);
        }
    }, [el.cover]);

    useEffect(() => {
        if (isUserLoaded && clerkUser) {
            // fetchUserData();
            getUserChannel();
            fetchPlaylists();
        }
    }, [isUserLoaded, clerkUser]);

    // Fetching user data (channel settings)
    //цей метод не потрібний бо в getUserChannel ми отримуємо даннi каналу за допомогою clerkUser?.id і
    //тоді не потрібно отримувати id каналу щоб потім отримати дані каналу по id
    /*const fetchUserData = async () => {
        try {
            const response = await api.get(`/ChannelSettings/getinfobychannelid/${clerkUser?.id}`);
            if (response.status === 200) {
                const channelSettingsId = response.data.id;
                getUserChannel(channelSettingsId); // Fetch channel info
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };*/

    // Fetching user channel data by channel ID
    const getUserChannel = async (/*channelId: number*/) => {
        try {
            const response = await api.get(`/ChannelSettings/getbyownerid/${clerkUser?.id}`);
            if (response.status === 200) {
                setUserChannel(response.data); // Set channel data
            }
        } catch (error) {
            console.error('Error fetching user channel:', error);
        }
    };
    const fetchUserData = async () => {
        try {
            const response = await api.get(`User/getbyclerkid/${clerkUser?.id}`);
            if (response.status === 200) {
                const channelData: IChannel = response.data;
                setUserChannel(channelData);
                console.log('Fetched channel data:', channelData);
            }
        } catch (error) {
            console.error('Error fetching channel data:', error);
        }
    };

    // Fetch playlists for the user
    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/PlayList/getbyuserid/${clerkUser?.id}`);
            setExistingPlaylists(response.data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId: number) => {
        try {
            fetchUserData();
            fetchPlaylists();
            const selectedPlaylist = existingPlaylists.find(
                (playlist) => playlist.id === playlistId
            );

            if (!selectedPlaylist) {
                console.error('Playlist not found');
                return;
            }

            const updatedVideosId = [...selectedPlaylist.videosId, el.id];

            // Оновлена структура плейлиста
            const updatedPlaylist = {
                ...selectedPlaylist,
                videosId: updatedVideosId,
                date: new Date().toISOString(), // Оновлюємо дату
            };

            await api.put(`/PlayList/update`, updatedPlaylist);
            setExistingPlaylists((prev) =>
                prev.map((playlist) =>
                    playlist.id === playlistId
                        ? {...playlist, videosId: updatedVideosId}
                        : playlist
                )
            );

            console.log('Video successfully added to playlist:', playlistId);
        } catch (error) {
            console.error('Error adding video to playlist:', error);
        }
    };

    const handleCreateNewPlaylist = async (name: string, privacy: string) => {
        try {
            await fetchUserData();
            await fetchPlaylists();
            if (!userChannel?.id) {
                console.error('User channel ID is missing');
                return;
            }

            const newPlaylist = {
                id: 0,
                userId: userChannel.id,
                title: name,
                access: privacy === 'public', // Булеве значення
                date: new Date().toISOString(),
                videosId: [], // Порожній масив
            };

            console.log('Data being sent to the server:', newPlaylist);

            const response = await api.post('/PlayList/add', newPlaylist);

            if (response.status === 200 || response.status === 201) {
                console.log('Created new playlist:', response.data);
                setExistingPlaylists((prev) => [...prev, response.data]);
            } else {
                console.error('Unexpected response status:', response.status, response.data);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('General error:', error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    return (
        <div className="space-y-2.5">
            <Link href={`/watch/${el.id}`} className="block relative">
                {coverBase64 && (
                    <><Image
                        src={`data:image/jpeg;base64,${coverBase64}`}
                        alt={el.tittle}
                        width={1000}
                        height={1000}
                        className="rounded-xl aspect-[16/9]"/>
                        <div
                            className="bg-black px-1 text-[0.785rem] text-white rounded w-max absolute bottom-1.5 right-1.5">
                            {formatDuration(el.duration)}
                        </div>
                    </>
                )
                }
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
                        <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                        {formatTimeAgo(new Date(el.uploadDate))}
                    </div>
                </div>

                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-auto">
                            <MoreVertical className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setIsPlaylistModalOpen(true)}>
                            <List className="mr-2 h-4 w-4"/> Save to playlist
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4"/> Save to Watch later
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ListPlus className="mr-2 h-4 w-4"/> Add to queue
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4"/> Share
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

function PlaylistModal({
                           videoId,
                           existingPlaylists,
                           onClose,
                           onAddToPlaylist,
                           onCreateNewPlaylist
                       }: PlaylistModalProps) {
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
                        <X className="w-6 h-6"/>
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
                                {!playlist.access && <Lock className="w-4 h-4 text-gray-500"/>}
                                {playlist.access && <Globe className="w-4 h-4 text-gray-500"/>}
                            </div>
                            {selectedPlaylists.includes(playlist.id) ? (
                                <Check className="w-5 h-5 text-green-500"/>
                            ) : (
                                <Plus className="w-5 h-5 text-gray-400"/>
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
                            <Lock className="w-4 h-4 mr-1"/> Private
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="public"
                                checked={privacy === 'public'}
                                onChange={(e) => setPrivacy(e.target.value)}
                                className="mr-2"
                            />
                            <Globe className="w-4 h-4 mr-1"/> Public
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