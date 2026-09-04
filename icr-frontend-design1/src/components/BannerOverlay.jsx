import { Link } from "react-router-dom";
import useActiveBanner from "../hooks/useActiveBanner";

export default function BannerOverlay() {
  const { banner, dismiss } = useActiveBanner();

  if (!banner) return null;

  const esInterno = banner.enlace_url?.startsWith("/");

  return (
    <div className="banner-overlay" role="dialog" aria-label="Promoción">
      <div className="banner-card">
        <button type="button" className="banner-close" onClick={dismiss} aria-label="Cerrar aviso">
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        <span className="eyebrow blue">PROMOCIÓN</span>
        <h2>{banner.titulo}</h2>
        <p>{banner.mensaje}</p>
        {banner.enlace_texto && banner.enlace_url && (
          esInterno ? (
            <Link className="btn icr-btn-primary" to={banner.enlace_url} onClick={dismiss}>
              {banner.enlace_texto} <i className="bi bi-arrow-right"></i>
            </Link>
          ) : (
            <a className="btn icr-btn-primary" href={banner.enlace_url} target="_blank" rel="noopener noreferrer">
              {banner.enlace_texto} <i className="bi bi-arrow-right"></i>
            </a>
          )
        )}
      </div>
    </div>
  );
}
