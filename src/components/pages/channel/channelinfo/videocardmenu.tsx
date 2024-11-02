
import { useState, useEffect } from 'react';
import { FaCaretSquareDown, FaRegClock, FaFlag, FaFacebook, FaTwitter, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { MdPlaylistAdd } from 'react-icons/md';
import { BsShare } from 'react-icons/bs';
import { IVideo } from '@/types/videoinfo.interface';
import RadioButtonList  from "@/components/pages/comments/report";

interface IProps {
  video: IVideo;
}

const MenuBlock: React.FC<IProps> = ({ video }) => {
  const [v, setVideo] = useState<IVideo | null>(null);
  const [hrefFB, setHrefFB] = useState('');
  const [hrefTW, setHrefTW] = useState('');
  const [hrefT, setHrefT] = useState('');
  const [hrefW, setHrefW] = useState('');
  const [activeMenu, setActiveMenu] = useState<'default' | 'report' | 'share'>('default');

  useEffect(() => {
    setVideo(video);
    
    setHrefFB(`https://facebook.com/share?url=${video.videoUrl}`);
    setHrefTW(`https://twitter.com/share?url=${video.videoUrl}`);
    setHrefT(`https://t.me/share/url?url=${video.videoUrl}`);
    setHrefW(`https://wa.me/?text=${video.videoUrl}`);
  }, [video]);

  const openReport = () => {
    setActiveMenu(activeMenu === 'report' ? 'default' : 'report');
  };

  const openShare = () => {
    setActiveMenu(activeMenu === 'share' ? 'default' : 'share');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
     paddingLeft: '15px', backgroundColor: 'white', paddingRight: '15px' }}>
      
      {activeMenu === 'default' && (
        <div>
          <div style={{ paddingTop: '5px', display: 'flex' }}>
            <FaCaretSquareDown size={14} className="text-gray-600 cursor-pointer" title="Add to queue" />
            <span style={{ fontSize: '14px' }}>&nbsp;&nbsp;Add to queue</span>
          </div>
          <div style={{ paddingTop: '5px', display: 'flex' }}>
            <FaRegClock size={14} className="text-gray-600 cursor-pointer" title="Save to watch later" />
            <span style={{ fontSize: '14px' }}>&nbsp;&nbsp;Save to watch later</span>
          </div>
          <div style={{ paddingTop: '5px', display: 'flex' }}>
            <MdPlaylistAdd size={14} className="text-gray-600 cursor-pointer" title="Save to playlist" />
            <span style={{ fontSize: '14px' }}>&nbsp;&nbsp;Save to playlist</span>
          </div>
          <div onClick={openShare} style={{ paddingTop: '5px', display: 'flex' }}>
            <BsShare size={14} className="text-gray-600 cursor-pointer" title="Share" />
            <span style={{ fontSize: '14px' }}>&nbsp;&nbsp;Share</span>
          </div>
          <div onClick={openReport} style={{ paddingTop: '5px', display: 'flex' }}>
            <FaFlag size={14} className="text-gray-600 cursor-pointer" title="Report" />
            <span style={{ paddingBottom: '5px', fontSize: '14px' }}>&nbsp;&nbsp;Report</span>
          </div>
        </div>
      )}
 
      {activeMenu === 'report' && v && (
        <div
          className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10"
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            marginTop: '-350px',
            marginLeft: '-100px',
            maxWidth: '400px',
            minWidth: '300px',
            borderRadius: '20px'
          }}
        >
          <RadioButtonList userName={video.tittle} onClose={openReport} />
        </div>
      )}

      {activeMenu === 'share' && (
        <div
          className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-2"
          style={{ maxWidth: '310px' }}
        >
          <div style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
            <button style={{ padding: '5px', paddingTop: '0', fontWeight: 'bold', color: 'gray' }} onClick={openShare}>
              X
            </button>
          </div>
          <div>
            <div className="flex space-x-4 justify-center">
              <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} className="text-blue-600 cursor-pointer" title="Share on Facebook" />
              </a>
              <a href={hrefTW} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} className="text-blue-400 cursor-pointer" title="Share on Twitter" />
              </a>
              <a href={hrefT} target="_blank" rel="noopener noreferrer">
                <FaTelegram size={24} className="text-blue-500 cursor-pointer" title="Share on Telegram" />
              </a>
              <a href={hrefW} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={24} className="text-green-500 cursor-pointer" title="Share on Whatsapp" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBlock;
