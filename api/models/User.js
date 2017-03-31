/**
 * User
 * @description :: Model for storing users
 */
module.exports = {

  autoCreatedAt: false,

  autoUpdatedAt: false,

  connection: 'someMysqlServer',

  tableName: 'TBL_Users',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'ID'
    },

    username: {
      type: 'string',
      required: true,
      unique: true,
      columnName: 'UserName'
    },

    fullName: {
      type: 'string',
      columnName: 'FullName'
    },

    email: {
      type: 'string',
      columnName: 'Email'
    },

    phoneNumber: {
      type: 'string',
      columnName: 'PhoneNumber'
    },

    password: {
      type: 'string',
      columnName: 'Password'
    },

    roleId: {
      model: "RightGroup",
      columnName: 'PermissionSetID'
    },

    status: {
      type: 'string',
      columnName: 'Status'
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

    editedBy: {
      type: 'string',
      columnName: 'Updator'
    },

    // manager: {
    //   type: 'string',
    //   columnName: 'QuanLy'
    // },

    avatar: {
      type: 'string',
      columnName: 'Avatar'
    },

    uploadPerson_document: {
      collection: 'document', // match model name here
      via: 'uploadPerson', // match attribute name on other model
      dominant: true // dominant side
    },

    creator_request: {
      collection: "request", // match model name here
      via: 'createBy', // match attribute name on other model
      dominant: true // dominant side
    },

    assigned_request: {
      collection: "request", // match model name here
      via: 'assigned', // match attribute name on other model
      dominant: true // dominant side
    },

    handler_request: {
      collection: "request", // match model name here
      via: 'handlers', // match attribute name on other model
      dominant: true // dominant side
    },

    handler_handling: {
      collection: "HandlingRequest", // match model name here
      via: 'handlers', // match attribute name on other model
      dominant: true // dominant side
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeUpdate: function (values, next) {
    CipherService.hashPassword(values);
    console.log('aaa');
    next();
  }

  // beforeCreate: function (values, next) {
  //   console.log('bbb');
  //   CipherService.hashPassword(values);
  //   next();
  // }

};
