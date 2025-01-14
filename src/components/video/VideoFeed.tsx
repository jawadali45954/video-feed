import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaThumbsUp, FaThumbsDown, FaCommentDots, FaShareAlt, FaUpload } from 'react-icons/fa';

const SAMPLE_VIDEOS = [
  { id: 1, title: "Amazing Sunset at the Beach", videoId: "m51owrJeXos" },
  { id: 2, title: "City Life in Tokyo", videoId: "1rTAmGOQAFY" },
  { id: 7, title: "Wildlife Discovery", videoId: "HxZsZichYCk" }
];

export const VideoFeed = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const containerRef = useRef(null);
  const playerRefs = useRef({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      if (index !== currentVideo) {
        if (playerRefs.current[currentVideo]) {
          playerRefs.current[currentVideo].pauseVideo();
        }
        if (playerRefs.current[index]) {
          playerRefs.current[index].playVideo();
        }
        setCurrentVideo(index);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentVideo]);

  const handleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDislike = (id) => {
    setDislikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleCommentToggle = (id) => {
    setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddComment = (id, comment) => {
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), comment]
    }));
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideos((prev) => [
        ...prev,
        { id: Date.now(), title: file.name, videoUrl }
      ]);
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      loop: 1,
      mute: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <div>
      {/* Upload Section */}
      <div className="upload-section bg-gray-100 p-6 mb-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Upload Your Video</h2>
        <label className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600">
          <FaUpload size={20} /> Choose File
          <input type="file" accept="video/*" onChange={handleVideoUpload} hidden />
        </label>
      </div>

      {/* Video Feed */}
      <div ref={containerRef} className="video-scroll-container">
        {[...uploadedVideos, ...SAMPLE_VIDEOS].map((video, index) => (
          <div key={video.id} className="video-item mb-6">
            <div className="w-full h-full bg-black rounded-lg overflow-hidden">
              {video.videoId ? (
                <YouTube
                  videoId={video.videoId}
                  opts={opts}
                  onReady={(event) => (playerRefs.current[index] = event.target)}
                  className="w-full h-full"
                />
              ) : (
                <video src={video.videoUrl} controls className="w-full h-full rounded-lg shadow-lg" />
              )}
            </div>
            <div className="video-overlay p-4">
              <h2 className="text-xl font-bold mb-2">{video.title}</h2>
              <div className="flex space-x-4">
                <button onClick={() => handleLike(video.id)}><FaThumbsUp /> {likes[video.id] || 0}</button>
                <button onClick={() => handleDislike(video.id)}><FaThumbsDown /> {dislikes[video.id] || 0}</button>
                <button onClick={() => handleCommentToggle(video.id)}><FaCommentDots /></button>
                <button onClick={() => navigator.share({ title: video.title, url: window.location.href })}><FaShareAlt /></button>
              </div>
              {showComments[video.id] && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        handleAddComment(video.id, input.value);
                        input.value = '';
                      }
                    }}
                    className="border p-2 rounded-md w-full"
                  />
                  <ul className="mt-2">
                    {(comments[video.id] || []).map((comment, idx) => (
                      <li key={idx} className="bg-gray-200 p-2 rounded-md mb-1">{comment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
