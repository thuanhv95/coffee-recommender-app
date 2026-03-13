import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchFilters } from '../api'

function Home() {
  const [filters, setFilters] = useState(null)

  useEffect(() => {
    fetchFilters().then(setFilters)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-element');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filters]);

  return (
    <>
      <section className="hero fade-in-element">
        <div className="hero__inner">
          <div className="hero__content">
            <h1 className="hero__title">Cafe là văn hóa</h1>
            <h2 className="hero__subtitle">Khám phá góc nhỏ tuyệt vời tại Đà Nẵng</h2>
            <p className="hero__desc">Tổng hợp những quán cà phê có không gian đẹp nhất, cà phê ngon nhất và trải nghiệm tuyệt nhất tại thành phố biển.</p>
            <Link to="/search" className="hero__cta">Khám phá ngay</Link>
          </div>
          <div className="hero__image">
            <img src="/images/hero-illustration.png" alt="Coffee Illustration" />
          </div>
        </div>
      </section>

      <section className="section section--districts">
        <div className="section__inner">
          <h2 className="section__title fade-in-element">Tìm kiếm theo khu vực</h2>
          <p className="section__desc fade-in-element">Chọn quận bạn muốn khám phá để tìm thấy những quán gần bạn nhất.</p>
          <div className="card-grid card-grid--6 fade-in-element">
            {filters?.districts.map(d => (
              <Link key={d} to={`/search?district=${encodeURIComponent(d)}`} className="district-card">
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--purpose">
        <div className="purpose__bg" style={{ backgroundImage: "url('/images/coffee-shop-bg.jpg')" }}></div>
        <div className="purpose__overlay"></div>
        <div className="section__inner purpose__content">
          <h2 className="section__title section__title--light fade-in-element">Phong cách & Mục đích</h2>
          <p className="section__desc section__desc--light fade-in-element">Bạn đang tìm kiếm không gian cho buổi họp, học bài hay một góc yên tĩnh? Chúng mình có đủ!</p>
          <div className="tag-grid fade-in-element">
            {filters?.purposes.map(p => (
              <Link key={p} to={`/search?purpose=${encodeURIComponent(p)}`} className="tag-pill">
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--space">
        <div className="section__inner">
          <h2 className="section__title fade-in-element">Không gian yêu thích</h2>
          <p className="section__desc fade-in-element">Sân thượng ngắm hoàng hôn hay không gian máy lạnh yên tĩnh?</p>
          <div className="card-grid card-grid--5 fade-in-element">
            {filters?.spaces.map(s => (
              <Link key={s} to={`/search?space=${encodeURIComponent(s)}`} className="district-card">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="skyline">
        <img src="/images/skyline.png" alt="Danang Skyline" />
      </div>
    </>
  )
}

export default Home
