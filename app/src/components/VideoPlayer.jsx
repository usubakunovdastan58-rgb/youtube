const VideoPlayer = ({ videoUrl }) => {
  
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(videoUrl);

  return (
    <div className="video-wrapper" style={{ margin: '20px 0' }}>
      {videoId ? (
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
        ></iframe>
      ) : (
        <p style={{ color: 'red' }}>Ошибка: Некорректная ссылка на видео</p>
      )}
    </div>
  );
};

export default VideoPlayer;