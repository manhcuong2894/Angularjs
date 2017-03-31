/**
 * RequestOutOfDateReport.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: false,

  autoUpdatedAt: false,

  connection: 'someMysqlServer',

  attributes: {

    TenDayDu: {
      type: 'string'
    },

    DangXuLy: {
      type: 'integer'
    },

    ChuaXuLy: {
      type: 'integer'
    },

    Tong: {
      type: 'integer'
    }

  }

};

