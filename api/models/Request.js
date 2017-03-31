/**
 * Request.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: false,

  autoUpdatedAt: false,

  connection: 'someMysqlServer',

  tableName: 'TBL_KhieuNai',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'ID'
    },

    ticketCode: {
      type: 'string',
      defaultsTo: '',
      columnName: 'MaTicket'
    },

    service: {
      model: 'service',
      columnName: 'IDDichVu'
    },

    timeRequest: {
      type: 'datetime',
      columnName: 'ThoiGian'
    },

    contact: {
      type: 'string',
      defaultsTo: '',
      columnName: 'ThongTinLienHe'
    },

    status: {
      type: 'integer',
      columnName: 'TinhTrang'
    },

    level: {
      type: 'integer',
      columnName: 'MucDo'
    },

    content: {
      type: 'string',
      defaultsTo: '',
      columnName: 'NoiDungKhieuNai'
    },

    file: {
      type: 'string',
      defaultsTo: '',
      columnName: 'FileDinhKem'
    },

    fileName: {
      type: 'string',
      defaultsTo: '',
      columnName: 'FileName'
    },

    createBy: {
      model: 'user',
      columnName: 'IDNguoiTao'
    },

    assigned: {
      model: 'user',
      columnName: 'IDNguoiGanXuLy'
    },

    createAt: {
      type: 'datetime',
      columnName: 'ThoiGianTao'
    },

    reopen: {
      type: 'integer',
      columnName: 'Reopen'
    },

    editedAt: {
      type: 'datetime',
      columnName: 'ThoiGianCapNhat'
    },

    handlers: {
      model: 'user',
      columnName: 'IDNguoiXuLy'
    },

    contentHandling: {
      type: 'string',
      defaultsTo: '',
      columnName: 'NoiDungXuLy'
    },

    reason: {
      type: 'string',
      defaultsTo: '',
      columnName: 'LyDo'
    },

    reopenFirstTime: {
      type: 'datetime',
      columnName: 'ThoiGianMoLaiLanDau'
    },

    timeHandling: {
      type: 'datetime',
      columnName: 'ThoiGianXuLy'
    },

    channel: {
      type: 'string',
      columnName: 'KenhTiepNhan'
    },

    sla: {
      type: 'integer',
      columnName: 'SLA'
    },

    number: {
      type: 'integer',
      columnName: 'SoLuong'
    },

    responsible: {
      model: 'user',
      columnName: 'IDNguoiChiuTrachNhiem'
    }

  }

};

