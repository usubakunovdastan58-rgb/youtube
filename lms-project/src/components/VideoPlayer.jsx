function extractYouTubeVideoId(videoUrl) {
  if (!videoUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(videoUrl);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (parsedUrl.pathname === "/watch") {
      return parsedUrl.searchParams.get("v") || "";
    }

    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || "";
    }

    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || "";
    }
  } catch {
    const matchedVideoId = videoUrl.match(
      /(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/,
    );

    return matchedVideoId?.[1] || "";
  }

  return "";
}

export default function VideoPlayer({ videoUrl, title }) {
  const videoId = extractYouTubeVideoId(videoUrl);

  if (!videoUrl) {
    return (
      <div className="video-shell video-shell--empty">
        <p>Добавь `videoUrl` урока из Firebase, чтобы здесь появился YouTube-плеер.</p>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="video-shell video-shell--empty">
        <p>Ссылка YouTube не распознана. Проверь поле `videoUrl` у урока.</p>
      </div>
    );
  }

  return (
    <div className="video-shell">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
