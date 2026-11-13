export const formatDate = (date: Date = new Date()): string => {
  const weekday = date.toLocaleDateString('vi-VN', {
    weekday: 'long',
  });

  return `${weekday}, ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
};