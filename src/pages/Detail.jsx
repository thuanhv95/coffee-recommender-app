import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  MapPin, Clock, CreditCard, Phone, MessageSquare, Flame, Star, 
  Wifi, Snowflake, Car, Computer, Users, TreePine, 
  Camera, VolumeX, Music, Cigarette, BookOpen, Check 
} from 'lucide-react'
import { fetchShopBySlug } from '../api'
import toast from 'react-hot-toast'

function Detail() {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      toast.error('Vui lòng nhập nội dung nhận xét!');
      return;
    }
    const newReview = {
      author: 'Bạn',
      rating,
      text: reviewText,
      date: 'Vừa xong'
    };
    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setReviewText('');
    setRating(5);
    toast.success('Gửi nhận xét thành công! Cảm ơn đóng góp của bạn.');
  };

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

  const getTagIcon = (tag) => {
    const t = tag.toLowerCase()
    if (t.includes('wifi')) return <Wifi size={14} />
    if (t.includes('điều hòa') || t.includes('máy lạnh')) return <Snowflake size={14} />
    if (t.includes('xe') || t.includes('bãi đỗ')) return <Car size={14} />
    if (t.includes('thẻ') || t.includes('thanh toán')) return <CreditCard size={14} />
    if (t.includes('làm việc') || t.includes('laptop')) return <Computer size={14} />
    if (t.includes('hẹn hò') || t.includes('nhóm')) return <Users size={14} />
    if (t.includes('ngoài trời') || t.includes('sân vườn') || t.includes('hiên')) return <TreePine size={14} />
    if (t.includes('chụp ảnh') || t.includes('sống ảo') || t.includes('check')) return <Camera size={14} />
    if (t.includes('yên tĩnh')) return <VolumeX size={14} />
    if (t.includes('nhạc') || t.includes('acoustic')) return <Music size={14} />
    if (t.includes('hút thuốc')) return <Cigarette size={14} />
    if (t.includes('sách')) return <BookOpen size={14} />
    return <Check size={14} />
  }

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
              {[...(shop.purposes || []), ...(shop.spaces || []), ...(shop.amenities || [])].map(tag => (
                <span key={tag} className="shop-detail__tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {getTagIcon(tag)} {tag}
                </span>
              ))}
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

          {/* REVIEWS SECTION */}
          <div className="shop-detail__section mt-8">
            <h2 className="shop-detail__section-title">Nhận xét từ cộng đồng ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="shop-detail__desc" style={{ marginTop: '1rem' }}>Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá quán này!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{r.author}</span>
                      <span className="review-rating">{Array(r.rating).fill('★').join('')}{Array(5-r.rating).fill('☆').join('')}</span>
                    </div>
                    <p className="review-content">{r.text}</p>
                    <span className="review-date">{r.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
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
            <button 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => setShowReviewModal(true)}
            >
              <MessageSquare size={20} />
              Gửi nhận xét
            </button>
          </div>
        </div>
      </aside>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>Gửi nhận xét cho quán</h3>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Đánh giá của bạn</label>
              <div className="rating-select" style={{ display: 'flex', gap: '8px' }}>
                 {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      size={28} 
                      fill={rating >= star ? '#fbbf24' : 'none'} 
                      color={rating >= star ? '#fbbf24' : 'var(--text-muted)'}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => setRating(star)} 
                    />
                 ))}
              </div>
            </div>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nội dung nhận xét</label>
              <textarea 
                rows={4} 
                value={reviewText} 
                onChange={e => setReviewText(e.target.value)} 
                placeholder="Chia sẻ trải nghiệm của bạn về không gian, đồ uống, nhân viên..."
                className="form-input"
              />
            </div>
            
            <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setShowReviewModal(false)}>Hủy</button>
              <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={handleSubmitReview}>Gửi đánh giá</button>
            </div>
          </div>
        </div>
      )}

    </article>
  )
}

export default Detail
