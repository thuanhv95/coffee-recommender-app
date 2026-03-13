import React, { useState } from 'react'
import { submitSuggestion } from '../api'

function Suggest() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await submitSuggestion(data)
      if (response.ok) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const err = await response.json()
        alert(`Lỗi: ${err.detail || 'Không thể gửi đề xuất. Vui lòng thử lại sau.'}`)
      }
    } catch (error) {
      alert('Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="section__inner" style={{ maxWidth: '600px' }}>
        <h1 className="section__title">Đề xuất quán mới</h1>
        <p className="section__desc">Bạn biết một quán cà phê tuyệt vời chưa có trên Danang Coffee? Hãy chia sẻ với chúng mình nhé!</p>

        {submitted ? (
          <div className="suggest-success" id="suggest-success" style={{ display: 'block', textAlign: 'center', padding: '3rem', background: '#F0F9FF', borderRadius: '12px' }}>
            <h2 style={{ color: '#0369A1', marginBottom: '1rem' }}>Cảm ơn bạn đã đóng góp!</h2>
            <p>Thông tin quán đã được gửi đến đội ngũ của chúng mình để kiểm duyệt.</p>
            <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>Gửi thêm đề xuất</button>
          </div>
        ) : (
          <form className="suggest-form" id="suggest-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên quán cà phê *</label>
              <input type="text" name="name" className="form-input" required placeholder="Ví dụ: Lumi Lab" />
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ (nếu biết)</label>
              <input type="text" name="address" className="form-input" placeholder="Ví dụ: 99 Lê Lợi" />
            </div>
            <div className="form-group">
              <label className="form-label">Quận *</label>
              <select name="district" className="form-input" required>
                <option value="Hải Châu">Hải Châu</option>
                <option value="Thanh Khê">Thanh Khê</option>
                <option value="Sơn Trà">Sơn Trà</option>
                <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
                <option value="Liên Chiểu">Liên Chiểu</option>
                <option value="Cẩm Lệ">Cẩm Lệ</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tại sao bạn thích quán này?</label>
              <textarea name="reason" className="form-input" rows="4" placeholder="Chia sẻ cảm nhận của bạn về không gian, thức uống..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Link Facebook / Instagram / Google Maps</label>
              <input type="text" name="link" className="form-input" placeholder="https://..." />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              {loading ? 'Đang gửi...' : 'Gửi đề xuất ngay'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Suggest
