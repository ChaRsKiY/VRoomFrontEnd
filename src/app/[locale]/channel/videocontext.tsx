"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface VideoContextType {
  selectedVideo: File | null;
  setSelectedVideo: (file: File | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  return (
    <VideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};