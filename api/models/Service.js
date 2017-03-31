/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: false,

  autoUpdatedAt: false,

  connection: 'someMysqlServer',

  tableName: 'TBL_Services',

  attributes: {

    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'ID'

    },

    shortName: {
      type: 'string',
      required: true,
      defaultsTo: '',
      unique: true,
      columnName: 'ShortName'
    },

    serviceName: {
      type: 'string',
      required: true,
      defaultsTo: '',
      columnName: 'FullName'
    },

    status: {
      type: 'integer',
      columnName: 'Status'
    },

    description: {
      type: 'string',
      defaultsTo: '',
      columnName: 'Description'
    },

    createAt: {
      type: 'datetime',
      columnName: 'CreateTime'
    },

    createBy: {
      type: 'string',
      defaultsTo: '',
      columnName: 'Creator'
    },

    editedAt: {
      type: 'datetime',
      columnName: 'UpdateTime'
    },

    editedBy: {
      type: 'string',
      defaultsTo: '',
      columnName: 'Updator'
    }
    // ,

    // service_document: {
    //   collection: "document", // match model name here
    //   via: 'service', // match attribute name on other model
    //   dominant: true // dominant side
    // },

    // service_request: {
    //   collection: "request", // match model name here
    //   via: 'service', // match attribute name on other model
    //   dominant: true // dominant side
    // }

  }
};

