import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="panel center not-found">
      <div className="not-found-code" aria-hidden="true">404</div>
      <h1>Page not found</h1>
      <p className="page-sub">This page may have moved, or the address may be incorrect.</p>
      <Link className="btn primary" to="/">Return to dashboard</Link>
    </div>
  );
}
