import { useState, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    if (!password) {
      return { score: 0, label: 'Bảo mật', color: 'var(--border)' };
    }

    let points = 0;
    if (password.length >= 8) points += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) points += 1;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) points += 1;

    if (points === 1) {
      return { score: 1, label: 'Yếu', color: 'var(--expense)' };
    }
    if (points === 2) {
      return { score: 2, label: 'Trung bình', color: '#F59E0B' };
    }
    if (points === 3) {
      return { score: 3, label: 'Mạnh', color: 'var(--income)' };
    }

    return { score: 1, label: 'Yếu', color: 'var(--expense)' };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên!');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Địa chỉ email không hợp lệ!');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }
    if (passwordStrength.score < 2) {
      setErrorMsg('Mật khẩu quá yếu (cần kết hợp chữ hoa, chữ thường và số)!');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp!');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật!');
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-register">
        <div className="form-register__greeting">
          <div className="form-register__icon">
            <i className="fa-solid fa-chart-column"></i>
          </div>
          <h2>Tạo tài khoản mới</h2>
          <p>Bắt đầu kiểm soát tài chính cá nhân hiệu quả từ hôm nay</p>
        </div>

        {errorMsg && (
          <div className="form-register__error-box">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-frame">
            <div className="label-wrapper">
              <label htmlFor="fullname">Họ và tên</label>
              <span className="input-hint">Bắt buộc</span>
            </div>
            <div className="input-wrapper">
              <i className="fa-regular fa-user input-icon"></i>
              <input
                id="fullname"
                type="text"
                placeholder="Nguyễn Văn A"
                className="input-field"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                required
              />
            </div>
          </div>

          <div className="input-frame">
            <div className="label-wrapper">
              <label htmlFor="email">Email</label>
              <span className="input-hint">Bắt buộc</span>
            </div>
            <div className="input-wrapper">
              <i className="fa-regular fa-envelope input-icon"></i>
              <input
                id="email"
                type="email"
                placeholder="nguyenvana@gmail.com"
                className="input-field"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                required
              />
            </div>
          </div>

          <div className="input-frame">
            <div className="label-wrapper">
              <label htmlFor="password">Mật khẩu</label>
              <span className="input-hint">Ít nhất 8 ký tự</span>
            </div>
            <div className="input-wrapper">
              <i className="fa-solid fa-lock input-icon"></i>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ít nhất 8 ký tự"
                className="input-field input-field--password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                required
              />
              <i
                className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div className="form-register__strength">
            <div className="form-register__track">
              <span
                className="form-register__segment"
                style={{
                  backgroundColor: passwordStrength.score >= 1 ? passwordStrength.color : 'var(--border)',
                }}
              ></span>
              <span
                className="form-register__segment"
                style={{
                  backgroundColor: passwordStrength.score >= 2 ? passwordStrength.color : 'var(--border)',
                }}
              ></span>
              <span
                className="form-register__segment"
                style={{
                  backgroundColor: passwordStrength.score >= 3 ? passwordStrength.color : 'var(--border)',
                }}
              ></span>
            </div>
            <span
              className="form-register__strength-label"
              style={{ color: passwordStrength.score > 0 ? passwordStrength.color : 'var(--text-muted)' }}
            >
              {passwordStrength.label}
            </span>
          </div>

          <div className="input-frame">
            <div className="label-wrapper">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            </div>
            <div className="input-wrapper">
              <i className="fa-solid fa-shield-halved input-icon"></i>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                className="input-field input-field--password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                required
              />
              <i
                className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password-icon`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
          </div>

          <div className="form-register__terms">
            <label className="form-register__checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errorMsg) setErrorMsg('');
                }}
              />
              <span>
                Tôi đồng ý với <a href="#terms" className="terms-link">Điều khoản dịch vụ</a> và{' '}
                <a href="#privacy" className="terms-link">Chính sách bảo mật</a>
              </span>
            </label>
          </div>

          <button type="submit" className="form-register__btn" disabled={loading}>
            <span>{loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <div className="form-register__other">
          <span>Đã có tài khoản?</span>
          <NavLink to="/login" className="login-link">Đăng nhập</NavLink>
        </div>
      </div>
    </div>
  );
}