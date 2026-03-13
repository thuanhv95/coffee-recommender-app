import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Clock, CreditCard, Phone, MessageSquare, Flame, Star } from 'lucide-react'
import { fetchShopBySlug } from '../api'

function Detail() {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      setLoading(true)
      fetchShopBySlug(slug).then(data => {
        setShop(data)
        setLoading(false)
        if (data) document.title = `${data.name} - Danang Coffee`
      })
    }
  }, [slug])

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Đang tải thông tin quán...</div>
  if (!shop) return <div style={{ textAlign: 'center', padding: '10rem' }}>Không tìm thấy thông tin quán.</div>

  const badgeText = shop.status === 'new' ? 'Mới mở' :
                    shop.status === 'closed_temp' ? 'Tạm đóng' :
                    shop.status === 'closed_permanent' ? 'Đã đóng' : '';

  return (
    <article className="shop-detail">
      <div className="shop-detail__main">
        <div className="shop-detail__gallery">
          <img src={shop.image_url || '/images/shop-1.jpg'} alt={shop.name} />
        </div>
        <div className="shop-detail__info">
          <div className="shop-detail__header">
            <h1 className="shop-detail__title">{shop.name}</h1>
            {badgeText && (
              <span className={`shop-detail__status ${shop.status === 'active' ? 'shop-detail__status--active' : ''}`}>
                {badgeText}
              </span>
            )}
          </div>
          
          <a 
            href={shop.latitude && shop.longitude 
              ? `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address || ''} Đà Nẵng`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-detail__address"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <MapPin size={20} />
            <span>{shop.address ? `${shop.address}, ` : ''}{shop.district}, Đà Nẵng</span>
          </a>

          <div className="shop-detail__section">
            <h2 className="shop-detail__section-title">Giới thiệu</h2>
            <p className="shop-detail__desc">{shop.description || 'Chưa có mô tả cho quán này.'}</p>
          </div>

          <div className="shop-detail__section">
            <h2 className="shop-detail__section-title">Tiện ích & Không gian</h2>
            <div className="shop-detail__tags">
              {shop.purposes.map(p => <span key={p} className="shop-detail__tag">{p}</span>)}
              {shop.spaces.map(s => <span key={s} className="shop-detail__tag">{s}</span>)}
              {shop.amenities.map(a => <span key={a} className="shop-detail__tag">{a}</span>)}
            </div>
          </div>

          {shop.drinks && shop.drinks.length > 0 && (
            <div className="shop-detail__menu-container">
              {/* Nước uống Section */}
              {shop.drinks.some(d => d.category === 'drink') && (
                <div className="shop-detail__section">
                  <div className="shop-detail__section-header">
                    <h2 className="shop-detail__section-title">Menu / Đồ uống nổi bật</h2>
                    <div className="menu-legend">
                      <span className="legend-item"><Star size={12} className="icon--signature" /> Món đặc trưng</span>
                      <span className="legend-item"><Flame size={12} className="icon--trending" /> Bán chạy</span>
                    </div>
                  </div>
                  <div className="shop-detail__menu">
                    {[...shop.drinks]
                      .filter(d => d.category === 'drink')
                      .sort((a, b) => {
                        if (a.is_signature && !b.is_signature) return -1;
                        if (!a.is_signature && b.is_signature) return 1;
                        if (a.is_trending && !b.is_trending) return -1;
                        if (!a.is_trending && b.is_trending) return 1;
                        return 0;
                      })
                      .map((drink, index) => (
                        <div key={index} className="menu-item">
                          <div className="menu-item__left">
                            <span className="menu-item__name">{drink.name}</span>
                            <div className="menu-item__badges">
                              {drink.is_signature && (
                                <span className="drink-badge drink-badge--signature">
                                  <Star size={10} fill="currentColor" /> Signature
                                </span>
                              )}
                              {drink.is_trending && (
                                <span className="drink-badge drink-badge--trending">
                                  <Flame size={10} fill="currentColor" /> Hot Trend
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="menu-item__price">{drink.price}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Bánh ngọt Section */}
              {shop.drinks.some(d => d.category === 'pastry') && (
                <div className="shop-detail__section">
                  <div className="shop-detail__section-header">
                    <h2 className="shop-detail__section-title">Bánh ngọt & Đồ ăn nhẹ</h2>
                  </div>
                  <div className="shop-detail__menu">
                    {[...shop.drinks]
                      .filter(d => d.category === 'pastry')
                      .sort((a, b) => {
                        if (a.is_signature && !b.is_signature) return -1;
                        if (!a.is_signature && b.is_signature) return 1;
                        if (a.is_trending && !b.is_trending) return -1;
                        if (!a.is_trending && b.is_trending) return 1;
                        return 0;
                      })
                      .map((pastry, index) => (
                        <div key={index} className="menu-item">
                          <div className="menu-item__left">
                            <span className="menu-item__name">{pastry.name}</span>
                            <div className="menu-item__badges">
                              {pastry.is_signature && (
                                <span className="drink-badge drink-badge--signature">
                                  <Star size={10} fill="currentColor" /> Signature
                                </span>
                              )}
                              {pastry.is_trending && (
                                <span className="drink-badge drink-badge--trending">
                                  <Flame size={10} fill="currentColor" /> Hot Trend
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="menu-item__price">{pastry.price}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <aside className="shop-sidebar">
        <div className="widget">
          <h3 className="widget__title">Thông tin cơ bản</h3>
          <div className="widget__item">
            <div className="widget__icon"><Clock size={20} /></div>
            <div>
              <div className="widget__label">Giờ mở cửa</div>
              <div className="widget__value">{shop.opening_hours || 'Chưa cập nhật'}</div>
            </div>
          </div>
          <div className="widget__item">
            <div className="widget__icon"><CreditCard size={20} /></div>
            <div>
              <div className="widget__label">Giá khoảng</div>
              <div className="widget__value">{shop.price_range || 'Chưa cập nhật'}</div>
            </div>
          </div>
          <div className="widget__item">
            <div className="widget__icon"><Phone size={20} /></div>
            <div>
              <div className="widget__label">Số điện thoại</div>
              <div className="widget__value">{shop.phone || 'Chưa cập nhật'}</div>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3 className="widget__title">Hành động</h3>
          <div className="widget__actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a 
              href={shop.latitude && shop.longitude 
                ? `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address || ''} Đà Nẵng`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <MapPin size={20} />
              Chỉ đường
            </a>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <MessageSquare size={20} />
              Gửi nhận xét
            </button>
          </div>
        </div>
      </aside>
    </article>
  )
}

export default Detail
