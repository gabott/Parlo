// ============================================================
//  Videos — curated YouTube channels & resources
// ============================================================
import { useState } from "react";
import { videos, videoLevels } from "../content/videos";
import PageHeader from "../PageHeader";

export default function Videos() {
  const [level, setLevel] = useState("All");

  const list = videos.filter((v) => level === "All" || v.level === level);

  return (
    <div>
      <PageHeader
        image="videos.jpg"
        emoji="▶️"
        title="Videos & resources"
        subtitle="Hand-picked free channels to learn by listening. Opens on YouTube."
      />

      {/* Level filter */}
      <div className="pills">
        <button
          className={level === "All" ? "pill active" : "pill"}
          onClick={() => setLevel("All")}
        >
          All levels
        </button>
        {videoLevels.map((l) => (
          <button
            key={l}
            className={level === l ? "pill active" : "pill"}
            onClick={() => setLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {list.map((v, i) => (
          <div key={i} className="video-card">
            {/* If a youtubeId is provided, embed the player. */}
            {v.youtubeId && (
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${v.youtubeId}`}
                  title={v.title}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            )}
            <div className="video-body">
              <div className="video-head">
                <span className="video-channel">{v.channel}</span>
                <span className="tag level">{v.level}</span>
              </div>
              <div className="video-title">{v.title}</div>
              <div className="video-note">{v.note}</div>
              <a className="btn primary" href={v.url} target="_blank" rel="noreferrer">
                Open on YouTube ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
