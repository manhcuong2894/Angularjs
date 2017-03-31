/**
 * Document.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedAt: false,

  autoUpdatedAt: false,

  connection: 'someMysqlServer',

  tableName: 'TBL_TaiLieu',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'ID'
    },

    fileName: {
      type: 'string',
      defaultsTo: '',
      columnName: 'TenFile'
    },

    fileNameDownload: {
      type: 'string',
      defaultsTo: '',
      columnName: 'FileName'
    },

    description: {
      type: 'string',
      defaultsTo: '',
      columnName: 'MoTa'
    },

    file: {
      type: 'string',
      columnName: 'DuongDanFile'
    },

    uploadDate: {
      type: 'datetime',
      columnName: 'NgayUpload'
    },

    uploadPerson: {
      model: 'user',
      dominant: true,
      columnName: 'IDNguoiUpload'
    },

    service: {
      model: 'service',
      columnName: 'IDDichVu'
    }

  }
};

