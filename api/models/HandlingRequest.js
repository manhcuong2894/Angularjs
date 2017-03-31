/**
 * HandlingRequest.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: false,

  autoUpdatedAt: false,

  connection: 'someMysqlServer',

  tableName: 'TBL_XuLyKhieuNai',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'ID'
    },

    requestId: {
      type: 'integer',
      columnName: 'IDKhieuNai'
    },

    handlers: {
      model: 'user',
      columnName: 'IDNguoiXuLy'
    },

    manipulation: {
      type: 'integer',
      columnName: 'ThaoTac'
    },

    description: {
      type: 'string',
      defaultsTo: '',
      columnName: 'MoTa'
    },

    timeHandling: {
      type: 'datetime',
      columnName: 'ThoiGianXuLy'
    }

  }

};

