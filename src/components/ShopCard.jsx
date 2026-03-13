import React from 'react'
import { Link } from 'react-router-dom'

function ShopCard({ shop }) {
  const badgeText = shop.status === 'new' ? 'Mới mở' :
                    shop.status === 'closed_temp' ? 'Tạm đóng' :
                    shop.status === 'closed_permanent' ? 'Đã đóng' : '';

  return (
    <Link to={`/detail?slug=${shop.slug}`} className="shop-card">
      <div className="shop-card__image">
        <img src={shop.image_url || '/images/shop-1.jpg'} alt={shop.name} loading="lazy" />
        {badgeText && <span className="shop-card__badge">{badgeText}</span>}
        <button 
          className="shop-card__map-link"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${shop.latitude && shop.longitude ? `${shop.latitude},${shop.longitude}` : encodeURIComponent(`${shop.name} Đà Nẵng`)}`;
            window.open(mapUrl, '_blank');
          }}
          title="Xem vị trí trên Google Maps"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </button>
      </div>
      <div className="shop-card__name">{shop.name}</div>
    </Link>
  )
}

export function CTACard({ text }) {
  return (
    <div className="shop-card shop-card--cta">
      <div className="shop-card__image">
        <div className="cta-card-content">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <p>{text}</p>
        </div>
      </div>
      <div className="shop-card__name">{text}</div>
    </div>
  )
}

export default ShopCard
