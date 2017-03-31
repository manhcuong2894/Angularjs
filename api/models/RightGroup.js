/**
 * RightGroup.js
 *
 * @description :: RightGroup model
 * @auth        :: TuanAnh
 */

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'someMysqlServer',
  tableName: 'TBL_PermissionSet',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'ID'
    },

    groupName: {
      type: 'string',
      required: true,
      unique: true,
      columnName: 'FullName'
    },

    description: {
      type: 'string',
      defaultsTo: '',
      columnName: 'Description'
    },

    roleId_user: {
      collection: "user", // match model name here
      via: 'roleId' // match attribute name on other model
    },

    createAt: {
      type: 'datetime',
      columnName: 'CreateTime'
    },

    editedAt: {
      type: 'datetime',
      columnName: 'UpdateTime'
    },

    createBy: {
      type: 'string',
      columnName: 'Creator'
    },

    status: {
      type: 'integer',
      columnName: 'Status'
    },

    editedBy: {
      type: 'string',
      columnName: 'Updator'
    },


    /**
     * [features Many to many relationship]
     * @auth TuanAnh
     */
    features: {
      collection: 'feature', // match model name here
      via: 'owners', // match attribute name on other model
      dominant: true // dominant side
    }
  }
};

