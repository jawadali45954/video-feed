import { VideoFeed } from "@/components/video/VideoFeed";
import { useEffect } from "react";

const Feed = () => {
  useEffect(() => {
    document.title = "Video-Feed";
  }, []);

  return <VideoFeed />;
};

export default Feed;
