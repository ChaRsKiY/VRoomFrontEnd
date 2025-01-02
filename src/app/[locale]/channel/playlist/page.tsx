'use client'
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';
import { IVideo } from "@/types/videoinfo.interface"; // Import your video interface

interface PlaylistProps {
  playlistId: string;
}

export default function PlaylistView({ playlistId }: PlaylistProps) {
  const [playlistData, setPlaylistData] = useState<{
    title: string;
    description: string;
    videos: IVideo[];
  } | null>(null); // Type the playlistData state correctly
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch playlist data based on playlistId
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`/Playlist/6`);
        if (response.ok) {
          const data = await response.json();
          setPlaylistData(data);
          setCurrentVideo(data.videos[0]);
        } else {
          console.error('Failed to fetch playlist data');
        }
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  if (!playlistData) {
    return <div>Loading...</div>; // Show loading state if playlist data is not available
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar with video list */}
      <div className="w-full md:w-96 border-r">
        <Card className="h-full rounded-none">
          <CardHeader>
            <CardTitle>{playlistData.title}</CardTitle>
            <CardDescription>{playlistData.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)] md:h-[calc(100vh-180px)]">
              {playlistData.videos.map((video, index) => (
                <Button
                  key={video.id}
                  variant={currentVideo?.id === video.id ? "secondary" : "ghost"}
                  className="w-full justify-start px-2 py-4 h-auto"
                  onClick={() => setCurrentVideo(video)}
                >
                  <div className="flex items-center w-full">
                    <div className="relative mr-4 flex-shrink-0">
                      <img
                        src={video.cover}
                        alt={video.tittle}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-left line-clamp-2">{video.tittle}</p>
                    </div>
                    <span className="text-muted-foreground text-sm ml-2">
                      {index + 1}
                    </span>
                  </div>
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main content area */}
      <div className="flex-grow p-6">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          {currentVideo && (
            <img
              src={currentVideo.cover}
              alt={currentVideo.tittle}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {currentVideo && (
          <>
            <h2 className="text-2xl font-bold mb-2">{currentVideo.tittle}</h2>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="outline" onClick={() => {
                const currentIndex = playlistData.videos.findIndex(v => v.id === currentVideo.id);
                const prevVideo = playlistData.videos[currentIndex - 1];
                if (prevVideo) setCurrentVideo(prevVideo);
              }}>
                <ChevronUp className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" onClick={() => {
                const currentIndex = playlistData.videos.findIndex(v => v.id === currentVideo.id);
                const nextVideo = playlistData.videos[currentIndex + 1];
                if (nextVideo) setCurrentVideo(nextVideo);
              }}>
                <ChevronDown className="mr-2 h-4 w-4" />
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}