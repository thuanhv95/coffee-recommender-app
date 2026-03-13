import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Info, Edit3, Menu } from 'lucide-react'

function Header({ isScrolled, toggleDrawer }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/index.html')

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`} id="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#2C3E50"/>
              <path d="M10 10C10 8.89543 10.8954 8 12 8H20C21.1046 8 22 8.89543 22 10V14C22 17.3137 19.3137 20 16 20C12.6863 20 10 17.3137 10 14V10Z" fill="#C17A2F"/>
              <path d="M22 12H23C24.1046 12 25 12.8954 25 14C25 15.1046 24.1046 16 23 16H22V12Z" fill="#C17A2F"/>
              <path d="M11 24H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-text__name">Danang</span>
            <span className="logo-text__sub">COFFEE</span>
          </div>
        </Link>

        <nav className="header__nav">
          <Link to="/" className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}>
            <Home size={18} />
            Trang chủ
          </Link>
          <Link to="/search" className={`header__nav-link ${isActive('/search') ? 'header__nav-link--active' : ''}`}>
            <Search size={18} />
            Tìm kiếm
          </Link>
          <Link to="/suggest" className={`header__nav-link ${isActive('/suggest') ? 'header__nav-link--active' : ''}`}>
            <Edit3 size={18} />
            Đề xuất
          </Link>
          <Link to="/about" className={`header__nav-link ${isActive('/about') ? 'header__nav-link--active' : ''}`}>
            <Info size={18} />
            Giới thiệu
          </Link>
        </nav>

        <button className="header__hamburger" onClick={toggleDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header
