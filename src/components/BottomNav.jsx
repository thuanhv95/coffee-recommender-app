import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Edit3, Info } from 'lucide-react'

function BottomNav() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/index.html')

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav__item ${isActive('/') ? 'bottom-nav__item--active' : ''}`}>
        <Home size={20} />
        Trang chủ
      </Link>
      <Link to="/search" className={`bottom-nav__item ${isActive('/search') ? 'bottom-nav__item--active' : ''}`}>
        <Search size={20} />
        Tìm kiếm
      </Link>
      <Link to="/suggest" className={`bottom-nav__item ${isActive('/suggest') ? 'bottom-nav__item--active' : ''}`}>
        <Edit3 size={20} />
        Đề xuất
      </Link>
      <Link to="/about" className={`bottom-nav__item ${isActive('/about') ? 'bottom-nav__item--active' : ''}`}>
        <Info size={20} />
        Chúng tôi
      </Link>
    </nav>
  )
}

export default BottomNav
