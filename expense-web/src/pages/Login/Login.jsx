import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';
import AxiosClient from '../../api/axiosClient';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const emailSaved = localStorage.getItem('remembered_email');
    if (emailSaved) {
      setEmail(emailSaved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setLoading(true);

    try {
      const res = await AxiosClient.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (rememberMe) {
        localStorage.setItem('remembered_email', email.trim());
      } else {
        localStorage.removeItem('remembered_email');
      }

      dispatch(
        loginSuccess({
          token: res.data.token,
          user: res.data.user,
          rememberMe,
        })
      );

      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-login">
        <div className="form-login__greeting">
          <div className="form-login__icon">
            <i className="fa-solid fa-chart-column"></i>
          </div>
          <div className="form-login__brand">
            <h1 className="form-login__brand-name">
              FinFlow
              <span>.</span>
            </h1>
          </div>
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>

        {error && (
          <div className="form-login__error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-frame">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <i className="fa-regular fa-envelope input-icon"></i>
              <input
                id="email"
                type="email"
                placeholder="vidu@email.com"
                className="input-field"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>
          </div>

          <div className="input-frame">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-lock input-icon"></i>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-field input-field--password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                required
              />
              <i
                className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div className="form-login__note">
            <label className="form-login__note--remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#forgot" className="forgot-link">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="form-login__btn" disabled={loading}>
            <span>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <div className="form-login__other">
          <span>Chưa có tài khoản?</span>
          <NavLink to="/register" className="register-link">
            Đăng ký ngay
          </NavLink>
        </div>
      </div>
    </div>
  );
}