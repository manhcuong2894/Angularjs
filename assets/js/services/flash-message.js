+App.factory('FlashMessage', function() {
  'use strict';
  return {
    TOKEN_EXPIRED: 'Token expired, please relogged in!',
    CREATE_SUCCESS: 'Tạo mới thành công',
    CREATE_ERROR: 'Tạo mới không thành công',
    UPDATE_SUCCESS: 'Cập nhật thành công',
    UPDATE_ERROR: 'Cập nhật không thành công',

    LOGIN_SUCCESS: 'Đăng nhập thành công',
    DELETE_SUCCESS: 'Xóa tài khoản thành công',
    DELETE_ERROR: 'Có lỗi trong quá trình xóa tài khoản',

    UPDATE_STATUS_SUCCESS: 'Cập nhật trạng thái thành công',
    UPDATE_STATUS_ERROR: 'Cập nhật trạng thái không thành công'
  }
});
