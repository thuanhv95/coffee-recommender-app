import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../api'
import { LogIn, ShieldAlert } from 'lucide-react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginAdmin(username, password)
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('admin_user', JSON.stringify(data))
        // Trigger a custom event so other components know the auth state changed
        window.dispatchEvent(new Event('authChange'))
        navigate('/admin/suggestions')
      } else {
        const err = await response.json()
        setError(err.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.')
      }
    } catch (err) {
      setError('Lỗi kết nối server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="section__inner" style={{ maxWidth: '400px', padding: '80px 20px' }}>
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <ShieldAlert size={32} />
            </div>
            <h1>Admin Login</h1>
            <p>Vui lòng đăng nhập để quản lý hệ thống</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="login-error">{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <input 
                type="text" 
                className="form-input" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="admin"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              <LogIn size={18} style={{ marginRight: '8px' }} />
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
