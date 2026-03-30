import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col footer__col--logo">
          <Link to="/" className="header__logo logo-text--footer">
            <div className="logo-text">
              <span className="logo-text__name">Danang</span>
              <span className="logo-text__sub">COFFEE</span>
            </div>
          </Link>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '20px' }}>
            Cẩm nang khám phá những quán cà phê "chất" nhất Đà Nẵng.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link"><Facebook size={20} /></a>
            <a href="#" className="footer__social-link"><Instagram size={20} /></a>
            <a href="#" className="footer__social-link"><Twitter size={20} /></a>
          </div>
        </div>
        <div className="footer__col">
          <h3 className="footer__heading">Khám phá</h3>
          <Link to="/search?status=new" className="footer__link">Quán mới mở</Link>
          <Link to="/search?space=Sân thượng" className="footer__link">View sân thượng</Link>
          <Link to="/search?purpose=Ngồi làm việc" className="footer__link">Làm việc & Laptop</Link>
        </div>
        <div className="footer__col">
          <h3 className="footer__heading">Thành phố</h3>
          <Link to="/search?district=Hải Châu" className="footer__link">Quận Hải Châu</Link>
          <Link to="/search?district=Sơn Trà" className="footer__link">Quận Sơn Trà</Link>
          <Link to="/search?district=Ngũ Hành Sơn" className="footer__link">Quận Ngũ Hành Sơn</Link>
        </div>
        <div className="footer__col">
          <h3 className="footer__heading">Về chúng mình</h3>
          <Link to="/about" className="footer__link">Giới thiệu</Link>
          <Link to="/suggest" className="footer__link">Gửi đề xuất quán</Link>
          <a href="#" className="footer__link">Liên hệ</a>
        </div>
      </div>
      <div className="footer__bottom">
        &copy; 2026 Coffee For Us
      </div>
    </footer>
  )
}

export default Footer
