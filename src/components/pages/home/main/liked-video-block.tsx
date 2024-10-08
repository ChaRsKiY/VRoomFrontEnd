import { data } from "@/testdata/videos";
import VideoCard from "@/components/pages/home/main/video-card-view";

interface ILikedVideosProps {
  t: (key: string) => string; 
}

const LikedVideos: React.FC<ILikedVideosProps> = ({ t }) => {
  return (
    <div className="flex min-h-screen w-full">
      <main className="flex-grow  h-[calc(100vh-80px)] pl-10"> 
        {data.length > 0 ? (
          data.map((el, idx) => (
            <VideoCard key={idx} el={el} index={idx} /> 
          ))
        ) : (
          <p className="text-center text-gray-500">{t('No videos available')}</p> 
        )}
      </main>
    </div>
  );
};

export default LikedVideos;