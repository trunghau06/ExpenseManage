import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import axiosClient from '../../../../api/axiosClient';

import {
  updateUser,
} from '../../../../features/auth/authSlice';

import './InfoCard.css';

const getAvatarUrl = (
  avatarUrl
) => {
  if (!avatarUrl) {
    return '';
  }

  if (
    avatarUrl.startsWith(
      'http://'
    ) ||
    avatarUrl.startsWith(
      'https://'
    )
  ) {
    return avatarUrl;
  }

  return `http://localhost:5000${avatarUrl}`;
};

export default function InfoCard() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const fileInputRef =
    useRef(null);

  const [phone, setPhone] =
    useState('');

  const [
    avatarFile,
    setAvatarFile,
  ] = useState(null);

  const [
    avatarPreview,
    setAvatarPreview,
  ] = useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [
    messageType,
    setMessageType,
  ] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response =
        await axiosClient.get(
          '/users/me'
        );

      const profile =
        response.data;

      dispatch(
        updateUser(profile)
      );

      setPhone(
        profile?.phone || ''
      );

      setAvatarPreview(
        getAvatarUrl(
          profile?.avatar_url
        )
      );
    } catch (error) {
      console.error(error);

      setMessage(
        'Không thể tải thông tin tài khoản'
      );

      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer =
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  useEffect(() => {
    return () => {
      if (
        avatarPreview &&
        avatarPreview.startsWith(
          'blob:'
        )
      ) {
        URL.revokeObjectURL(
          avatarPreview
        );
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (
      !validTypes.includes(
        file.type
      )
    ) {
      setMessage(
        'Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP'
      );

      setMessageType('error');

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setMessage(
        'Ảnh không được lớn hơn 5MB'
      );

      setMessageType('error');

      return;
    }

    if (
      avatarPreview &&
      avatarPreview.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        avatarPreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setAvatarFile(file);
    setAvatarPreview(
      previewUrl
    );

    setMessage(
      'Ảnh mới chưa được lưu'
    );

    setMessageType('success');
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const phoneValue =
      phone.trim();

    if (!phoneValue) {
      setMessage(
        'Vui lòng nhập số điện thoại'
      );

      setMessageType('error');

      return;
    }

    const phoneRegex =
      /^(0[35789]\d{8}|\+84[35789]\d{8})$/;

    if (
      !phoneRegex.test(
        phoneValue
      )
    ) {
      setMessage(
        'Số điện thoại không hợp lệ'
      );

      setMessageType('error');

      return;
    }

    try {
      setSaving(true);
      setMessage('');

      const profileResponse =
        await axiosClient.patch(
          '/users/me',
          {
            phone: phoneValue,
          }
        );

      let updatedUser =
        profileResponse.data.user;

      if (avatarFile) {
        const formData =
          new FormData();

        formData.append(
          'avatar',
          avatarFile
        );

        const avatarResponse =
          await axiosClient.patch(
            '/users/me/avatar',
            formData
          );

        updatedUser =
          avatarResponse.data.user;

        setAvatarFile(null);

        setAvatarPreview(
          getAvatarUrl(
            updatedUser.avatar_url
          )
        );
      }

      dispatch(
        updateUser(updatedUser)
      );

      setPhone(
        updatedUser.phone || ''
      );

      setMessage(
        'Đã lưu thay đổi'
      );

      setMessageType(
        'success'
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data
          ?.message ||
          'Không thể lưu thông tin'
      );

      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-card info-card">
      <div className="settings-card__heading">
        <div className="settings-card__heading--title">
          <h3>
            Thông tin tài khoản
          </h3>

          <p>
            Thông tin cá nhân của tài khoản
          </p>
        </div>
      </div>

      <div className="info-card__avatar-section">
        <div className="info-card__avatar-wrapper">
          <div className="info-card__avatar">
            {avatarPreview ? (
              <img
                src={
                  avatarPreview
                }
                alt="Ảnh đại diện"
              />
            ) : (
              <i className="fa-regular fa-user"></i>
            )}
          </div>

          <span className="info-card__status-dot"></span>
        </div>

        <div className="info-card__avatar-content">
          <strong>
            {user?.name ||
              'Người dùng'}
          </strong>

          <span>
            Tài khoản đang hoạt động
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={
              handleAvatarChange
            }
          />

          <button
            type="button"
            className="info-card__avatar-btn"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <i className="fa-solid fa-camera"></i>

            Thay đổi ảnh
          </button>

          {avatarFile && (
            <span className="info-card__avatar-note">
              Ảnh mới chưa được lưu
            </span>
          )}
        </div>
      </div>

      <form
        className="info-card__form"
        onSubmit={handleSubmit}
      >
        <div className="info-field">
          <label className="info-field__label">
            Họ và tên
          </label>

          <div className="info-field__display">
            <i className="fa-regular fa-user"></i>

            <span>
              {loading
                ? 'Đang tải...'
                : user?.name ||
                  'Chưa có thông tin'}
            </span>
          </div>
        </div>

        <div className="info-field">
          <label className="info-field__label">
            Địa chỉ Email
          </label>

          <div className="info-field__display">
            <i className="fa-regular fa-envelope"></i>

            <span>
              {loading
                ? 'Đang tải...'
                : user?.email ||
                  'Chưa có thông tin'}
            </span>
          </div>
        </div>

        <div className="info-field">
          <label
            className="info-field__label"
            htmlFor="phone"
          >
            Số điện thoại
          </label>

          <div className="info-field__input-box">
            <i className="fa-solid fa-phone info-field__icon"></i>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(
                  e.target.value
                );

                setMessage('');
              }}
              placeholder="Nhập số điện thoại"
              disabled={
                loading ||
                saving
              }
            />
          </div>

          {!user?.phone &&
            !loading &&
            !message && (
              <span className="info-field__hint">
                Bạn chưa thêm số điện thoại
              </span>
            )}

          {message && (
            <span
              className={`info-field__message info-field__message--${messageType}`}
            >
              {message}
            </span>
          )}
        </div>

        <div className="info-card__actions">
          <button
            type="submit"
            className="info-card__save-btn"
            disabled={
              saving ||
              loading
            }
          >
            <i className="fa-solid fa-floppy-disk"></i>

            {saving
              ? 'Đang lưu...'
              : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}