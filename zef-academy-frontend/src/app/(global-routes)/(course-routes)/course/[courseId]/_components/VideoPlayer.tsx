function VideoPlayer({
  url,
  width = "100%",
  height = "100%",
}: {
  url: string;
  width?: string;
  height?: string;
}) {
  return (
    <video controls width={width} height={height}    onLoadedMetadata={(e) => {
    const duration = e.currentTarget.duration; 
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    console.log("Video duration:", formatted); 
  }}>
      <source src={url} type="video/mp4" />
    </video>
  );
}

export default VideoPlayer;
