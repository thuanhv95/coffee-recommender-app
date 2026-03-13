import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { fetchShops, fetchFilters } from '../api'
import ShopCard from '../components/ShopCard'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [shopsData, setShopsData] = useState(null)
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMoreGroups, setShowMoreGroups] = useState({})
  const [collapsedGroups, setCollapsedGroups] = useState({})
  const [showSidebar, setShowSidebar] = useState(true)

  const toggleShowMore = (group) => {
    setShowMoreGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const toggleCollapse = (group) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  useEffect(() => {
    fetchFilters().then(setFilters)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {
      search: searchParams.get('search'),
      district: searchParams.getAll('district'),
      purpose: searchParams.getAll('purpose'),
      space: searchParams.getAll('space'),
      amenity: searchParams.getAll('amenity'),
      status: searchParams.get('status'),
      lat: searchParams.get('lat'),
      lon: searchParams.get('lon'),
      page: parseInt(searchParams.get('page')) || 1,
      limit: 25,
    }
    fetchShops(params).then(data => {
      setShopsData(data)
      setLoading(false)
    })
  }, [searchParams])

  const handleCheckboxChange = (type, value, checked) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', 1) // Reset to page 1 on filter change
    if (checked) {
      if (type === 'status') {
        newParams.set(type, value)
      } else {
        newParams.append(type, value)
      }
    } else {
      if (type === 'status') {
        newParams.delete(type)
      } else {
        const currentArr = newParams.getAll(type).filter(v => v !== value)
        newParams.delete(type)
        currentArr.forEach(v => newParams.append(type, v))
      }
    }
    setSearchParams(newParams)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = e.target.search.value.trim()
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', 1) // Reset to page 1 on search
    if (query) {
      newParams.set('search', query)
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage)
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const Pagination = ({ total, page, limit }) => {
    const totalPages = Math.ceil(total / limit)
    if (totalPages <= 1) return null

    const pages = []
    let startPage = Math.max(1, page - 2)
    let endPage = Math.min(totalPages, page + 2)

    if (page <= 3) endPage = Math.min(5, totalPages)
    if (page > totalPages - 2) startPage = Math.max(1, totalPages - 4)

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return (
      <div className="pagination">
        <button 
          className="pagination__btn" 
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        
        {startPage > 1 && (
          <>
            <button className="pagination__item" onClick={() => handlePageChange(1)}>1</button>
            {startPage > 2 && <span className="pagination__dots">...</span>}
          </>
        )}

        {pages.map(p => (
          <button 
            key={p} 
            className={`pagination__item ${p === page ? 'is-active' : ''}`}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination__dots">...</span>}
            <button className="pagination__item" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
          </>
        )}

        <button 
          className="pagination__btn" 
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  const renderFilterGroup = (title, type, items) => {
    if (!items) return null
    const displayItems = showMoreGroups[type] ? items : items.slice(0, 10)
    const isCollapsed = collapsedGroups[type]
    
    return (
      <div className="filter-group">
        <h3 className="filter-group__title" onClick={() => toggleCollapse(type)}>
          {title}
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </h3>
        {!isCollapsed && (
          <div className="filter-group__items">
            {displayItems.map(item => (
              <label key={item} className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={searchParams.getAll(type).includes(item)}
                  onChange={(e) => handleCheckboxChange(type, item, e.target.checked)}
                />
                {item}
              </label>
            ))}
            {items.length > 10 && (
              <button className="filter-expand" onClick={() => toggleShowMore(type)}>
                {showMoreGroups[type] ? <><ChevronUp size={14}/> Thu gọn</> : <><ChevronDown size={14}/> Xem thêm</>}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="search-page">
      <header className="search-hero">
        <h1 className="search-hero__title">Tìm ngay quán cà phê gần bạn</h1>
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            name="search"
            className="search-bar__input" 
            placeholder="Nhập tên quán, tên đường bạn muốn tìm ..." 
            defaultValue={searchParams.get('search') || ''}
          />
          <button type="submit" className="search-bar__btn">
            <SearchIcon size={20} />
          </button>
        </form>
      </header>

      <div className={`search-content ${!showSidebar ? 'is-sidebar-hidden' : ''}`}>
        {showSidebar && (
          <aside className="sidebar">
            <div className="filter-group">
              <h3 className="filter-group__title" onClick={() => toggleCollapse('status')}>
                Trạng thái
                {collapsedGroups['status'] ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </h3>
              {!collapsedGroups['status'] && (
                <div className="filter-group__items">
                  {[
                    { label: 'Mới mở', value: 'new' },
                    { label: 'Đang mở', value: 'open' },
                    { label: 'Tạm đóng', value: 'closed_temp' },
                    { label: 'Đã đóng', value: 'closed_permanent' }
                  ].map(s => (
                    <label key={s.value} className="filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={searchParams.get('status') === s.value}
                        onChange={(e) => handleCheckboxChange('status', s.value, e.target.checked)}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {filters && (
              <>
                {renderFilterGroup('Phường (Xã)', 'district', filters.districts)}
                {renderFilterGroup('Loại hình', 'purpose', filters.purposes)}
                {renderFilterGroup('Không gian', 'space', filters.spaces)}
                {renderFilterGroup('Tiện ích', 'amenity', filters.amenities)}
              </>
            )}
          </aside>
        )}

        <section className="results">
          <div className="results-header">
            <button 
              className="filter-toggle"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <><X size={18} /> Ẩn bộ lọc</> : <><SlidersHorizontal size={18} /> Hiện bộ lọc</>}
            </button>
            <div className="search-count">
              {loading ? 'Đang tìm kiếm...' : shopsData ? `Hiển thị ${(shopsData.page-1)*shopsData.limit + 1} – ${Math.min(shopsData.page*shopsData.limit, shopsData.total)} trong tổng số ${shopsData.total} quán` : 'Không tìm thấy kết quả'}
            </div>
          </div>

          <div className="shop-grid">
            {shopsData?.shops.map((shop) => (
              <ShopCard key={shop.slug} shop={shop} />
            ))}
          </div>

          <Pagination 
            total={shopsData?.total || 0} 
            page={shopsData?.page || 1} 
            limit={shopsData?.limit || 25} 
          />
        </section>
      </div>
    </div>
  )
}

export default Search
