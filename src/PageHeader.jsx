// ============================================================
//  PageHeader — a banner with a background photo + title
// ------------------------------------------------------------
//  Used at the top of each section page for a professional,
//  magazine-style look. Pass an image file, emoji, title, and
//  a short subtitle.
// ============================================================
import { imageUrl } from "./pages/pageImages";

export default function PageHeader({ image, emoji, title, subtitle }) {
  return (
    <div
      className="page-header"
      style={{ backgroundImage: `url(${imageUrl(image)})` }}
    >
      <div className="page-header-overlay">
        <h1 className="page-header-title">
          {emoji && <span className="page-header-emoji">{emoji}</span>}
          {title}
        </h1>
        {subtitle && <p className="page-header-sub">{subtitle}</p>}
      </div>
    </div>
  );
}
